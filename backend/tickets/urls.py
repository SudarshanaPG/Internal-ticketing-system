from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CurrentUserView,
    LoginView,
    TicketDetailView,
    TicketListCreateView,
    TicketStatusUpdateView,
)

urlpatterns = [
    path("auth/login", LoginView.as_view(), name="token_obtain_pair"),
    path("auth/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me", CurrentUserView.as_view(), name="auth_me"),
    path("tickets", TicketListCreateView.as_view(), name="ticket_list_create"),
    path("tickets/<int:pk>", TicketDetailView.as_view(), name="ticket_detail"),
    path("tickets/<int:pk>/status", TicketStatusUpdateView.as_view(), name="ticket_status"),
]
