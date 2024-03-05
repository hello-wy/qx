import json
import sys
import requests
import threading
import datetime
import time

print(sys.argv[1])

while True:
    current_time = datetime.datetime.now()
    target_time = datetime.time(9, 58)  # 设置目标时间为9:59
    if current_time.time() < target_time:
        print("当前时间:", current_time.strftime("%H:%M:%S"), "，未达到目标时间，继续等待...")
        time.sleep(80)  # 每隔60秒检查一次
    else:
        print("已达到目标时间：", target_time.strftime("%H:%M:%S"))
        break

headers = {
    "Content-Type": "application/json",
    "EpgSession": "JSESSIONID=03XPYUP2EULXAZZ9IZQDJWHZG26CFTY7",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 miguaikan",
    "Cookie": str(sys.argv[1])
}
reward_url=" https://gw.aikan.miguvideo.com/ygw/api/dispatch/energy-center/energy/sendAward"

data_38={
    "id" : 11,
    "energy" : "3800"
}
data_1={
    "id" : 1,
    "energy" : "10000"
}
data_5={
    "id" : 3,
    "energy" : "50000"
}

def send_request(data):
    for i in range(1000):
        try:
            res = requests.post(url=reward_url, headers=headers, data=json.dumps(data))
            response_json = res.json()
            print(res.text)
            if response_json.get("code") != 1014:
                print(res.text)
            # 成功  奖品兑换完 奖品已经领过了
            if response_json.get("success") or response_json.get("code") == 1013 or response_json.get("code") == 1012:
                break
            time.sleep(1)
        except Exception as e:
            print(e)
            pass

threads = []

thread_38 = threading.Thread(target=send_request, args=(data_38,))
thread_1 = threading.Thread(target=send_request, args=(data_1,))
thread_5 = threading.Thread(target=send_request, args=(data_5,))
thread_5_2 = threading.Thread(target=send_request, args=(data_5,))

threads.append(thread_38)
threads.append(thread_1)
threads.append(thread_5)
threads.append(thread_5_2)

for thread in threads:
    thread.start()

for thread in threads:
    thread.join()