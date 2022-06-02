from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Users(models.Model):
    name = models.CharField(max_length=50, blank=True, null=False)
    password = models.CharField(max_length=50, blank=True, null=False)
    email = models.EmailField(max_length=254, blank=True, null=False)
    gender = models.CharField(max_length=15)
    phoneNum = PhoneNumberField()
    height = models.IntegerField(blank=True, null=False)
    weight = models.IntegerField(blank=True, null=False)

    def __str__(self):
        return self.name
