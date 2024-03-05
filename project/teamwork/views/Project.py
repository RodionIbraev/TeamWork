from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.serializers import ProjectSerializer
from teamwork.views.auxiliary import get_user, auth_required


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
