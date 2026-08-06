import re

import django
from django.shortcuts import render, redirect
from .models import Product, ProductCategory, PersonalInformation
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.backends import ModelBackend
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# Create your views here.

def homepage(request):
    products = Product.objects.all()
    q = request.GET.get('q')

    if q:
        products = products.filter(name__icontains=q)

    category_name = request.GET.get('category')
    if category_name:
        products = products.filter(product_category__name=category_name)

    categories = ProductCategory.objects.all()
    context = {
        "products": products,
        "categories": categories,
        "selected_category": category_name,
    }

    return render (request, "index.html", context)

def detail_page (request, product_id):
    product = Product.objects.get(id=product_id)
    context = {
        "product": product
    }
    return render(request, "product-detail.html", context)

def login_page(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = None
        if email and password:
            user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect("homepage_url")
        messages.error(request, "Invalid email or password")

    return render(request, "login.html")


def sign_up(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")
        full_name = request.POST.get("full_name")

        if not email or not password:
            messages.error(request, "Email and password are required")
            return render(request, "login.html")

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return render(request, "login.html")

        if PersonalInformation.objects.filter(email=email).exists():
            messages.error(request, "This email is already registered")
            return render(request, "login.html")

        user = PersonalInformation.objects.create_user(
            username=email,
            email=email,
            password=password,
            full_name=full_name,
        )
        messages.success(request, "Account created successfully")
        return redirect("login_url")

    return render(request, "sign_up.html")


@login_required
def logout_user(request):
    logout(request)
    return redirect('homepage_url')