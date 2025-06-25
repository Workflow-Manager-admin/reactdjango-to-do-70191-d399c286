from rest_framework import serializers
from .models import Task


# PUBLIC_INTERFACE
class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for the Task model.
    Handles validation and conversion for REST API input/output.
    """
    class Meta:
        model = Task
        fields = ['id', 'title', 'created', 'completed']
        read_only_fields = ['id', 'created']
