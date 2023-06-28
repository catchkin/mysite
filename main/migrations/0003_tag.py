# Generated by Django 3.2.13 on 2023-06-26 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_article'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag_name', models.CharField(max_length=15)),
                ('tag_slug', models.SlugField()),
            ],
        ),
    ]
