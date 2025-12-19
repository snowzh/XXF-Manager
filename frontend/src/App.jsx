import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Tabs } from 'antd';
import axios from 'axios';
import './App.css';

const { Option } = Select;
const { TabPane } = Tabs;

function App() {
  // 导航状态
  const [activeTab, setActiveTab] = useState('students');
  
  // 学生相关状态
  const [students, setStudents] = useState([]);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isStudentEditModalVisible, setIsStudentEditModalVisible] = useState(false);
  const [isStudentEnrollModalVisible, setIsStudentEnrollModalVisible] = useState(false);
  const [studentForm] = Form.useForm();
  const [studentEditForm] = Form.useForm();
  const [studentEnrollForm] = Form.useForm();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enrollStudent, setEnrollStudent] = useState(null);
  
  // 班级相关状态
  const [classes, setClasses] = useState([]);
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [isClassEditModalVisible, setIsClassEditModalVisible] = useState(false);
  const [classForm] = Form.useForm();
  const [classEditForm] = Form.useForm();
  const [selectedClass, setSelectedClass] = useState(null);

  // 获取学生列表
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/students/');
      setStudents(response.data);
    } catch (error) {
      message.error('获取学生列表失败');
      console.error('Error fetching students:', error);
    }
  };

  // 获取班级列表
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/classes/');
      setClasses(response.data);
    } catch (error) {
      message.error('获取班级列表失败');
      console.error('Error fetching classes:', error);
    }
  };

  // 初始化时获取数据
  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  // 切换标签页
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 显示添加学生模态框
  const showAddStudentModal = () => {
    setIsStudentModalVisible(true);
  };

  // 显示编辑学生模态框
  const showEditStudentModal = (student) => {
    setSelectedStudent(student);
    studentEditForm.setFieldsValue(student);
    setIsStudentEditModalVisible(true);
  };

  // 关闭添加学生模态框
  const handleStudentAddCancel = () => {
    setIsStudentModalVisible(false);
    studentForm.resetFields();
  };

  // 关闭编辑学生模态框
  const handleStudentEditCancel = () => {
    setIsStudentEditModalVisible(false);
    studentEditForm.resetFields();
    setSelectedStudent(null);
  };

  // 显示学生报名模态框
  const showEnrollStudentModal = (student) => {
    setEnrollStudent(student);
    studentEnrollForm.setFieldsValue({ class_name: student.class_name?.id || undefined });
    setIsStudentEnrollModalVisible(true);
  };

  // 关闭学生报名模态框
  const handleStudentEnrollCancel = () => {
    setIsStudentEnrollModalVisible(false);
    studentEnrollForm.resetFields();
    setEnrollStudent(null);
  };

  // 处理学生报名
  const handleStudentEnroll = async (values) => {
    try {
      console.log('报名学生数据:', values);
      // 简化报名数据，只包含需要更新的字段
      const studentData = {
        // 直接使用class_name_id，因为后端期望的是外键ID
        class_name: values.class_name
      };
      console.log('报名数据:', studentData);
      const response = await axios.patch(`http://localhost:8000/api/students/${enrollStudent.id}/`, studentData);
      console.log('报名学生响应:', response.data);
      message.success('学生报名成功');
      setIsStudentEnrollModalVisible(false);
      studentEnrollForm.resetFields();
      setEnrollStudent(null);
      // 重新获取学生列表，确保数据最新
      fetchStudents();
    } catch (error) {
      message.error('学生报名失败');
      console.error('Error enrolling student:', error);
      if (error.response) {
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', error.response.data);
      }
    }
  };

  // 添加学生
  const handleAddStudent = async (values) => {
    try {
      // 确保日期格式正确 - 使用原生JavaScript处理
      const studentData = {
        ...values,
        // Input type="date" 已经返回 YYYY-MM-DD 格式的字符串
        birthday: values.birthday
      };
      console.log('提交的学生数据:', studentData);
      const response = await axios.post('http://localhost:8000/api/students/', studentData);
      console.log('添加学生响应:', response.data);
      message.success('添加学生成功');
      setIsStudentModalVisible(false);
      studentForm.resetFields();
      fetchStudents();
    } catch (error) {
      message.error('添加学生失败');
      console.error('Error adding student:', error);
      if (error.response) {
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', error.response.data);
        // 显示具体错误信息
        const errorMsg = Object.values(error.response.data).flat().join('; ');
        message.error(`添加学生失败: ${errorMsg}`);
      }
    }
  };

  // 编辑学生
  const handleEditStudent = async (values) => {
    try {
      // 确保日期格式正确 - 使用原生JavaScript处理
      const studentData = {
        ...values,
        // 确保birthday是字符串格式，处理可能的对象类型
        birthday: typeof values.birthday === 'string' ? values.birthday : values.birthday
      };
      console.log('编辑学生数据:', studentData);
      const response = await axios.put(`http://localhost:8000/api/students/${selectedStudent.id}/`, studentData);
      console.log('编辑学生响应:', response.data);
      message.success('编辑学生成功');
      setIsStudentEditModalVisible(false);
      studentEditForm.resetFields();
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      message.error('编辑学生失败');
      console.error('Error editing student:', error);
      if (error.response) {
        console.error('错误状态码:', error.response.status);
        console.error('错误响应数据:', error.response.data);
        // 显示具体错误信息
        const errorMsg = Object.values(error.response.data).flat().join('; ');
        message.error(`编辑学生失败: ${errorMsg}`);
      }
    }
  };

  // 删除学生
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/students/${id}/`);
      message.success('删除学生成功');
      fetchStudents();
    } catch (error) {
      message.error('删除学生失败');
      console.error('Error deleting student:', error);
    }
  };

  // 显示添加班级模态框
  const showAddClassModal = () => {
    setIsClassModalVisible(true);
  };

  // 显示编辑班级模态框
  const showEditClassModal = (cls) => {
    setSelectedClass(cls);
    classEditForm.setFieldsValue(cls);
    setIsClassEditModalVisible(true);
  };

  // 关闭添加班级模态框
  const handleClassAddCancel = () => {
    setIsClassModalVisible(false);
    classForm.resetFields();
  };

  // 关闭编辑班级模态框
  const handleClassEditCancel = () => {
    setIsClassEditModalVisible(false);
    classEditForm.resetFields();
    setSelectedClass(null);
  };

  // 添加班级
  const handleAddClass = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/classes/', values);
      message.success('添加班级成功');
      setIsClassModalVisible(false);
      classForm.resetFields();
      fetchClasses();
    } catch (error) {
      message.error('添加班级失败');
      console.error('Error adding class:', error);
    }
  };

  // 编辑班级
  const handleEditClass = async (values) => {
    try {
      await axios.put(`http://localhost:8000/api/classes/${selectedClass.id}/`, values);
      message.success('编辑班级成功');
      setIsClassEditModalVisible(false);
      classEditForm.resetFields();
      setSelectedClass(null);
      fetchClasses();
    } catch (error) {
      message.error('编辑班级失败');
      console.error('Error editing class:', error);
    }
  };

  // 删除班级
  const handleDeleteClass = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/classes/${id}/`);
      message.success('删除班级成功');
      fetchClasses();
    } catch (error) {
      message.error('删除班级失败');
      console.error('Error deleting class:', error);
    }
  };

  // 学生列配置
  const studentColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学号',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => (text === 'M' ? '男' : '女'),
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: '班级',
      dataIndex: ['class_name', 'name'],
      key: 'class_name',
      render: (text) => text || '未报名',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '家庭地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => showEnrollStudentModal(record)} style={{ marginRight: 8 }}>
            {record.class_name ? '修改班级' : '报名'}
          </Button>
          <Button type="default" size="small" onClick={() => showEditStudentModal(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Button danger size="small" onClick={() => handleDeleteStudent(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  // 班级列配置
  const classColumns = [
    {
      title: '班级名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => showEditClassModal(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Button danger size="small" onClick={() => handleDeleteClass(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="app-container">
      <h1>学生管理系统</h1>
      
      {/* 导航标签 */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ marginBottom: 16 }}>
        <TabPane tab="学生管理" key="students" />
        <TabPane tab="班级管理" key="classes" />
      </Tabs>

      {/* 学生管理 */}
      {activeTab === 'students' && (
        <>
          <Button type="primary" onClick={showAddStudentModal} style={{ marginBottom: 16 }}>
            添加学生
          </Button>
          <Table columns={studentColumns} dataSource={students} rowKey="id" />
        </>
      )}

      {/* 班级管理 */}
      {activeTab === 'classes' && (
        <>
          <Button type="primary" onClick={showAddClassModal} style={{ marginBottom: 16 }}>
            添加班级
          </Button>
          <Table columns={classColumns} dataSource={classes} rowKey="id" />
        </>
      )}

      {/* 添加学生模态框 */}
      <Modal
        title="添加学生"
        open={isStudentModalVisible}
        onCancel={handleStudentAddCancel}
        footer={null}
      >
        <Form
          form={studentForm}
          layout="vertical"
          onFinish={handleAddStudent}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="student_id"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value="M">男</Option>
              <Option value="F">女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="birthday"
            label="出生日期"
            rules={[{ required: true, message: '请输入出生日期' }]}
          >
            <Input type="date" />
          </Form.Item>
          {/* 创建学生时不关联班级，通过报名功能关联 */}
          <Form.Item
            name="phone"
            label="联系电话"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="家庭地址"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              确定
            </Button>
            <Button onClick={handleStudentAddCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑学生模态框 */}
      <Modal
        title="编辑学生"
        open={isStudentEditModalVisible}
        onCancel={handleStudentEditCancel}
        footer={null}
      >
        <Form
          form={studentEditForm}
          layout="vertical"
          onFinish={handleEditStudent}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="student_id"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value="M">男</Option>
              <Option value="F">女</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="birthday"
            label="出生日期"
            rules={[{ required: true, message: '请输入出生日期' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="class_name"
            label="班级"
            rules={[]}
          >
            <Select allowClear placeholder="请选择班级">
              {classes.map(cls => (
                <Option key={cls.id} value={cls.id}>{cls.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="家庭地址"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              确定
            </Button>
            <Button onClick={handleStudentEditCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 学生报名模态框 */}
      <Modal
        title={enrollStudent?.class_name ? "修改班级" : "学生报名"}
        open={isStudentEnrollModalVisible}
        onCancel={handleStudentEnrollCancel}
        footer={null}
      >
        <Form
          form={studentEnrollForm}
          layout="vertical"
          onFinish={handleStudentEnroll}
        >
          <Form.Item
            label="学生姓名"
          >
            <Input value={enrollStudent?.name} disabled />
          </Form.Item>
          <Form.Item
            label="学号"
          >
            <Input value={enrollStudent?.student_id} disabled />
          </Form.Item>
          <Form.Item
            name="class_name"
            label="班级"
            rules={[{ required: true, message: '请选择班级' }]}
          >
            <Select placeholder="请选择班级">
              {classes.map(cls => (
                <Option key={cls.id} value={cls.id}>{cls.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              确定
            </Button>
            <Button onClick={handleStudentEnrollCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加班级模态框 */}
      <Modal
        title="添加班级"
        open={isClassModalVisible}
        onCancel={handleClassAddCancel}
        footer={null}
      >
        <Form
          form={classForm}
          layout="vertical"
          onFinish={handleAddClass}
        >
          <Form.Item
            name="name"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              确定
            </Button>
            <Button onClick={handleClassAddCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑班级模态框 */}
      <Modal
        title="编辑班级"
        open={isClassEditModalVisible}
        onCancel={handleClassEditCancel}
        footer={null}
      >
        <Form
          form={classEditForm}
          layout="vertical"
          onFinish={handleEditClass}
        >
          <Form.Item
            name="name"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              确定
            </Button>
            <Button onClick={handleClassEditCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
