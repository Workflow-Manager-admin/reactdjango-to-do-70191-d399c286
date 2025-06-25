from django.urls import path
from .views import health, tasks_list_create, task_delete

urlpatterns = [
    path('health/', health, name='Health'),
    path('tasks/', tasks_list_create, name='tasks-list-create'),  # GET and POST
    path('tasks/<int:pk>/', task_delete, name='task-delete'),      # DELETE
]
