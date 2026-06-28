from django.shortcuts import render
from .models import Product, ProductCategory

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