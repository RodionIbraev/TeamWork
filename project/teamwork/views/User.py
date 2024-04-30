import datetime

import jwt
from django.contrib.auth.password_validation import validate_password
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView

from teamwork.models import Employee, Project
from teamwork.serializers import UserSerializer
from teamwork.views.auxiliary import auth_required, get_user


class RegisterView(APIView):
    """
    Регистрация пользователя
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        # Проверка пароля на сложность
        try:
            validate_password(request.data["password"])
        except Exception as password_error:
            error_array = []
            for item in password_error:
                error_array.append(item)
            response = Response()
            response.data = {
                "Status": False,
                "Errors": {"password": error_array}
            }
            return response

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def get(self, request):
        post_names = Employee.get_post_names()
        response = Response()
        response.data = {
            "post_names": post_names
        }
        return response


class LoginView(APIView):
    """
    Аутентификация пользователя
    """
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = Employee.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("Пользователя не существует!")

        if not user.check_password(password):
            raise AuthenticationFailed("Введён некорректный пароль!")

        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=120),
            "iat": datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")

        response = Response()
        response.set_cookie(key="jwt_token", value=token, httponly=True)
        response.data = {
            "jwt_token": token
        }

        return response


class LogoutView(APIView):
    """
    Выход пользователя
    """
    @auth_required
    def get(self, request):
        response = Response()
        response.delete_cookie("jwt_token")
        response.data = {
            "message": "success logout!"
        }

        return response


class UserProfileView(APIView):
    """
    Профиль пользователя
    """
    @auth_required
    def get(self, request):
        user = get_user(request)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class GetEmployeesView(APIView):
    """
    Получение пользоватиелей
    """
    @auth_required
    def get(self, request, project_id=None):
        employees = Employee.get_queryset()
        if project_id:
            employees = Project.get_employees_of_project(project_id)
        users_serializer = UserSerializer(employees, many=True)
        return Response(users_serializer.data)
