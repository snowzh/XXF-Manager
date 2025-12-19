import requests
import json
import random
import string

# 生成随机字符串用于测试
def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# 测试配置
BASE_URL = 'http://localhost:8000/api'

# 测试结果记录
test_results = {
    'passed': 0,
    'failed': 0,
    'errors': []
}

# 辅助函数：执行测试
def run_test(description, test_func):
    print(f"\n=== 测试: {description} ===")
    try:
        test_func()
        print("✅ 测试通过")
        test_results['passed'] += 1
    except Exception as e:
        print(f"❌ 测试失败: {str(e)}")
        test_results['failed'] += 1
        test_results['errors'].append(f"{description}: {str(e)}")

# 1. 测试班级管理
test_class_id = None
test_class_name = f"测试班级_{generate_random_string()}"

# 1.1 测试创建班级
def test_create_class():
    global test_class_id
    url = f"{BASE_URL}/classes/"
    data = {
        "name": test_class_name,
        "grade": 10
    }
    response = requests.post(url, json=data)
    response.raise_for_status()
    result = response.json()
    print(f"创建班级成功: {result}")
    test_class_id = result['id']

# 1.2 测试获取班级列表
def test_get_classes():
    url = f"{BASE_URL}/classes/"
    response = requests.get(url)
    response.raise_for_status()
    results = response.json()
    print(f"获取班级列表成功，共 {len(results)} 个班级")
    # 验证测试班级是否存在
    class_exists = any(cls['name'] == test_class_name for cls in results)
    if not class_exists:
        raise Exception(f"测试班级 {test_class_name} 不存在于列表中")

# 2. 测试学生管理
test_student_id = None
test_student_no = f"S{generate_random_string(6)}"

# 2.1 测试创建学生（不关联班级）
def test_create_student():
    global test_student_id
    url = f"{BASE_URL}/students/"
    data = {
        "name": "测试学生",
        "student_id": test_student_no,
        "gender": "M",
        "birthday": "2000-01-01",
        "phone": "13800138000",
        "address": "测试地址"
        # 不提供class_name，测试创建时不关联班级
    }
    print(f"创建学生数据: {json.dumps(data, ensure_ascii=False)}")
    response = requests.post(url, json=data)
    print(f"响应状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    response.raise_for_status()
    result = response.json()
    print(f"创建学生成功: {result}")
    test_student_id = result['id']
    # 验证学生创建时没有关联班级
    assert result['class_name'] is None, f"学生创建时不应关联班级，实际: {result['class_name']}"

# 2.2 测试学生报名班级
def test_enroll_student():
    url = f"{BASE_URL}/students/{test_student_id}/"
    # 获取学生当前信息，确保包含所有必填字段
    get_response = requests.get(url)
    get_response.raise_for_status()
    current_student = get_response.json()
    
    data = {
        # 包含所有必填字段
        "name": current_student['name'],
        "student_id": current_student['student_id'],
        "gender": current_student['gender'],
        "birthday": current_student['birthday'],
        "class_name": test_class_id
    }
    response = requests.put(url, json=data)
    print(f"学生报名响应状态码: {response.status_code}")
    print(f"学生报名响应内容: {response.text}")
    response.raise_for_status()
    result = response.json()
    print(f"学生报名成功: {result}")
    # 验证学生已关联班级
    assert result['class_name'] == test_class_id, f"学生报名失败，班级未关联，实际: {result['class_name']}"

# 2.3 测试获取学生列表
def test_get_students():
    url = f"{BASE_URL}/students/"
    response = requests.get(url)
    response.raise_for_status()
    results = response.json()
    print(f"获取学生列表成功，共 {len(results)} 个学生")
    # 验证测试学生是否存在
    student_exists = any(student['student_id'] == test_student_no for student in results)
    if not student_exists:
        raise Exception(f"测试学生 {test_student_no} 不存在于列表中")

# 2.4 测试获取单个学生
def test_get_student():
    url = f"{BASE_URL}/students/{test_student_id}/"
    response = requests.get(url)
    response.raise_for_status()
    result = response.json()
    print(f"获取单个学生成功: {result}")
    if result['id'] != test_student_id:
        raise Exception(f"获取的学生ID不匹配，期望 {test_student_id}，实际 {result['id']}")

# 2.5 测试更新学生信息
def test_update_student():
    url = f"{BASE_URL}/students/{test_student_id}/"
    data = {
        "name": "更新后的测试学生",
        "gender": "F",
        "phone": "13900139000"
    }
    response = requests.put(url, json=data)
    print(f"更新学生响应状态码: {response.status_code}")
    print(f"更新学生响应内容: {response.text}")
    response.raise_for_status()
    result = response.json()
    print(f"更新学生成功: {result}")
    if result['name'] != "更新后的测试学生":
        raise Exception("学生名称更新失败")
    if result['gender'] != "F":
        raise Exception("学生性别更新失败")

# 2.6 测试删除学生
def test_delete_student():
    url = f"{BASE_URL}/students/{test_student_id}/"
    response = requests.delete(url)
    response.raise_for_status()
    print(f"删除学生成功")
    
    # 验证学生已删除
    url = f"{BASE_URL}/students/{test_student_id}/"
    response = requests.get(url)
    if response.status_code != 404:
        raise Exception(f"学生未成功删除，状态码: {response.status_code}")

# 3. 清理测试数据
def test_cleanup():
    # 删除测试班级
    if test_class_id:
        url = f"{BASE_URL}/classes/{test_class_id}/"
        response = requests.delete(url)
        response.raise_for_status()
        print(f"清理测试班级成功")

# 执行所有测试
def run_all_tests():
    print("开始执行学生管理系统CRUD测试")
    print(f"测试API地址: {BASE_URL}")
    
    # 执行班级相关测试
    run_test("创建班级", test_create_class)
    run_test("获取班级列表", test_get_classes)
    
    # 执行学生相关测试
    run_test("创建学生（不关联班级）", test_create_student)
    run_test("获取学生列表", test_get_students)
    run_test("获取单个学生", test_get_student)
    run_test("学生报名班级", test_enroll_student)
    run_test("更新学生信息", test_update_student)
    run_test("删除学生", test_delete_student)
    
    # 清理测试数据
    run_test("清理测试数据", test_cleanup)
    
    # 打印测试结果
    print(f"\n=== 测试结果汇总 ===")
    print(f"通过测试: {test_results['passed']}")
    print(f"失败测试: {test_results['failed']}")
    
    if test_results['errors']:
        print(f"\n错误详情:")
        for error in test_results['errors']:
            print(f"  - {error}")
    
    print(f"\n测试完成")
    return test_results['failed'] == 0

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)