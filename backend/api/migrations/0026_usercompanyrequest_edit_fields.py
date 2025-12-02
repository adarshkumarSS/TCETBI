# Generated manually for the new edit request fields

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_alter_usercompanyrequest_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='usercompanyrequest',
            name='edit_changes_summary',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='usercompanyrequest',
            name='is_edit_request',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='usercompanyrequest',
            name='original_startup',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='edit_requests', to='api.startup'),
        ),
    ]
