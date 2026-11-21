from django.db.models import Count
from rest_framework import mixins, viewsets

from .filters import AerialProjectFilter, AerialServiceFilter
from .models import (
    AerialCategory,
    AerialProject,
    AerialService,
    DroneFleetItem,
    FlightQuoteRequest,
    PilotMember,
)
from .serializers import (
    AerialCategorySerializer,
    AerialProjectDetailSerializer,
    AerialProjectListSerializer,
    AerialServiceSerializer,
    DroneFleetItemSerializer,
    FlightQuoteRequestSerializer,
    PilotMemberSerializer,
)


class AerialCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AerialCategorySerializer
    lookup_field = "slug"
    filter_backends: list = []
    queryset = AerialCategory.objects.annotate(
        project_count=Count("projects", distinct=True),
        service_count=Count("services", distinct=True),
    )


class AerialProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AerialProject.objects.select_related("category")
    lookup_field = "slug"
    filterset_class = AerialProjectFilter
    search_fields = ["title", "location_name", "drone_platform", "client_name"]
    ordering_fields = ["display_order", "created_at", "title"]
    ordering = ["display_order", "-created_at"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AerialProjectDetailSerializer
        return AerialProjectListSerializer


class AerialServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AerialService.objects.select_related("category")
    serializer_class = AerialServiceSerializer
    lookup_field = "slug"
    filterset_class = AerialServiceFilter
    search_fields = ["title", "short_description"]
    ordering_fields = ["display_order", "starting_price_eur", "title"]


class DroneFleetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DroneFleetItem.objects.all()
    serializer_class = DroneFleetItemSerializer
    filter_backends: list = []


class PilotMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PilotMember.objects.all()
    serializer_class = PilotMemberSerializer
    filter_backends: list = []


class FlightQuoteRequestViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Public, write-only endpoint for incoming flight quote requests."""

    queryset = FlightQuoteRequest.objects.none()
    serializer_class = FlightQuoteRequestSerializer
    throttle_scope = "quotes"
    filter_backends: list = []
