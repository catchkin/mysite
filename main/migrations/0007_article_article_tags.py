# Generated by Django 3.2.13 on 2023-06-27 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_remove_article_article_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='article_tags',
            field=models.ManyToManyField(to='main.Tag'),
        ),
    ]
