from django.db import models


class Wallet(models.Model):
    owner_name = models.CharField(max_length=120)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.owner_name} wallet"


class Budget(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="budgets")
    name = models.CharField(max_length=120)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name

    @property
    def progress_percent(self):
        if self.target_amount == 0:
            return 0
        return round((self.current_amount / self.target_amount) * 100, 2)


class CardActivity(models.Model):
    label = models.CharField(max_length=150)
    value = models.DecimalField(max_digits=12, decimal_places=2)
    tx_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-tx_date", "-id"]
        verbose_name_plural = "card activities"

    def __str__(self):
        return self.label


class Transaction(models.Model):
    class Status(models.TextChoices):
        CREDIT = "CREDIT", "Credit"
        DEBIT = "DEBIT", "Debit"

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    name = models.CharField(max_length=150)
    tx_type = models.CharField(max_length=80)
    tx_date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DEBIT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-tx_date", "-id"]

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
