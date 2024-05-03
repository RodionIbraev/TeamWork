from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.views.auxiliary import auth_required, get_user
from teamwork.serializers import TaskSerializer
from teamwork.models import Task


class TaskView(APIView):
    serializer_class = TaskSerializer

    @auth_required
    def post(self, request, project_id):
        """
        Создание задачи
        """
        user = get_user(request)
        req_data = request.data.copy()
        req_data["creator"] = user.id
        req_data["project"] = project_id
        serializer = self.serializer_class(data=req_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @auth_required
    def get(self, request, project_id=None):
        """
        Просмотр задач пользователя
        """
        user = get_user(request)
        tasks = Task.get_user_tasks(user)
        serializer = self.serializer_class(tasks, many=True)
        return Response(serializer.data)

    @auth_required
    def delete(self, request, task_id=None):
        """
        Удаление задачи
        """
        response = Response()
        if task_id:
            task = Task.objects.get(id=task_id)
            task.delete()
            response.data = {
                "success_message": "Задача успешно удалёна!",
            }
            return response
