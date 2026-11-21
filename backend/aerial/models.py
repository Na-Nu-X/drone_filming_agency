"""Domain models for the aerial cinematography agency."""

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class SluggedModel(models.Model):
    """Abstract base that auto-generates a unique ASCII slug from a source field."""

    slug_source_field = "title"

    slug = models.SlugField(
        "URL identifikátor (slug)",
        max_length=220,
        unique=True,
        blank=True,
        help_text="Vygeneruje sa automaticky z názvu, ak ho nevyplníte.",
    )

    class Meta:
        abstract = True

    def _build_unique_slug(self) -> str:
        base = slugify(getattr(self, self.slug_source_field))[:200] or "polozka"
        candidate = base
        counter = 2
        queryset = type(self).objects.exclude(pk=self.pk)
        while queryset.filter(slug=candidate).exists():
            candidate = f"{base}-{counter}"
            counter += 1
        return candidate

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._build_unique_slug()
        super().save(*args, **kwargs)


class AerialCategory(SluggedModel):
    slug_source_field = "name"

    name = models.CharField("Názov kategórie", max_length=160)
    short_summary = models.CharField("Krátky popis", max_length=300, blank=True)
    icon_name = models.CharField(
        "Názov ikony",
        max_length=60,
        blank=True,
        help_text="Identifikátor ikony vo frontende, napr. „cinema“, „fpv“, „building“.",
    )
    display_order = models.PositiveSmallIntegerField("Poradie zobrazenia", default=0)

    class Meta:
        verbose_name = "Kategória leteckých záberov"
        verbose_name_plural = "Kategórie leteckých záberov"
        ordering = ["display_order", "name"]

    def __str__(self) -> str:
        return self.name


class AerialProject(SluggedModel):
    title = models.CharField("Názov projektu", max_length=200)
    client_name = models.CharField("Klient", max_length=160)
    client_sector = models.CharField("Odvetvie klienta", max_length=120, blank=True)
    category = models.ForeignKey(
        AerialCategory,
        verbose_name="Kategória",
        on_delete=models.PROTECT,
        related_name="projects",
    )
    location_name = models.CharField("Lokalita natáčania", max_length=160)
    drone_platform = models.CharField("Dron a kamera", max_length=200)
    video_resolution = models.CharField("Rozlíšenie videa", max_length=80)
    airspace_clearance = models.CharField("Letová zóna a povolenia", max_length=220, blank=True)
    video_embed_url = models.URLField(
        "URL vloženého videa (embed)",
        blank=True,
        help_text="YouTube alebo Vimeo embed adresa, napr. https://www.youtube.com/embed/…",
    )
    thumbnail_url = models.URLField("URL náhľadového obrázka", max_length=500)
    shoot_summary = models.TextField("Priebeh natáčania a výzva")
    deliverables_tags = models.JSONField(
        "Dodané formáty",
        default=list,
        blank=True,
        help_text='Zoznam reťazcov, napr. ["4K ProRes Master", "9:16 Reels verzie"].',
    )
    is_featured = models.BooleanField("Zvýraznený na úvodnej stránke", default=False)
    display_order = models.PositiveSmallIntegerField("Poradie zobrazenia", default=0)
    created_at = models.DateTimeField("Vytvorené", auto_now_add=True)

    class Meta:
        verbose_name = "Letecký projekt (portfólio)"
        verbose_name_plural = "Letecké projekty (portfólio)"
        ordering = ["display_order", "-created_at"]

    def __str__(self) -> str:
        return self.title


class AerialService(SluggedModel):
    category = models.ForeignKey(
        AerialCategory,
        verbose_name="Kategória",
        on_delete=models.PROTECT,
        related_name="services",
    )
    title = models.CharField("Názov služby", max_length=200)
    short_description = models.CharField("Krátky popis", max_length=320)
    detailed_description = models.TextField("Podrobný popis")
    included_deliverables = models.JSONField("Zahrnuté výstupy", default=list, blank=True)
    drone_fleet_used = models.JSONField("Použité drony", default=list, blank=True)
    typical_turnaround = models.CharField("Bežný čas dodania", max_length=80, blank=True)
    starting_price_eur = models.DecimalField(
        "Cena od (EUR)",
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )
    is_featured = models.BooleanField("Zvýraznená služba", default=False)
    display_order = models.PositiveSmallIntegerField("Poradie zobrazenia", default=0)

    class Meta:
        verbose_name = "Letecká služba"
        verbose_name_plural = "Letecké služby"
        ordering = ["display_order", "title"]

    def __str__(self) -> str:
        return self.title


