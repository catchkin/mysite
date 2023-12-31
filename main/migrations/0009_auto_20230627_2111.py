# Generated by Django 3.2.13 on 2023-06-27 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_vote'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='comfort_average',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3),
        ),
        migrations.AddField(
            model_name='product',
            name='durability_average',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3),
        ),
        migrations.AddField(
            model_name='product',
            name='performance_average',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3),
        ),
    ]
