from django.db import models

# Create your models here.

class Product(models.Model):
    image = models.ImageField (upload_to="produc_image", null=True, verbose_name="Product Image")
    name = models.CharField (max_length=127, null=True, verbose_name="Product Name")
    price = models.DecimalField (max_digits=10, decimal_places=2, null=True, verbose_name="Product Price")
    discount = models.DecimalField (max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Discount")
    product_category = models.ManyToManyField("ProductCategory")
    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    name = models.CharField(max_length=64, null=True)
    def __str__(self):
        return self.name