class DroneFleetItem(models.Model):
    model_name = models.CharField("Model dronu", max_length=120)
    category_label = models.CharField("Typ / kategória", max_length=120)
    camera_sensor = models.CharField("Kamera / snímač", max_length=200)
    max_resolution_fps = models.CharField("Max. rozlíšenie a snímkovanie", max_length=120)
    flight_time_min = models.PositiveSmallIntegerField("Čas letu (min)")
    key_use_cases = models.JSONField("Hlavné využitie", default=list, blank=True)
    image_url = models.URLField("URL obrázka", max_length=500, blank=True)
    display_order = models.PositiveSmallIntegerField("Poradie zobrazenia", default=0)

    class Meta:
        verbose_name = "Dron vo flotile"
        verbose_name_plural = "Naša flotila dronov"
        ordering = ["display_order", "model_name"]

    def __str__(self) -> str:
        return self.model_name


class PilotMember(models.Model):
    full_name = models.CharField("Meno a priezvisko", max_length=120)
    role_title = models.CharField("Pozícia", max_length=160)
    certifications = models.CharField("Certifikácie a oprávnenia", max_length=320)
    bio = models.TextField("Medailón", blank=True)
    photo_url = models.URLField("URL fotografie", max_length=500, blank=True)
    display_order = models.PositiveSmallIntegerField("Poradie zobrazenia", default=0)

    class Meta:
        verbose_name = "Pilot / člen tímu"
        verbose_name_plural = "Piloti a tím"
        ordering = ["display_order", "full_name"]

    def __str__(self) -> str:
        return f"{self.full_name} – {self.role_title}"


class FlightQuoteRequest(models.Model):
    class DroneStyle(models.TextChoices):
        CINEMA = "cinema", "Klasické stabilizované cinema zábery"
        FPV = "fpv", "Dynamický FPV prelet (interiér/exteriér)"
        COMBO = "combo", "Kombinácia Cinema + FPV"
        INSPECTION = "inspection", "Technická inšpekcia / 3D mapovanie"

    class Environment(models.TextChoices):
        NATURE = "priroda", "Voľná príroda / Mimo zástavby"
        CITY = "mesto", "Mestská zástavba / Husto osídlená oblasť"
        INDOOR = "interier", "Interiér budovy / Haly"

    class DurationTier(models.TextChoices):
        SHORT = "short", "Krátky výjazd (do 2 hodín)"
        HALF_DAY = "half_day", "Poldenné natáčanie (do 4 hodín)"
        FULL_DAY = "full_day", "Celý natáčací deň (do 8 hodín)"

    drone_style = models.CharField("Štýl záberov", max_length=20, choices=DroneStyle.choices)
    shoot_location = models.CharField(
        "Miesto natáčania",
        max_length=255,
        help_text="Presná adresa alebo GPS – slúži na overenie letovej zóny.",
    )
    location_environment = models.CharField(
        "Prostredie / letová zóna", max_length=20, choices=Environment.choices
    )
    duration_tier = models.CharField("Rozsah natáčania", max_length=20, choices=DurationTier.choices)
    post_production_needed = models.BooleanField("Požaduje postprodukciu", default=True)
    preferred_date = models.CharField("Preferovaný termín", max_length=120, blank=True)
    company_name = models.CharField("Spoločnosť", max_length=160, blank=True)
    contact_name = models.CharField("Kontaktná osoba", max_length=120)
    email = models.EmailField("E-mail")
    phone = models.CharField("Telefón", max_length=40)
    project_details = models.TextField("Popis projektu")
    is_processed = models.BooleanField("Vybavené", default=False)
    created_at = models.DateTimeField("Prijaté", auto_now_add=True)

    class Meta:
        verbose_name = "Dopyt na natáčanie dronom"
        verbose_name_plural = "Dopyty na natáčanie dronom"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.contact_name} – {self.shoot_location} ({self.created_at:%d.%m.%Y})"
