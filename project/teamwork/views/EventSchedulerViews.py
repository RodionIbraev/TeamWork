from rest_framework.response import Response
from rest_framework.views import APIView

from teamwork.models import EventScheduler
from teamwork.serializers import EventSchedulerSerializer
from teamwork.views.auxiliary import auth_required, get_user


class EventSchedulerView(APIView):
    serializer_class = EventSchedulerSerializer

    @auth_required
    def get(self, request):
        """
        Просмотр календаря событий пользователя
        """
        user = get_user(request)
        events = EventScheduler.objects.filter(employee=user)
        serializer = self.serializer_class(events, many=True)
        return Response(serializer.data)

    @auth_required
    def post(self, request):
        """
        Добавление события
        """
        user = get_user(request)
        request.data["employee"] = user
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    @auth_required
    def delete(self, request, event_id=None):
        """
        Удаление события
        """
        response = Response()
        if event_id:
            event = EventScheduler.objects.get(id=event_id)
            event.delete()
            response.data = {
                "success_message": "Событие успешно удалёно!",
            }
            return response
