import json
import requests
import threading
import time
headers = {
    "Content-Type": "application/json",
    "EpgSession": "JSESSIONID=03XPYUP2EULXAZZ9IZQDJWHZG26CFTY7",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 miguaikan",
    "Cookie":"mToken=ebd49e2ef3a9ca33f6c7ed9c054f7bcdbbf005df6786119e54b83aa8a508e5de1c8b74d66281b14bc0639d00b20052cd6bce9fcf5c2c37cbc45b6b5b7cdd753588215ca7c66475a126559678a59990cfdc58814f6d53ee71f84a8ac822d5abb84dc0134b075378a205acb71dd5287c0bbaa9fc5ce7cd50dae209b3dcabe8eb3d06e9d24535f6a69cf7121750963c787636b45d40527c64ef39ac80f970e8f8a61e9f0250b44e292144241eca15ae965bdd7d8179b21c7b42ab257362e93123bd59512356bd98a7d9802aabe51d490c3812568f58d34e76546faada50ed9ed3b61e52d6f4e84b551ed9c511153ffdc1ac161c1ddc50d74b8626b49b7bcf18ce16437822041a95c7a931205b42bf140a4a4e4b2e38ee8ea0be5b98b5cf2cf0303b03e35a4042ed89e21c8c97acb34d2e935ce753673288dffea78230f9b51d7496017da130313e924e076930c2e6481511d68f36ca06694605ff89a619da85503d302ae594363e96cba85b5bcff61ce4a1fe6462f1a70441f5338c379e2199f1a8e6c9e0c68364cd3efd3a91e82c7bc3a5e151a91447de84a107b4d58c2b59e911198ac2eb82033fff9ee898db3f2f0a73dd413c32f129439b3ad2e87dcf7f78c4b7d76f4c0057bbe223c73d8f395c988e7130dd68a348c01d74ea790156287e955072524ad68871d6e93925a3e9a88d999bd2005193fe5c918f75267cd3dd83e74ead3cb22c4e2d7c4bcae38606fd5a7db441c45cdf38d149e8078af7ddab708d484352075c60480e1dc3692731547cb73a496252f6408c8b074b97a529acdb48dde9ce3ad6e18784a41f8f7646c0bf1c80f53ea0dcd39d97168f739eccf979e336b45d40527c64ef39ac80f970e8f8a61e9f0250b44e292144241eca15ae965bdd7d8179b21c7b42ab257362e93123bd59512356bd98a7d9802aabe51d490c3812568f58d34e76546faada50ed9ed3b6b85864aaf134aa1039e26b5a5404bf91db4542df0706cd83b47d1914449cdeba01e95b66e706c059e832d39b53144660415914e4134482fdda3deb7efdc62af51f8fc2d68cdbe4d26876ed7404411fb9785f330d33f3ce5c3658c1d88ebfa31569da8b256c3da65b01effdc796fefc2d269074847487e485330f8e86dde7e357833d9835b05fe0c585bf148be28891cdbae7cff4f0c68e6de9456d64bf3b92265ea9bdc0df87b059847f2cfdc2d32e5022e55e34e60877064fee84d9572119c48273f431bb67528150ebbe08f9a2c2fad780099cd4f5c2e043ff8fbd31ca1727bcbfe98277c837a5b0b23d68ce92a25136c77ab5e62f3b5bfa1a5a6fcf61d8c7336925f9e474b4f662cad1229d6bcc706b81600764618cad2f0d1b2ef96286dbb62d8a75b5345c1cdb7d17c20141931081aa0c984ad5028be67295d24b1e75c326f3293f1573459cfd1d27de4da7c63717b662fd39b82c6305ca9f541fa026b654f6974f86ee0ebb6e3b5395ee8c6d0941f7190ceca1e98a53f50ee8b15a55d99a3f953682392c86347c17e31e10f48ff6167bced88c7f1e8c9f4b66de93f517b3196e4803fa27b3b9088059802852ef6fc2786a2a3c0ed97d9d63dd66d82d2c281ffa1e3d455fb7513104e64f93d231d8d52dedf5c2aee71dcc77b139c7fd622aac3059df399ee41ca14b8f4591594022ff2d8684ea679b5a5570e2a72ab1b4"
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
    for i in range(100):
        res = requests.post(url=reward_url, headers=headers, data=json.dumps(data))
        response_json = res.json()
        print(res.text)
        if response_json.get("success"):
            break
        time.sleep(1)

threads = []

thread_38 = threading.Thread(target=send_request, args=(data_38,))
thread_1 = threading.Thread(target=send_request, args=(data_1,))
thread_5 = threading.Thread(target=send_request, args=(data_5,))

threads.append(thread_38)
threads.append(thread_1)
threads.append(thread_5)

for thread in threads:
    thread.start()

for thread in threads:
    thread.join()