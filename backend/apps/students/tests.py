from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Student

class StudentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student_data = {
            'name': '张三',
            'student_id': '20250001',
            'sex': 'M',
            'birth_date': '2010-01-01',
            'class_name': '初一(1)班',
            'grade': 7,
            'phone': '13800138000',
            'address': '北京市海淀区'
        }
        self.student = Student.objects.create(**self.student_data)

    def test_get_students(self):
        """测试获取学生列表"""
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_student(self):
        """测试获取单个学生"""
        response = self.client.get(f'/api/students/{self.student.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.student.name)

    def test_create_student(self):
        """测试创建学生"""
        new_student_data = {
            'name': '李四',
            'student_id': '20250002',
            'sex': 'F',
            'birth_date': '2010-02-02',
            'class_name': '初一(2)班',
            'grade': 7,
            'phone': '13800138001',
            'address': '北京市朝阳区'
        }
        response = self.client.post('/api/students/', new_student_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)

    def test_update_student(self):
        """测试更新学生"""
        update_data = {'name': '张三三'}
        response = self.client.put(f'/api/students/{self.student.id}/', update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.name, '张三三')

    def test_delete_student(self):
        """测试删除学生"""
        response = self.client.delete(f'/api/students/{self.student.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)
