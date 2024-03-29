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
        request.data["creator"] = user.id
        request.data["project"] = project_id
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @auth_required
    def get(self, request):
        """
        Просмотр задач пользователя
        """
        user = get_user(request)
        tasks = Task.get_user_tasks(user)
        serializer = self.serializer_class(tasks, many=True)
        return Response(serializer.data)
