from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from cloudinary.exceptions import Error as CloudinaryError

from .models import Ticket


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "is_staff": self.user.is_staff,
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "is_staff"]


class TicketSerializer(serializers.ModelSerializer):
    createdBy = serializers.CharField(source="createdBy.username", read_only=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "category",
            "status",
            "attachment",
            "attachment_url",
            "createdBy",
            "createdAt",
        ]
        read_only_fields = ["id", "status", "createdBy", "createdAt"]

    def get_attachment_url(self, obj):
        if obj.attachment:
            try:
                return obj.attachment.url
            except Exception:
                return None
        return None

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["createdBy"] = user
        try:
            return super().create(validated_data)
        except CloudinaryError:
            raise serializers.ValidationError(
                {"attachment": "Attachment upload failed. Check Cloudinary credentials and try again."}
            )


class TicketStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["status"]
