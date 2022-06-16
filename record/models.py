from django.db import models

from user.models import User

# Create your models here.
class Record(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="record_user")
    date = models.CharField(max_length=100, blank=True, null=False)
    sessions = models.TextField(max_length=1000, blank=True, null=False)
    duration = models.TextField(max_length=1000, blank=True, null=False)
    createdTime = models.DateTimeField(
        null=True, blank=True, auto_now=False, auto_now_add=True
    )
    updatedTime = models.DateTimeField(
        null=True, blank=True, auto_now=True, auto_now_add=False
    )
