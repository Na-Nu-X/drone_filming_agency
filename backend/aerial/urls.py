from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("categories", views.AerialCategoryViewSet, basename="category")
router.register("portfolio", views.AerialProjectViewSet, basename="portfolio")
router.register("services", views.AerialServiceViewSet, basename="service")
router.register("fleet", views.DroneFleetViewSet, basename="fleet")
router.register("pilots", views.PilotMemberViewSet, basename="pilot")
router.register("quotes", views.FlightQuoteRequestViewSet, basename="quote")

urlpatterns = router.urls
