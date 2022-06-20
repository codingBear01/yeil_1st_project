from hashlib import blake2b
from django.db import models

from user.models import User

# Create your models here.
class Group(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="group_user", null=True, blank=True
    )
    target = models.CharField(max_length=100, blank=True, null=False)
    title = models.CharField(max_length=100, blank=True, null=False)
    content = models.TextField(max_length=1000, blank=True, null=False)
    memberCount = models.IntegerField(default=0)
    startDay = models.DateField(default=0)
    finishDay = models.DateField(default=0)
    createdTime = models.DateTimeField(
        null=True, blank=True, auto_now=False, auto_now_add=True
    )
    updatedTime = models.DateTimeField(
        null=True, blank=True, auto_now=True, auto_now_add=False
    )
    joinedUser = models.ManyToManyField(
        User, blank=True, symmetrical=False, related_name="group_joined_user"
    )
    like = models.ManyToManyField(
        User, blank=True, symmetrical=False, related_name="group_like"
    )
    groupPic = models.ImageField(upload_to="images/", blank=True, null=True)

    def serialize(self):
        return {
            "pk": self.pk,
            "target": self.target,
            "title": self.title,
            "memberCount": self.memberCount,
            "createdTime": self.createdTime.strftime("%Y/%m/%d, %H:%M:%S"),
            "updatedTime": self.updatedTime.strftime("%Y/%m/%d, %H:%M:%S"),
            "startDay": self.startDay,
            "finishDay": self.finishDay,
            "joinedUser": self.joinedUser.count(),
            "like": self.like.count(),
            "groupPic": self.groupPic.url,
        }
