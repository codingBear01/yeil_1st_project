# Generated by Django 4.0.3 on 2022-06-18 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('record', '0003_rename_durations_record_eachtimes'),
        ('feed', '0003_remove_feed_imageurl'),
    ]

    operations = [
        migrations.AddField(
            model_name='feed',
            name='record',
            field=models.ManyToManyField(blank=True, related_name='feed_record', to='record.record'),
        ),
    ]
