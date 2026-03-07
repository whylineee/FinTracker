from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .api_views import BudgetListCreateApi, CardActivityListApi, DashboardOverviewApi, TransactionListCreateApi

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("dashboard/overview/", DashboardOverviewApi.as_view(), name="dashboard_overview"),
    path("budgets/", BudgetListCreateApi.as_view(), name="budget_list_create"),
    path("transactions/", TransactionListCreateApi.as_view(), name="transaction_list_create"),
    path("card-activities/", CardActivityListApi.as_view(), name="card_activity_list"),
]
