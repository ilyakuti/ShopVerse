from django.urls import path
from .views import homepage, detail_page

urlpatterns = [
    path ('', homepage, name="homepage_url"),
    path ('product/<int:product_id>/', detail_page, name="detail_page_url"),
]