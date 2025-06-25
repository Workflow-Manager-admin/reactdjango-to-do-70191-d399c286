from django.db import models


# PUBLIC_INTERFACE
class Task(models.Model):
    """
    Django model representing a To-Do Task.

    Fields:
        id (AutoField): Primary key for the task (automatically generated).
        title (CharField): The title or description of the task.
        created (DateTimeField): Timestamp when the task was created.
        completed (BooleanField): Status of the task; True if completed, False otherwise.
    """

    title = models.CharField(
        max_length=255,
        help_text="Title or description of the task."
    )
    created = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the task was created."
    )
    completed = models.BooleanField(
        default=False,
        help_text="Completion status of the task."
    )

    def __str__(self):
        """
        String representation of a Task instance.
        """
        return self.title
