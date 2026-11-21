import django_filters

from .models import AerialProject, AerialService


class AerialProjectFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = AerialProject
        fields = ["category", "featured"]


class AerialServiceFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = AerialService
        fields = ["category", "featured"]
