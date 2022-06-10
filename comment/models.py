from django.db import models
from user.models import User
from feed.models import Feed

# Create your models here.
class Comment(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comment_author"
    )
    feed = models.ForeignKey(
        Feed, on_delete=models.CASCADE, related_name="comment_feed"
    )
    content = models.TextField(max_length=500, blank=True, null=False)
    createdTime = models.DateTimeField(auto_now=False, auto_now_add=True)
    updatedTime = models.DateTimeField(auto_now=True, auto_now_add=False)
    like = models.ManyToManyField(User, blank=True, related_name="comment_like")

    def approve(self):
        self.save()
