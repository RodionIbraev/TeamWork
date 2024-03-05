from rest_framework import serializers
from .models import Employee, Project


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ["id", "first_name", "last_name", "email", "password", "post"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "employee", "creator"]
