from django.db import models

from users.models import CUser

# Create your models here.
class Product(models.Model):
    product_name = models.CharField(max_length=1000)
    product_link = models.URLField()
    last_seen_price = models.CharField(max_length=100, default='0')

class PUTrack(models.Model):
    user = models.ForeignKey(CUser, on_delete = models.CASCADE)
    product = models.ForeignKey(Product, on_delete = models.CASCADE)
    