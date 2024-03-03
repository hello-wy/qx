
// const $ = new nobyda(); 
// 发送一个通知: $.notify('title', 'subtitle', 'message')
// 持久化读取: $.read('Key')
// POST请求: $.post(url<Object>,callback<Function>)

function wuy() {
	const isSurge = typeof $httpClient != "undefined";
	const isQuanX = typeof $task != "undefined";
	const isNode = typeof require == "function";
	const node = (() => {
		if (isNode) {
			const request = require('request');
			return {
				request
			}
		} else {
			return null;
		}
	})()
	const adapterStatus = (response) => {
		if (response) {
			if (response.status) {
				response["statusCode"] = response.status
			} else if (response.statusCode) {
				response["status"] = response.statusCode
			}
		}
		return response
	}
    // 将获得的cookies信息储存起来
    this.write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key);
        if (isSurge) return $persistentStore.write(value, key);
        if (isNode) {
            try {
                if (!node.fs.existsSync(NodeSet)) node.fs.writeFileSync(NodeSet, JSON.stringify({}));
                const dataValue = JSON.parse(node.fs.readFileSync(NodeSet));
                if (value) dataValue[key] = value;
                if (!value) delete dataValue[key];
                return node.fs.writeFileSync(NodeSet, JSON.stringify(dataValue));
            } catch (er) {
                return AnError("Node.js持久化写入", null, er);
            }
        }
    };
	this.read = (key) => {
		if (isQuanX) return $prefs.valueForKey(key)
		if (isSurge) return $persistentStore.read(key)
	}
    // 异常信息
    const AnError = (name, keyname, er, resp, body) => {
        if (typeof (merge) != "undefined" && keyname) {
            if (!merge[keyname].notify) {
                merge[keyname].notify = `${ name }: 异常, 已输出日志 ‼️`;
            } else {
                merge[keyname].notify += `\n${ name }: 异常, 已输出日志 ‼️ (2)`;
            }
            merge[keyname].error = 1;
        }
        return console.log(`\n‼️${ name }发生错误\n‼️名称: ${ er.name }\n‼️描述: ${ er.message }${ JSON.stringify(er).match(/"line"/) ? `\n‼️行列: ${ JSON.stringify(er) }` : `` }${ resp && resp.status ? `\n‼️状态: ${ resp.status }` : `` }${ body ? `\n‼️响应: ${ resp && resp.status != 503 ? body : `Omit.` }` : `` }`);
    };
	this.notify = (title, subtitle, message) => {
		if (isQuanX) $notify(title, subtitle, message)
		if (isSurge) $notification.post(title, subtitle, message)
		if (isNode) console.log(`${title}\n${subtitle}\n${message}`)
	}
	this.post = (options, callback) => {
		options.headers['User-Agent'] = 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/609.3.5.0.2 (KHTML, like Gecko) Mobile/17G80 BiliApp/822 mobi_app/ios_comic channel/AppStore BiliComic/822'
		if (isQuanX) {
			if (typeof options == "string") options = {
				url: options
			}
			options["method"] = "POST"
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isSurge) {
			options.headers['X-Surge-Skip-Scripting'] = false
			$httpClient.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
		if (isNode) {
			node.request.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	}
	this.done = () => {
		if (isQuanX || isSurge) {
			$done()
		}
	}
};

let $ = new wuy();
let productName = $.read('BM_ProductName') || '积分兑换';
let productNum = $.read('BM_ProductNum');
let exchangeNum = $.read('BM_ExchangeNum') || '100';
let cookie = $.read('CookieBM');
let user = {};

(async function() {
    const cookieVal = $request.headers['Cookie']
    $.write(cookieVal, 'cookie_ak');
	// await Promise.all([ //该方法用于将多个实例包装成一个新的实例, 可以简单理解为同时调用函数, 以进一步提高执行速度
	// 	GetUserPoint(), 
	// 	ListProduct() 
	// ]);
	// await ExchangeProduct();
	$.done(); 
})();