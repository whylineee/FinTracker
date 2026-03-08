from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
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


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, validators=[validate_password])
    confirmPassword = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirmPassword"]
        extra_kwargs = {
            "email": {"required": False, "allow_blank": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["confirmPassword"]:
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
