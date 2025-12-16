from django.conf import settings
from django.db import models
from cloudinary.models import CloudinaryField


class Ticket(models.Model):
    class Category(models.TextChoices):
        TECHNICAL = "Technical", "Technical"
        FINANCIAL = "Financial", "Financial"
        PRODUCT = "Product", "Product"

    class Status(models.TextChoices):
        NEW = "New", "New"
        UNDER_REVIEW = "Under Review", "Under Review"
        RESOLVED = "Resolved", "Resolved"

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW
    )
    attachment = CloudinaryField(
        "attachment", blank=True, null=True, folder="ticket_attachments"
    )
    createdBy = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tickets",
    )
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.category})"
