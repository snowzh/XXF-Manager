import requests

# 创建一个班级记录
def create_class():
    print("创建班级记录...")
    url = "http://localhost:8000/api/classes/"  # 假设存在班级API
    data = {
        "name": "初一(3)班",
        "grade": 7
    }
    try:
        response = requests.post(url, json=data)
        print(f"状态码: {response.status_code}")
        print(f"响应头: {response.headers}")
        print(f"响应内容: {response.text}")
        return response.status_code
    except Exception as e:
        print(f"请求失败: {e}")
        return None

# 主函数
if __name__ == "__main__":
    create_class()
