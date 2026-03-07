from decimal import Decimal
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Budget, CardActivity, Transaction, Wallet
from .serializers import BudgetSerializer, CardActivitySerializer, TransactionSerializer, WalletSerializer


def get_primary_wallet():
    wallet = Wallet.objects.order_by("id").first()
    if wallet is None:
        wallet = Wallet.objects.create(owner_name="Owner", balance=Decimal("0"))
    return wallet


class DashboardOverviewApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = get_primary_wallet()
        budgets = wallet.budgets.order_by("id")
        recent_transactions = wallet.transactions.order_by("-tx_date", "-id")[:4]
        card_activity = CardActivity.objects.order_by("-tx_date", "-id")[:6]

        data = {
            "wallet": WalletSerializer(wallet).data,
            "budgets": BudgetSerializer(budgets, many=True).data,
            "transactionsCount": wallet.transactions.count(),
            "recentTransactions": TransactionSerializer(recent_transactions, many=True).data,
            "cardActivity": CardActivitySerializer(card_activity, many=True).data,
        }
        return Response(data)


class BudgetListCreateApi(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wallet = get_primary_wallet()
        return wallet.budgets.order_by("id")

    def perform_create(self, serializer):
        wallet = get_primary_wallet()
        serializer.save(wallet=wallet)


class TransactionListCreateApi(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        wallet = get_primary_wallet()
        return wallet.transactions.order_by("-tx_date", "-id")

    def perform_create(self, serializer):
        wallet = get_primary_wallet()
        transaction = serializer.save(wallet=wallet)
        if transaction.status == Transaction.Status.CREDIT:
            wallet.balance = Decimal(wallet.balance) + Decimal(transaction.amount)
        else:
            wallet.balance = Decimal(wallet.balance) - Decimal(transaction.amount)
        wallet.save(update_fields=["balance", "updated_at"])


class CardActivityListApi(generics.ListAPIView):
    serializer_class = CardActivitySerializer
    permission_classes = [IsAuthenticated]
    queryset = CardActivity.objects.order_by("-tx_date", "-id")
