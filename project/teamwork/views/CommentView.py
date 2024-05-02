from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.views.auxiliary import auth_required, get_user
from teamwork.serializers import CommentSerializer
from teamwork.models import Comment


class CommentView(APIView):
    serializer_class = CommentSerializer

    @auth_required
    def post(self, request, task_id):
        """
        Создание задачи
        """
        user = get_user(request)
        req_data = request.data.copy()
        req_data["author"] = user.id
        req_data["task"] = task_id
        serializer = self.serializer_class(data=req_data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @auth_required
    def get(self, request, task_id):
        """
        Просмотр комментариев задачи
        """
        comments = Comment.objects.filter(task_id=task_id)
        serializer = self.serializer_class(comments, many=True)
        return Response(serializer.data)

    @auth_required
    def delete(self, request, comm_id=None):
        """
        Удаление задачи
        """
        response = Response()
        if comm_id:
            comm = Comment.objects.get(id=comm_id)
            comm.delete()
            response.data = {
                "success_message": "Комментарий успешно удалён!",
            }
            return response
