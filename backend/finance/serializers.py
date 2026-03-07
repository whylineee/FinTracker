from rest_framework import serializers
from .models import Budget, CardActivity, Transaction, Wallet


class WalletSerializer(serializers.ModelSerializer):
    ownerName = serializers.CharField(source="owner_name")

    class Meta:
        model = Wallet
        fields = ["id", "ownerName", "balance"]


class BudgetSerializer(serializers.ModelSerializer):
    currentAmount = serializers.DecimalField(max_digits=12, decimal_places=2, source="current_amount")
    targetAmount = serializers.DecimalField(max_digits=12, decimal_places=2, source="target_amount")
    progressPercent = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ["id", "name", "currentAmount", "targetAmount", "progressPercent"]

    def get_progressPercent(self, obj):
        return obj.progress_percent


class CardActivitySerializer(serializers.ModelSerializer):
    txDate = serializers.DateField(source="tx_date")

    class Meta:
        model = CardActivity
        fields = ["id", "label", "value", "txDate"]


class TransactionSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="tx_type")
    txDate = serializers.DateField(source="tx_date")

    class Meta:
        model = Transaction
        fields = ["id", "name", "type", "txDate", "status", "amount"]
