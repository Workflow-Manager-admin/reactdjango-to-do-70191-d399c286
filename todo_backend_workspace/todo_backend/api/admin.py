from django.contrib import admin
from .models import Task


# PUBLIC_INTERFACE
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Task model.
    Enables inspection, adding, editing, and searching of tasks in the Django admin interface.
    """
    list_display = ["id", "title", "created", "completed"]
    list_filter = ["completed"]
    search_fields = ["title"]
    ordering = ["-created"]
