from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("main.urls")),
    path("user/", include("user.urls")),
    path("feed/", include("feed.urls")),
    path("userPage/", include("userPage.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
