from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Ticket
from .permissions import IsOwnerOrAdmin
from .serializers import (
    LoginSerializer,
    TicketSerializer,
    TicketStatusSerializer,
    UserSerializer,
)


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer


class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Ticket.objects.all() if user.is_staff else Ticket.objects.filter(createdBy=user)

        category = self.request.query_params.get("category")
        status = self.request.query_params.get("status")
        search = self.request.query_params.get("search")

        if category:
            queryset = queryset.filter(category=category)
        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(createdBy__username__icontains=search)
            )

        return queryset.order_by("-createdAt")

    def perform_create(self, serializer):
        serializer.save(createdBy=self.request.user)


class TicketDetailView(generics.RetrieveAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = Ticket.objects.all()

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj


class TicketStatusUpdateView(generics.UpdateAPIView):
    serializer_class = TicketStatusSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Ticket.objects.all()
    http_method_names = ["patch"]
