from django.db import models

class Class(models.Model):
    name = models.CharField(max_length=50, verbose_name='班级名称')
    grade = models.IntegerField(verbose_name='年级')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '班级'
        verbose_name_plural = '班级管理'

    def __str__(self):
        return self.name

class Student(models.Model):
    GENDER_CHOICES = (
        ('M', '男'),
        ('F', '女'),
    )
    name = models.CharField(max_length=50, verbose_name='姓名')
    student_id = models.CharField(max_length=20, unique=True, verbose_name='学号')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name='性别', default='M')
    birthday = models.DateField(verbose_name='出生日期', blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True, verbose_name='家庭地址')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='联系电话')
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name='班级', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '学生'
        verbose_name_plural = '学生管理'

    def __str__(self):
        return self.name
