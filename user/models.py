from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ImageField

# Create your models here.
class User(AbstractUser):
    follower = models.ManyToManyField(
        "self",
        blank=True,
        symmetrical=False,
        related_name="user_follower",
    )
    following = models.ManyToManyField(
        "self",
        blank=True,
        symmetrical=False,
        related_name="user_following",
    )
    profilePic = models.ImageField(upload_to="images/", blank=True, null=True)
    nickname = models.CharField(max_length=20, blank=True, null=False)
