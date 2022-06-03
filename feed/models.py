from django.db import models
from user.models import User

# Create your models here.
class Feed(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="feed_author"
    )
    title = models.CharField(max_length=100, blank=True, null=False)
    content = models.TextField(max_length=1000, blank=True, null=False)
    imageUrl = models.TextField(blank=True)
    createdTime = models.DateTimeField(
        null=True, blank=True, auto_now=False, auto_now_add=True
    )
    updatedTime = models.DateTimeField(
        null=True, blank=True, auto_now=True, auto_now_add=False
    )
    like = models.ManyToManyField(User, blank=True, related_name="feed_like")


# Comment 기능은 추후 app 따로 파서 관리
# class Comment(models.Model):
#     author = models.ForeignKey(
#         User, on_delete=models.CASCADE, related_name="comment_author"
#     )
#     feed = models.ForeignKey(
#         Feed, on_delete=models.CASCADE, related_name="comment_feed"
#     )
#     content = models.TextField(max_length=500, blank=True, null=False)
#     createdTime = models.DateTimeField(auto_now=False, auto_now_add=True)
#     updatedTime = models.DateTimeField(auto_now=True, auto_now_add=False)
#     like = models.ManyToManyField(User, blank=True, related_name="comment_like")
