from rest_framework import serializers
from .models import Employee, Project, Task, EventScheduler, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ["id", "first_name", "last_name", "email", "photo", "password", "post", "date_joined"]
        extra_kwargs = {
            "password": {"write_only": True},
            "date_joined": {"read_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ProjectSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "name", "description", "employee", "creator", "tasks", "created_at"]
        extra_kwargs = {
            "created_at": {"read_only": True}
        }

    @staticmethod
    def get_tasks(project):
        return Task.objects.filter(project=project.id).values()


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id", "name", "description", "deadline", "priority", "category", "executor", "status", "project",
            "creator", "created_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True}
        }


class EventSchedulerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventScheduler
        fields = [
            "id", "employee", "time_begin", "time_end", "name", "created_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
        }


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id", "description", "author", "task", "created_at"
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
        }
