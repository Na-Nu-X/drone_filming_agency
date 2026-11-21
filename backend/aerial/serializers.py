import re

from rest_framework import serializers

from .models import (
    AerialCategory,
    AerialProject,
    AerialService,
    DroneFleetItem,
    FlightQuoteRequest,
    PilotMember,
)


class AerialCategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True)
    service_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = AerialCategory
        fields = [
            "id",
            "name",
            "slug",
            "short_summary",
            "icon_name",
            "display_order",
            "project_count",
            "service_count",
        ]


class CategoryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = AerialCategory
        fields = ["id", "name", "slug", "icon_name"]


class AerialProjectListSerializer(serializers.ModelSerializer):
    category = CategoryMiniSerializer(read_only=True)

    class Meta:
        model = AerialProject
        fields = [
            "id",
            "title",
            "slug",
            "client_name",
            "client_sector",
            "category",
            "location_name",
            "drone_platform",
            "video_resolution",
            "video_embed_url",
            "thumbnail_url",
            "deliverables_tags",
            "is_featured",
        ]


class AerialProjectDetailSerializer(AerialProjectListSerializer):
    class Meta(AerialProjectListSerializer.Meta):
        fields = AerialProjectListSerializer.Meta.fields + [
            "airspace_clearance",
            "shoot_summary",
            "created_at",
        ]


class AerialServiceSerializer(serializers.ModelSerializer):
    category = CategoryMiniSerializer(read_only=True)

    class Meta:
        model = AerialService
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "short_description",
            "detailed_description",
            "included_deliverables",
            "drone_fleet_used",
            "typical_turnaround",
            "starting_price_eur",
            "is_featured",
        ]


class DroneFleetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DroneFleetItem
        fields = [
            "id",
            "model_name",
            "category_label",
            "camera_sensor",
            "max_resolution_fps",
            "flight_time_min",
            "key_use_cases",
            "image_url",
        ]


class PilotMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PilotMember
        fields = ["id", "full_name", "role_title", "certifications", "bio", "photo_url"]


PHONE_RE = re.compile(r"^\+?[0-9 ()/-]{9,20}$")


class FlightQuoteRequestSerializer(serializers.ModelSerializer):
    # Honeypot field against simple spam bots – must stay empty.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = FlightQuoteRequest
        fields = [
            "id",
            "drone_style",
            "shoot_location",
            "location_environment",
            "duration_tier",
            "post_production_needed",
            "preferred_date",
            "company_name",
            "contact_name",
            "email",
            "phone",
            "project_details",
            "website",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "drone_style": {"error_messages": {"invalid_choice": "Vyberte platný štýl záberov."}},
            "location_environment": {
                "error_messages": {"invalid_choice": "Vyberte platné prostredie letu."}
            },
            "duration_tier": {
                "error_messages": {"invalid_choice": "Vyberte platný rozsah natáčania."}
            },
            "email": {"error_messages": {"invalid": "Zadajte platnú e-mailovú adresu."}},
        }

    def validate_website(self, value: str) -> str:
        if value:
            raise serializers.ValidationError("Neplatná požiadavka.")
        return value

    def validate_shoot_location(self, value: str) -> str:
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Uveďte presnejšiu lokalitu natáčania (adresa, obec alebo GPS)."
            )
        return value

    def validate_contact_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Zadajte meno kontaktnej osoby.")
        return value

    def validate_phone(self, value: str) -> str:
        value = value.strip()
        if not PHONE_RE.match(value):
            raise serializers.ValidationError(
                "Zadajte platné telefónne číslo, napr. +421 900 123 456."
            )
        return value

    def validate_project_details(self, value: str) -> str:
        value = value.strip()
        if len(value) < 20:
            raise serializers.ValidationError(
                "Popíšte projekt aspoň v pár vetách (minimálne 20 znakov)."
            )
        return value

    def create(self, validated_data):
        validated_data.pop("website", None)
        return super().create(validated_data)
