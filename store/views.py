from django.shortcuts import render
from .models import Product

# Create your views here.

def homepage (request):
    product = Product.objects.all()
    q = request.GET.get ('q')

    if q:
        product = product.filter(name__icontains=q)
    else:
        product = Product.objects.all()

    context = {
        "product":product
    }

    return render (request, "index.html", context)