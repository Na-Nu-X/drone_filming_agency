from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Správa leteckej produkcie"
admin.site.site_title = "Administrácia – letecké natáčanie"
admin.site.index_title = "Projekty, flotila a dopyty"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("aerial.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
