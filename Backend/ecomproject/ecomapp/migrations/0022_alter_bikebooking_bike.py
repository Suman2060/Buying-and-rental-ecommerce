# Generated by Django 5.1.5 on 2025-02-21 18:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecomapp', '0021_alter_bikebooking_bike_alter_cartitem_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bikebooking',
            name='bike',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ecomapp.rentbike'),
        ),
    ]
