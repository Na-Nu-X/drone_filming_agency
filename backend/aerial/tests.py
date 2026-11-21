from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from .models import AerialProject, FlightQuoteRequest


class ApiSmokeTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_data", verbosity=0)

    def setUp(self):
        self.client = APIClient()

    def test_seed_is_idempotent(self):
        call_command("seed_data", verbosity=0)
        self.assertEqual(AerialProject.objects.count(), 8)

    def test_categories_include_counts(self):
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 6)
        self.assertIn("project_count", response.json()[0])

    def test_portfolio_filters(self):
        featured = self.client.get("/api/portfolio/", {"featured": "true"}).json()
        self.assertTrue(all(p["is_featured"] for p in featured))
        fpv = self.client.get("/api/portfolio/", {"category": "fpv-prelety"}).json()
        self.assertTrue(all(p["category"]["slug"] == "fpv-prelety" for p in fpv))
        search = self.client.get("/api/portfolio/", {"search": "Tatr"}).json()
        self.assertEqual(len(search), 1)

    def test_portfolio_detail(self):
        slug = AerialProject.objects.first().slug
        data = self.client.get(f"/api/portfolio/{slug}/").json()
        self.assertIn("airspace_clearance", data)
        self.assertIn("shoot_summary", data)

    def test_quote_validation_and_create(self):
        bad = self.client.post("/api/quotes/", {"drone_style": "rocket"}, format="json")
        self.assertEqual(bad.status_code, 400)
        payload = {
            "drone_style": "fpv",
            "shoot_location": "Bratislava, Eurovea",
            "location_environment": "mesto",
            "duration_tier": "half_day",
            "post_production_needed": True,
            "contact_name": "Jana Nováková",
            "email": "jana@example.sk",
            "phone": "+421 900 123 456",
            "project_details": "Potrebujeme FPV prelet novým showroomom pre kampaň.",
        }
        ok = self.client.post("/api/quotes/", payload, format="json")
        self.assertEqual(ok.status_code, 201, ok.content)
        self.assertEqual(FlightQuoteRequest.objects.count(), 1)

    def test_quote_endpoint_is_write_only(self):
        self.assertEqual(self.client.get("/api/quotes/").status_code, 405)
