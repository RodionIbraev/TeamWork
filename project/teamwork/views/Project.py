from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.serializers import ProjectSerializer
from teamwork.views.auxiliary import get_user, auth_required

from teamwork.models import Project, Task


class ProjectCreateView(APIView):
    """
    Создание проекта
    """
    @auth_required
    def post(self, request):
        user = get_user(request)
        request.data["creator"] = user.id
        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class ProjectView(APIView):
    @auth_required
    def get(self, request, project_id=None):
        """
        Просмотр проекта
        """
        user = get_user(request)
        if project_id:
            project = Project.objects.get(id=project_id)
            project_serializer = ProjectSerializer(project)
            if not project:
                return Response(status=404, data={"message": "Проект с id {} не найден.".format(project_id)})
            return Response(project_serializer.data)
        else:
            projects = Project.objects.filter(employee=user).values()
            return Response(projects)
