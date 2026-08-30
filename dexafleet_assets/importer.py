from __future__ import annotations

import csv
import io
import json

import frappe
from frappe import _
from frappe.utils import get_datetime, getdate


SCHEMAS = {
    "Fine": {"required": ["Fine Number", "Plate No.", "Amount", "Date and Time of Issuing The Fine:"]},
    "Salik": {"required": ["Transaction ID", "Trip Date", "Trip Time", "Plate", "Amount(AED)"]},
    "Rider": {"required": ["Rider ID", "Rider Name"]},
}


def validate_batch(batch) -> None:
    batch.status = "Validating"
    batch.rows = []
    batch.error_log = None
    try:
        records = _read_csv(batch.source_file)
        schema = SCHEMAS.get(batch.import_type)
        if not schema:
            frappe.throw(_("The staged importer for {0} is not enabled yet.").format(batch.import_type))
        headers = set(records[0].keys()) if records else set()
        missing = [header for header in schema["required"] if header not in headers]
        if missing:
            frappe.throw(_("Missing required columns: {0}").format(", ".join(missing)))

        for index, row in enumerate(records, start=2):
            normalized, status, message, identifier = _normalize(batch.import_type, row, batch.company)
            batch.append("rows", {"row_number": index, "source_identifier": identifier, "status": status, "message": message, "normalized_data": json.dumps(normalized, default=str)})
        _recount(batch)
        batch.status = "Blocked" if batch.blocked_count else "Ready with Warnings" if batch.warning_count else "Ready"
    except Exception:
        batch.status = "Failed"
        batch.error_log = frappe.get_traceback()
        raise


def commit_batch(batch) -> None:
    if batch.status not in {"Ready", "Ready with Warnings"}:
        frappe.throw(_("Batch is not ready to commit."))
    if batch.warning_count and not batch.warnings_confirmed:
        frappe.throw(_("Confirm warnings before committing."))
    if batch.blocked_count:
        frappe.throw(_("Blocked rows cannot be committed."))

    batch.status = "Committing"
    for row in batch.rows:
        if row.status not in {"Ready", "Warning"}:
            continue
        try:
            data = json.loads(row.normalized_data)
            doctype = {"Fine": "DexaFleet Fine", "Salik": "DexaFleet Salik Transaction", "Rider": "DexaFleet Rider"}[batch.import_type]
            identity_field = {"Fine": "fine_number", "Salik": "transaction_id", "Rider": "rider_id"}[batch.import_type]
            existing = frappe.db.exists(doctype, {identity_field: data[identity_field]})
            if existing:
                row.status = "Duplicate"
                row.created_doctype = doctype
                row.created_document = existing
                continue
            data.update({"doctype": doctype, "company": batch.company})
            if doctype != "DexaFleet Rider":
                data["import_batch"] = batch.name
            doc = frappe.get_doc(data).insert()
            row.status = "Imported"
            row.created_doctype = doctype
            row.created_document = doc.name
        except Exception as exc:
            row.status = "Failed"
            row.message = str(exc)
    _recount(batch)
    batch.status = "Completed" if not batch.failed_count else "Failed"


def _read_csv(file_url: str) -> list[dict]:
    file_name = frappe.db.get_value("File", {"file_url": file_url}, "name")
    if not file_name:
        frappe.throw("The uploaded CSV file could not be found.")
    file_doc = frappe.get_doc("File", file_name)
    content = file_doc.get_content()
    if isinstance(content, bytes):
        content = content.decode("utf-8-sig")
    return list(csv.DictReader(io.StringIO(content)))


def _normalize(import_type: str, row: dict, company: str):
    if import_type == "Fine":
        identifier = (row.get("Fine Number") or "").strip()
        plate = (row.get("Plate No.") or "").strip().upper()
        try:
            amount = float((row.get("Amount") or "0").replace(",", ""))
            issued_at = get_datetime(row.get("Date and Time of Issuing The Fine:"))
        except Exception:
            return {}, "Blocked", "Invalid amount or issue date/time.", identifier
        if not identifier or not plate or amount <= 0:
            return {}, "Blocked", "Fine Number, Plate and positive Amount are required.", identifier
        return {"fine_number": identifier, "plate_number": plate, "amount": amount, "issued_at": issued_at, "details": row.get("Details"), "location": row.get("Location")}, "Ready", "Validated", identifier
    if import_type == "Salik":
        identifier = (row.get("Transaction ID") or "").strip()
        plate = (row.get("Plate") or "").strip().upper()
        try:
            amount = float((row.get("Amount(AED)") or "0").replace(",", ""))
            trip_at = get_datetime(f"{row.get('Trip Date')} {row.get('Trip Time')}")
        except Exception:
            return {}, "Blocked", "Invalid amount or trip date/time.", identifier
        if not identifier or not plate or amount <= 0:
            return {}, "Blocked", "Transaction ID, Plate and positive Amount are required.", identifier
        return {"transaction_id": identifier, "plate_number": plate, "amount": amount, "trip_at": trip_at, "post_date": getdate(row.get("Transaction Post Date")) if row.get("Transaction Post Date") else None, "toll_gate": row.get("Toll Gate"), "direction": row.get("Direction"), "tag_number": row.get("Tag Number")}, "Ready", "Validated", identifier
    identifier = (row.get("Rider ID") or "").strip()
    name = (row.get("Rider Name") or "").strip()
    if not identifier or not name:
        return {}, "Blocked", "Rider ID and Rider Name are required.", identifier
    return {"rider_id": identifier, "rider_name": name, "email": row.get("Email"), "phone": row.get("Phone"), "emirates_id": row.get("Emirates ID"), "status": row.get("Status") or "Active"}, "Ready", "Validated", identifier


def _recount(batch) -> None:
    batch.row_count = len(batch.rows)
    batch.ready_count = sum(row.status == "Ready" for row in batch.rows)
    batch.warning_count = sum(row.status == "Warning" for row in batch.rows)
    batch.blocked_count = sum(row.status == "Blocked" for row in batch.rows)
    batch.imported_count = sum(row.status in {"Imported", "Duplicate"} for row in batch.rows)
    batch.failed_count = sum(row.status == "Failed" for row in batch.rows)
