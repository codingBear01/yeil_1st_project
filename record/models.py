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
    eachTimes = models.TextField(max_length=1000, blank=True, null=False)

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.nickname,
            "date": self.date,
            "totalTime": self.totalTime,
            "sessions": self.sessions,
            "bodyParts": self.bodyParts,
            "counts": self.counts,
            "sets": self.sets,
            "eachTimes": self.eachTimes,
        }
