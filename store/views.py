import django
from django.shortcuts import render, redirect
from .models import Product, ProductCategory, PersonalInformation
from django.contrib.auth import authenticate, login, logout
from django.contrib.messages import error
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

        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            return redirect("homepage_url")
    return render(request, "login.html")

def sign_up(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        full_name = request.POST.get("full_name")
    try:
        PersonalInformation.objects.create(email=email)
        error(request, "username already taken")
        return render (request, "login.html")
    except PersonalInformation.DoesNotExist:
        PersonalInformation.objects.create(email=email, password=password, full_name=full_name)
        user = PersonalInformation.objects.create(email=email,
                                                  password=password,
                                                  full_name=full_name)
        user.set_password(password)
        user.save()
        pass

    return redirect("login_url")

@login_required
def logout_command(request):
    logout(request)
    return redirect('home_url')