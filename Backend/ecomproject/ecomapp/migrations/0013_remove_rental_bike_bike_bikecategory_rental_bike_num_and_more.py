# Generated by Django 5.1.5 on 2025-02-21 09:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecomapp', '0012_bike_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rental',
            name='bike',
        ),
        migrations.AddField(
            model_name='bike',
            name='bikecategory',
            field=models.CharField(blank=True, max_length=220, null=True),
        ),
        migrations.AddField(
            model_name='rental',
            name='bike_num',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ecomapp.bike'),
        ),
        migrations.AlterField(
            model_name='rental',
            name='total_amount',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
