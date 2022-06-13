from django.db import models

# Create your models here.
class BodyPart(models.Model):
    name = models.CharField(max_length=100, blank=True, null=False)


class Session(models.Model):
    name = models.CharField(max_length=100, blank=True, null=False)
    bodyPart = models.ForeignKey(
        BodyPart, on_delete=models.CASCADE, related_name="session_body_part"
    )
    count = models.IntegerField(blank=True, null=False)
    set = models.IntegerField(blank=True, null=False)

    def serialize(self):
        return {
            "pk": self.pk,
            "bodyPart": self.bodyPart.name,
            "name": self.name,
            "count": self.count,
            "set": self.set,
        }


class RecommendSession(models.Model):
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, related_name="recommend_session_session"
    )
    category = models.CharField(max_length=100, blank=True, null=False)
