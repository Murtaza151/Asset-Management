from frappe.tests.utils import FrappeTestCase

from key_arabia_assets.utils import money_equal, validate_time_range


class TestUtilities(FrappeTestCase):
    def test_money_equal_rounds_to_currency_precision(self):
        self.assertTrue(money_equal(10.004, 10.00))
        self.assertFalse(money_equal(10.006, 10.00))

    def test_valid_time_range(self):
        validate_time_range("2026-08-30 08:00:00", "2026-08-30 09:00:00")
