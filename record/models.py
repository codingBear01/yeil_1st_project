from django.db import models

from user.models import User

# Create your models here.
class Record(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="record_user")
    date = models.CharField(max_length=100, blank=True, null=False)
    totalTime = models.TextField(max_length=1000, blank=True, null=False)
    sessions = models.TextField(max_length=1000, blank=True, null=False)
    bodyParts = models.TextField(max_length=1000, blank=True, null=False)
    counts = models.TextField(max_length=1000, blank=True, null=False)
    sets = models.TextField(max_length=1000, blank=True, null=False)
    durations = models.TextField(max_length=1000, blank=True, null=False)
