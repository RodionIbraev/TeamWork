from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.views.auxiliary import auth_required, get_user
from teamwork.serializers import TaskSerializer


class TaskCreateView(APIView):
    """
    Создание задачи
    """
    @auth_required
    def post(self, request, project_id):
        user = get_user(request)
        request.data["creator"] = user.id
        request.data["project"] = project_id
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
