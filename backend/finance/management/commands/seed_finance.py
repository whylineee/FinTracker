from datetime import date
from decimal import Decimal
from django.core.management.base import BaseCommand
from finance.models import Budget, CardActivity, Transaction, Wallet


class Command(BaseCommand):
    help = "Seeds finance models with initial demo data."

    def handle(self, *args, **options):
        Transaction.objects.all().delete()
        CardActivity.objects.all().delete()
        Budget.objects.all().delete()
        Wallet.objects.all().delete()

        wallet = Wallet.objects.create(owner_name="Adrian", balance=Decimal("124543.00"))

        Budget.objects.bulk_create(
            [
                Budget(wallet=wallet, name="Emergency Fund", current_amount=500, target_amount=1000),
                Budget(wallet=wallet, name="Travel Plan", current_amount=1250, target_amount=2500),
                Budget(wallet=wallet, name="Education", current_amount=2500, target_amount=3000),
                Budget(wallet=wallet, name="Food & Groceries", current_amount=300, target_amount=1200),
                Budget(wallet=wallet, name="Repair Services", current_amount=900, target_amount=900),
                Budget(wallet=wallet, name="Donations", current_amount=180, target_amount=600),
            ]
        )

        CardActivity.objects.bulk_create(
            [
                CardActivity(label="Loan to help", value=200, tx_date=date(2026, 3, 1)),
                CardActivity(label="Hotel reservation", value=400, tx_date=date(2026, 3, 2)),
                CardActivity(label="Flights", value=290, tx_date=date(2026, 3, 3)),
                CardActivity(label="Subscriptions", value=79, tx_date=date(2026, 3, 4)),
                CardActivity(label="Insurance", value=110, tx_date=date(2026, 3, 5)),
            ]
        )

        Transaction.objects.bulk_create(
            [
                Transaction(wallet=wallet, name="Peter Mads", tx_type="Salary", tx_date=date(2026, 3, 1), status=Transaction.Status.CREDIT, amount=2200),
                Transaction(wallet=wallet, name="Adam Hunter", tx_type="Online", tx_date=date(2026, 3, 2), status=Transaction.Status.DEBIT, amount=215),
                Transaction(wallet=wallet, name="Lina Scott", tx_type="Transfer", tx_date=date(2026, 3, 3), status=Transaction.Status.CREDIT, amount=640),
                Transaction(wallet=wallet, name="Nina Ford", tx_type="Card", tx_date=date(2026, 3, 5), status=Transaction.Status.DEBIT, amount=58),
                Transaction(wallet=wallet, name="Billy Jay", tx_type="Utility", tx_date=date(2026, 3, 6), status=Transaction.Status.DEBIT, amount=120),
                Transaction(wallet=wallet, name="Sofia Max", tx_type="Refund", tx_date=date(2026, 3, 6), status=Transaction.Status.CREDIT, amount=43),
                Transaction(wallet=wallet, name="Rian Cole", tx_type="Subscription", tx_date=date(2026, 3, 7), status=Transaction.Status.DEBIT, amount=20),
            ]
        )

        self.stdout.write(self.style.SUCCESS("Finance data seeded successfully."))
