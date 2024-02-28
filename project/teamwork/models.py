from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.db import models
from django_softdelete.models import SoftDeleteModel

__all__ = (
    "Employee",
    "Project",
    "Task",
    "Comment",
)
POSITION_CHOICES = (
    ("JR", "Junior developer"),
    ("MD", "Middle developer"),
    ("SR", "Senior developer"),
    ("TL", "Team lead"),
    ("PM", "Project manager"),
)
PRIORITY_CHOICES = (
    ("Lowset", "Очень низкий"),
    ("Low", "Низкий"),
    ("Medium", "Средний"),
    ("High", "Важный"),
    ("Highest", "Срочный"),
)
CATEGORY_CHOICES = (
    ("Bug", "Баг"),
    ("Task", "Задача"),
    ("Epic", "Epic"),
    ("Refactor", "Рефакторинг")
)
STATUS_CHOICES = (
    ("TO DO", "Созданo"),
    ("Stopped", "Приостановлено"),
    ("In progress", "В работе"),
    ("Review", "На ревью"),
    ("In testing", "В тестировании"),
    ("Complete", "Выполнено"),
)


class Employee(AbstractUser, SoftDeleteModel):  # для физического удаления записи использовать hard_delete()
    """
    Модель сотрудника
    """

    email = models.EmailField(max_length=128, unique=True, verbose_name="Email")
    password = models.CharField(max_length=128, verbose_name="Пароль")
    post = models.CharField(max_length=128, choices=POSITION_CHOICES, verbose_name="Должность")
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.second_name}"

    class Meta:
        verbose_name = "Сотрудники"
        verbose_name_plural = "Сотрудники"
        ordering = ("first_name",)


class Project(SoftDeleteModel):
    """
    Модель проекта
    """

    name = models.CharField(max_length=128, verbose_name="Название")
    description = models.CharField(max_length=200, verbose_name="Описание")
    employee = models.ManyToManyField(Employee, verbose_name="Сотрудник проекта", related_name="project_as_employee")
    creator = models.ForeignKey(Employee, verbose_name="Создатель проекта", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True, verbose_name="Дата создания")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ("id",)


class Task(SoftDeleteModel):
    """
    Модель задачи
    """

    name = models.CharField(max_length=128, verbose_name="Название")
    description = models.CharField(max_length=200, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now=True, verbose_name="Дата создания")
    deadline = models.DateTimeField(verbose_name="Дата окончания")
    priority = models.CharField(max_length=128, choices=PRIORITY_CHOICES, verbose_name="Приоритет")
    category = models.CharField(max_length=128, choices=CATEGORY_CHOICES, verbose_name="Тип задачи")
    executor = models.ForeignKey(Employee, verbose_name="Исполнитель", on_delete=models.CASCADE)
    status = models.CharField(max_length=128, choices=STATUS_CHOICES, verbose_name="Статус задачи")
    project = models.ForeignKey(Project, verbose_name="Проект", on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"
        ordering = ("project",)


class Comment(SoftDeleteModel):
    """
    Модель комментария
    """

    description = models.CharField(max_length=200, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now=True, verbose_name="Дата создания")
    author = models.ForeignKey(Employee, verbose_name="Автор комментария", on_delete=models.CASCADE)
    task = models.ForeignKey(Task, verbose_name="Задача", on_delete=models.CASCADE)

    def __str__(self):
        return self.description

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"
        ordering = ("task",)
