from rest_framework import serializers
from .models import Student, Class

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        # 支持部分更新
        extra_kwargs = {
            'student_id': {'required': False},
            'birthday': {'required': False},
            'class_name': {'required': False}
        }
