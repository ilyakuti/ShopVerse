from django.urls import path
from .views import homepage, detail_page, sign_up, login_page, logout_user, sign_up

urlpatterns = [
    path('', homepage, name='homepage_url'),
    path('product/<int:product_id>/', detail_page, name='detail_page_url'),
    path('signup/', sign_up, name='signup_url'),
    path('login/', login_page, name='login_url'),
    path('logout/', logout_user, name='logout_url'),
    path('signup/', sign_up, name='signup_url'),
]