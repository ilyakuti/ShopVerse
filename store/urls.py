from django.urls import path
from .views import homepage, detail_page, sign_up, login_page

urlpatterns = [
    path ('', homepage, name="homepage_url"),
    path ('product/<int:product_id>/', detail_page, name="detail_page_url"),
    path ('signup/', sign_up, name="signup_url"),
    path ('login/', login_page, name="login_url"),
]