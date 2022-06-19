from django.db import models
from django.contrib.postgres.fields import ArrayField

from user.models import User
from record.models import Record

# Create your models here.
class Feed(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="feed_author"
    )
    title = models.CharField(max_length=100, blank=True, null=False)
    content = models.TextField(max_length=1000, blank=True, null=False)
    recordIds = models.CharField(max_length=100, blank=True, null=True)
    createdTime = models.DateTimeField(
        null=True, blank=True, auto_now=False, auto_now_add=True
    )
    updatedTime = models.DateTimeField(
        null=True, blank=True, auto_now=True, auto_now_add=False
    )
    like = models.ManyToManyField(User, blank=True, related_name="feed_like")

    def serialize(self):
        return {
            "pk": self.pk,
            "author": self.author.nickname,
            "title": self.title,
            "recordIds": self.recordIds.split(","),
            "content": self.content,
            "createdTime": self.createdTime.strftime("%Y/%m/%d, %H:%M:%S"),
        }

    def __str__(self):
        return f"title: {self.title} by {self.author}"
