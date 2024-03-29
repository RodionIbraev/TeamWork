from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.serializers import ProjectSerializer
from teamwork.views.auxiliary import get_user, auth_required

from teamwork.models import Project, Task


class ProjectView(APIView):  # автовыбор создателя на фронте
    serializer_class = ProjectSerializer

    @auth_required
    def post(self, request):
        """
        Создание проекта
        """
        user = get_user(request)
        request.data["creator"] = user.id
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @auth_required
    def get(self, request, project_id=None):
        """
        Просмотр проекта
        """
        user = get_user(request)
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                return Response(status=404, data={"message": f"Проект с id {project_id} не найден!"})
            project_serializer = self.serializer_class(project)
            return Response(project_serializer.data)
        else:
            projects = Project.objects.filter(employee=user)
            project_serializer = self.serializer_class(projects, many=True)
            return Response(project_serializer.data)
