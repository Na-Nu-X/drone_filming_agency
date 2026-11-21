from django.contrib import admin
from django.utils.html import format_html

from .models import (
    AerialCategory,
    AerialProject,
    AerialService,
    DroneFleetItem,
    FlightQuoteRequest,
    PilotMember,
)


def thumbnail_preview(url: str, width: int = 120):
    if not url:
        return "—"
    return format_html(
        '<img src="{}" alt="" style="width:{}px;aspect-ratio:16/9;object-fit:cover;border-radius:4px" />',
        url,
        width,
    )


@admin.register(AerialCategory)
class AerialCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon_name", "display_order")
    list_editable = ("display_order",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(AerialProject)
class AerialProjectAdmin(admin.ModelAdmin):
    list_display = (
        "preview",
        "title",
        "client_name",
        "category",
        "location_name",
        "is_featured",
        "display_order",
    )
    list_display_links = ("preview", "title")
    list_editable = ("is_featured", "display_order")
    list_filter = ("category", "is_featured")
    search_fields = ("title", "client_name", "location_name", "drone_platform")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("large_preview", "created_at")
    fieldsets = (
        ("Základné údaje", {"fields": ("title", "slug", "category", "client_name", "client_sector")}),
        (
            "Technické parametre letu",
            {"fields": ("location_name", "drone_platform", "video_resolution", "airspace_clearance")},
        ),
        ("Médiá", {"fields": ("video_embed_url", "thumbnail_url", "large_preview")}),
        ("Obsah", {"fields": ("shoot_summary", "deliverables_tags")}),
        ("Zobrazenie", {"fields": ("is_featured", "display_order", "created_at")}),
    )

    @admin.display(description="Náhľad")
    def preview(self, obj):
        return thumbnail_preview(obj.thumbnail_url, 96)

    @admin.display(description="Náhľad obrázka")
    def large_preview(self, obj):
        return thumbnail_preview(obj.thumbnail_url, 360)


@admin.register(AerialService)
class AerialServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "starting_price_eur", "typical_turnaround", "is_featured", "display_order")
    list_editable = ("is_featured", "display_order")
    list_filter = ("category", "is_featured")
    search_fields = ("title", "short_description")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(DroneFleetItem)
class DroneFleetItemAdmin(admin.ModelAdmin):
    list_display = ("preview", "model_name", "category_label", "max_resolution_fps", "flight_time_min", "display_order")
    list_display_links = ("preview", "model_name")
    list_editable = ("display_order",)
    search_fields = ("model_name", "camera_sensor")

    @admin.display(description="Náhľad")
    def preview(self, obj):
        return thumbnail_preview(obj.image_url, 96)


@admin.register(PilotMember)
class PilotMemberAdmin(admin.ModelAdmin):
    list_display = ("full_name", "role_title", "certifications", "display_order")
    list_editable = ("display_order",)
    search_fields = ("full_name", "role_title", "certifications")


@admin.register(FlightQuoteRequest)
class FlightQuoteRequestAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "contact_name",
        "company_name",
        "shoot_location",
        "drone_style",
        "location_environment",
        "duration_tier",
        "is_processed",
    )
    list_display_links = ("created_at", "contact_name")
    list_editable = ("is_processed",)
    list_filter = ("is_processed", "drone_style", "location_environment", "duration_tier", "created_at")
    search_fields = ("contact_name", "company_name", "email", "phone", "shoot_location", "project_details")
    date_hierarchy = "created_at"
    readonly_fields = ("created_at",)
    actions = ("mark_processed", "mark_unprocessed")
    fieldsets = (
        (
            "Konfigurácia letu",
            {
                "fields": (
                    "drone_style",
                    "shoot_location",
                    "location_environment",
                    "duration_tier",
                    "post_production_needed",
                    "preferred_date",
                )
            },
        ),
        ("Kontakt", {"fields": ("contact_name", "company_name", "email", "phone")}),
        ("Detail projektu", {"fields": ("project_details",)}),
        ("Spracovanie", {"fields": ("is_processed", "created_at")}),
    )

    @admin.action(description="Označiť ako vybavené")
    def mark_processed(self, request, queryset):
        updated = queryset.update(is_processed=True)
        self.message_user(request, f"Označené ako vybavené: {updated}")

    @admin.action(description="Označiť ako nevybavené")
    def mark_unprocessed(self, request, queryset):
        updated = queryset.update(is_processed=False)
        self.message_user(request, f"Označené ako nevybavené: {updated}")
