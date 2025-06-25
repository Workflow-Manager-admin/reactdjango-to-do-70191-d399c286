from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer


@api_view(['GET'])
def health(request):
    return Response({"message": "Server is up!"})


# PUBLIC_INTERFACE
@api_view(['GET', 'POST'])
def tasks_list_create(request):
    """
    GET: List all tasks.
    POST: Create a new task.
    """
    if request.method == 'GET':
        tasks = Task.objects.all().order_by('-created')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# PUBLIC_INTERFACE
@api_view(['DELETE'])
def task_delete(request, pk):
    """
    DELETE: Delete a task by its ID.
    """
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'detail': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
