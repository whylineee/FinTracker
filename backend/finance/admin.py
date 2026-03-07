from django.contrib import admin
from .models import Budget, CardActivity, Transaction, Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("id", "owner_name", "balance", "updated_at")
    search_fields = ("owner_name",)


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "wallet", "current_amount", "target_amount", "progress_percent")
    list_filter = ("wallet",)
    search_fields = ("name", "wallet__owner_name")


@admin.register(CardActivity)
class CardActivityAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "value", "tx_date")
    list_filter = ("tx_date",)
    search_fields = ("label",)
    date_hierarchy = "tx_date"


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "wallet", "tx_type", "tx_date", "status", "amount")
    list_filter = ("status", "wallet", "tx_date")
    search_fields = ("name", "tx_type", "wallet__owner_name")
    date_hierarchy = "tx_date"
