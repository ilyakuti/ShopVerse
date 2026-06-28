from django.contrib import admin
from .models import Product, ProductCategory

# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    search_fields = ["name"]
    list_display = ["name", "price", "discount"]
    list_editable = ["price", "discount"]
    list_display_links = ["name"]

admin.site.register(Product, ProductAdmin)
admin.site.register (ProductCategory)