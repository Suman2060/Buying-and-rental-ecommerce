# Generated by Django 5.1.5 on 2025-02-21 16:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecomapp', '0018_alter_cartitem_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cartitem',
            name='product',
            field=models.ForeignKey(blank=True, default='null', null=True, on_delete=django.db.models.deletion.CASCADE, to='ecomapp.products'),
        ),
    ]
