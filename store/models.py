from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Product(models.Model):
    image = models.ImageField (upload_to="produc_image", null=True, verbose_name="Product Image")
    name = models.CharField (max_length=127, null=True, verbose_name="Product Name")
    price = models.DecimalField (max_digits=10, decimal_places=2, null=True, verbose_name="Product Price")
    discount = models.DecimalField (max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Discount")
    product_category = models.ManyToManyField("ProductCategory")
    description = models.TextField (null=True, verbose_name="Product Description")
    brand = models.CharField (max_length=127, null=True, verbose_name="Product Brand")
    battery = models.CharField (max_length=127, null=True, verbose_name="Product Battery", blank=True)
    weight = models.CharField (max_length=127, null=True, verbose_name="Product Weight", blank=True)
    product_model = models.CharField (max_length=127, null=True, verbose_name="Product Model", blank=True)
    connectivity = models.CharField (max_length=127, null=True, verbose_name="Product Connectivity", blank=True)
    warranty = models.CharField (max_length=127, null=True, verbose_name="Product Warranty", blank=True)
    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    name = models.CharField(max_length=64, null=True)
    def __str__(self):
        return self.name
    
class PersonalInformation(AbstractUser):
    full_name = models.CharField(max_length=127, null=True)
    email = models.EmailField(max_length=127, null=True)
    password = models.CharField(max_length=127, null=True)
    def __str__(self):
        return self.full_name