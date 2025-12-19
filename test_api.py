import requests

# 测试获取学生列表
def test_get_students():
    print("测试获取学生列表...")
    url = "http://localhost:8000/api/students/"
    try:
        response = requests.get(url)
        print(f"状态码: {response.status_code}")
        print(f"响应头: {response.headers}")
        print(f"响应内容长度: {len(response.text)}")
        # 只打印前1000个字符，避免输出过长
        print(f"响应内容(前1000字符): {response.text[:1000]}...")
        return response.status_code
    except Exception as e:
        print(f"请求失败: {e}")
        return None

# 测试添加学生
def test_add_student():
    print("\n测试添加学生...")
    url = "http://localhost:8000/api/students/"
    data = {
        "name": "测试学生",
        "student_id": "20250003",
        "gender": "M",
        "birthday": "2010-03-03",
        "phone": "13800138003",
        "address": "北京市西城区",
        "class_name": 1  # 假设存在ID为1的班级
    }
    try:
        response = requests.post(url, json=data)
        print(f"状态码: {response.status_code}")
        print(f"响应头: {response.headers}")
        print(f"响应内容长度: {len(response.text)}")
        print(f"响应内容(前1000字符): {response.text[:1000]}...")
        return response.status_code
    except Exception as e:
        print(f"请求失败: {e}")
        return None

# 主函数
if __name__ == "__main__":
    test_get_students()
    test_add_student()
