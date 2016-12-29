//javascript设计模式与开发实践  ---曾探
//1，原型模式：模拟js对象new的过程
var objectFactory = function() {
    var obj = new Object(); // 从 Object.prototype 上克隆一个空的对象
    var Constructor = [].shift.call(arguments); // 取得外部传入的构造器,此例是 Person
    obj.__proto__ = Constructor.prototype; // 指向正确的原型
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
};
//测试用例
function Person(name) {
    this.name = name;
}
Person.prototype.getName = function() {
    return this.name;
};
var a = new Person('sven');
console.log(a.name); // 输出:sven
console.log(a.getName()); // 输出:sven
console.log(Object.getPrototypeOf(a) === Person.prototype);
// 输出:true
var a = objectFactory(Person, 'sven');
console.log(a.name); // 输出:sven
console.log(a.getName()); // 输出:sven
console.log(Object.getPrototypeOf(a) === Person.prototype);
// 输出:true

//-----------------------------
//this的指向：
// [1]作为对象的方法调用。
// [2]作为普通函数调用。
// [3]构造器调用。
// [4]Function.prototype.call 或 Function.prototype.apply 调用

//call和apply的应用：
Function.prototype.bind = function() {
    var self = this, // 保存原函数
        context = [].shift.call(arguments),
        args = [].slice.call(arguments);
    return function() { // 返回一个新的函数
        // 需要绑定的 this 上下文 // 剩余的参数转成数组
        return self.apply(context, [].concat.call(args, [].slice.call(arguments))); // 执行新的函数的时候,会把之前传入的 context 当作新函数体内的 this
        // 并且组合两次分别传入的参数,作为新函数的参数
    };
};
//闭包的作用
var Type = {};
var type = ['String', 'Array', 'Number'];
for (var i = 0; type[i++];) {
    (function(type) {
        Type['is' + type] = function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        };
    })(type);
}
Type.isArray([]); // 输出:true
Type.isString("str"); // 输出:true
//另一个版本，对比：
var isType = function(type) {
    return function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    };
};
var isString = isType('String');
var isArray = isType('Array');
var isNumber = isType('Number');
console.log(isArray([1, 2, 3])); // 输出:true


//高阶函数实现AOP(面向切面编程)
Function.prototype.before = function(beforefn) {
    var __self = this; // 保存原函数的引用
    return function() { // 返回包含了原函数和新函数的"代理"函数
        beforefn.apply(this, arguments);
        return __self.apply(this, arguments);
    };
};
Function.prototype.after = function(afterfn) {
    var __self = this;
    return function() {
        // 执行新函数,修正 this // 执行原函数

        var ret = __self.apply(this, arguments);

        afterfn.apply(this, arguments);
        return ret;
    };
};
var func = function() {
    console.log(2);
};
func = func.before(function() {
    console.log(1);
}).after(function() {
    console.log(3);
}).before(function() {
    console.log(4);
});
//console.log(func);
func(); //4,1,2,3-------解析：注意执行顺序。
//函数柯里化（currying）
var currying = function(fn) {
    var args = [];
    return function() {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            [].push.apply(args, arguments);
            return arguments.callee;
        }
    };
};
var cost = (function() {
    var money = 0;
    return function() {
        for (var i = 0, l = arguments.length; i < l; i++) {
            money += arguments[i];
        }
        return money;
    };
})();
var cost = currying(cost);
// 转化成 currying 函数
cost(100);
cost(200);
cost(300);
// 未真正求值 // 未真正求值 // 未真正求值
console(cost()); // 求值并输出:600

//函数节流的代码实现--setTimeout 延迟一段时间执行
var throttle = function(fn, interval) {
    var __self = fn, // 保存需要被延迟执行的函数引用 timer, // 定时器
        firstTime = true; // 是否是第一次调用
    return function() {
        var args = arguments,
            __me = this;
        if (firstTime) { // 如果是第一次调用,不需延迟执行
            __self.apply(__me, args);
            firstTime = false;
            return;
        }
        if (timer) { // 如果定时器还在,说明前一次延迟执行还没有完成
            return false;

        }
        timer = setTimeout(function() { // 延迟一段时间执行
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500);
    };
};
window.onresize = throttle(function() {
    console.log(1);
}, 500);
//分时函数--把 1 秒钟创建 1000 个节点,改为每隔 200 毫秒创建 8 个节点
var timeChunk = function(ary, fn, count) {
    var obj, t;
    var len = ary.length;
    var start = function() {
        for (var i = 0; i < Math.min(count || 1, ary.length); i++) {
            var obj = ary.shift();
            fn(obj);
        }
    };
    return function() {
        t = setInterval(function() {
            if (ary.length === 0) { // 如果全部节点都已经被创建好
                return clearInterval(t);
            }
            start();
        }, 200); // 分批执行的时间间隔,也可以用参数的形式传入
    };
};
//小测试
var ary = [];
for (var i = 1; i <= 1000; i++) {
    ary.push(i);
}
var renderFriendList = timeChunk(ary, function(n) {
    var div = document.createElement('div');
    div.innerHTML = n;
    document.body.appendChild(div);
}, 8);
renderFriendList();
//惰性加载函数
//<html> < body >
//    <div id = "div1" > 点我绑定事件 < /div> <script>
var addEvent = function(elem, type, handler) {
    if (window.addEventListener) {
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        };
    } else if (window.attachEvent) {
        addEvent = function(elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        };
    }
    addEvent(elem, type, handler);
};

var div = document.getElementById('div1');
addEvent(div, 'click', function() {
    alert(1);
});
addEvent(div, 'click', function() {
    alert(2);
});
//</script> </body> </html >
//------------------以上是热身----------------------------
//设计模式
//1，单例模式的定义是:保证一个类仅有一个实例,并提供一个访问它的全局访问点。
// [1]传统语言思路下js实现的单例模式
// [2]js语言特色的单例模式
//-------------------------------------------------------------------

//[1]传统语言思路下js实现的单例模式
//实现[1]
var Singleton = function(name) {
    this.name = name;
    this.instance = null;
};
Singleton.prototype.getName = function() {
    alert(this.name);
};
Singleton.getInstance = function(name) {
    if (!this.instance) {
        this.instance = new Singleton(name);
    }
    return this.instance;
};
//实现[2]
var Singleton = function(name) {
    this.name = name;
};
Singleton.prototype.getName = function() {
    alert(this.name);
};
Singleton.getInstance = (function() {
    var instance = null;
    return function(name) {
        if (!instance) {
            instance = new Singleton(name);
        }
        return instance;
    };
})();
//测试用例：
var a = Singleton.getInstance('sven1');
var b = Singleton.getInstance('sven2');
console.log(a === b); // true
//实现[3]--用代理实现单例模式
var CreateDiv = function(html) {
    this.html = html;
    this.init();
};
CreateDiv.prototype.init = function() {
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
};
var ProxySingletonCreateDiv = (function() {
    var instance;
    return function(html) {
        if (!instance) {
            instance = new CreateDiv(html);
        }
        return instance;
    };
})();
var a = new ProxySingletonCreateDiv('sven1');
var b = new ProxySingletonCreateDiv('sven2');
console.log(a === b); // true
//------------------------------
//[2]js语言特色的单例模式
//实现[1]--------全局对象，全局变量。例如window和使用var定义的全局变量.
var Singleton = {}; //缺点是：容易被覆盖，全局污染
//实现[2]--------命名空间。如extjs，jquery等使用的命名空间。window.jquery={}等
var MyApp = {}; //或者 var MyApp = window.MyApp={};
MyApp.namespace = function(name) {
    var parts = name.split('.');
    var current = MyApp;
    for (var i in parts) {
        if (!current[parts[i]]) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
};
//示例
MyApp.namespace('event');
MyApp.namespace('dom.style');
console.dir(MyApp);
// 上述代码等价于:
var MyApp = {
    namespace: fn,
    event: {},
    dom: {
        style: {}
    }
};
//实现[3]---使用闭包封装
var user = (function() {
    var __name = 'sven',
        __age = 29;
    return {
        getUserInfo: function(from) {
            return __name + '-' + __age + '-' + from;
        }
    };
})();
//示例
user.getUserInfo('来自北京');
//实现[4]---惰性单例------>指的是在需要的时候才创建对象实例
Singleton.getInstance = (function() {
    var instance = null;
    return function(name) {
        if (!instance) {
            instance = new Singleton(name);

        }
        return instance;
    };
})();
//通用单例
var getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    };
};
//示例：
var createLoginLayer = function() {
    //div
    var div = document.createElement('div');
    div.innerHTML = '我是登录浮窗';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};
var createSingleLoginLayer = getSingle(createLoginLayer);
document.getElementById('loginBtn').onclick = function() {
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
};
//或者
var createSingleIframe = getSingle(function() {
    //===iframe
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    return iframe;

});
document.getElementById('loginBtn').onclick = function() {
    var loginLayer = createSingleIframe();
    loginLayer.src = 'http://baidu.com';
};
//总结：单例模式的核心思想：保证一个类仅有一个实例,并提供一个访问它的全局访问点。
//--------------------------------------------------
//2，策略模式
//策略模式的定义是:定义一系列的算法,把它们一个个封装起来,并且使它们可以相互替换
// [1]静态语言（如java）思路实现方式
// [2]js实现方式

//------------------------------
//静态语言思路实现方式---面向对象的类方式
var performanceS = function() {};
performanceS.prototype.calculate = function(salary) {
    return salary * 4;
};
var performanceA = function() {};
performanceA.prototype.calculate = function(salary) {
    return salary * 3;
};
var performanceB = function() {};
performanceB.prototype.calculate = function(salary) {
    return salary * 2;
};
//接下来定义奖金类 Bonus:
var Bonus = function() {
    this.salary = null;
    this.strategy = null;
};
// 原始工资
// 绩效等级对应的策略对象
Bonus.prototype.setSalary = function(salary) {
    this.salary = salary; // 设置员工的原始工资
};
Bonus.prototype.setStrategy = function(strategy) {
    this.strategy = strategy; // 设置员工绩效等级对应的策略对象
};
Bonus.prototype.getBonus = function() { // 取得奖金数额
    return this.strategy.calculate(this.salary); // 把计算奖金的操作委托给对应的策略对象
};
//示例：
var bonus = new Bonus();
bonus.setSalary(10000);
bonus.setStrategy(new performanceS()); // 设置策略对象
console.log(bonus.getBonus()); // 输出:40000
bonus.setStrategy(new performanceA()); // 设置策略对象
console.log(bonus.getBonus()); // 输出:30000
//JavaScript 版本的策略模式
var strategies = {
    "S": function(salary) {
        return salary * 4;
    },
    "A": function(salary) {
        return salary * 3;
    },
    "B": function(salary) {
        return salary * 2;
    }
};
var calculateBonus = function(level, salary) {
    return strategies[level](salary);
};
console.log(calculateBonus('S', 20000)); // 输出:80000
console.log(calculateBonus('A', 10000)); // 输出:30000
//用函数方式实现
var S = function(salary) {
    return salary * 4;
};
var A = function(salary) {
    return salary * 3;
};
var B = function(salary) {
    return salary * 2;
};
var calculateBonus = function(func, salary) {
    return func(salary);

};
calculateBonus(S, 10000); // 输出:40000
//--------------------------------------------------
//3，代理模式
//代理模式是为一个对象提供一个代用品或占位符,以便控制对它的访问，加一个中转的站点或桥梁，比如：红娘，代理商等。
//--------------------------------------------------
//保护代理：帮主体过滤不必要的请求。如，使用缓存，帮服务器过滤不必要的请求，或者如防火墙代理
//虚拟代理：等主体状态好的时候发送请求。如：等服务器空闲的时候发送请求数据（http请求合并）。图片预加载等惰性加载
//虚拟代理示例：(先用loading.gif占位)
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    };
})();
var proxyImage = (function() {
    var img = new Image();
    img.onload = function() {
        myImage.setSrc(this.src);
    };
    return {
        setSrc: function(src) {
            myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
            img.src = src;
        }
    };
})();
proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
//缓存代理：为一些开销大的运算结果提供暂时的存储
/**************** 计算乘积 *****************/
var mult = function() {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return a;
};
/**************** 计算加和 *****************/
var plus = function() {
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a + arguments[i];
    }
    return a;
};
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function(fn) {
    var cache = {};
    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        var result = cache[args] = fn.apply(this, arguments);
        return result;
    };
};
var proxyMult = createProxyFactory(mult),
    proxyPlus = createProxyFactory(plus);

alert(proxyMult(1, 2, 3, 4)); // 输出:24
alert(proxyMult(1, 2, 3, 4)); // 输出:24
alert(proxyPlus(1, 2, 3, 4)); // 输出:10
alert(proxyPlus(1, 2, 3, 4)); // 输出:10
//总结：缓存代理使用比较广泛：（不胜枚举）
// ajax请求数据缓存，
// 防火墙代理，
// 翻墙代理
// 远程代理
// 保护代理
// 只能引用代理
// 写时复制代理
//-----------------------------------------------
//4,迭代器模式:提供一种方法顺序访问一个聚合对象中的各个元素,而又不需要暴露该对象的内部表示
//内部迭代器：具体实现在内部。
var each = function(ary, callback) {
    for (var i = 0, l = ary.length; i < l; i++) {
        callback.call(ary[i], i, ary[i]);

    }
};
each([1, 2, 3], function(i, n) {
    alert([i, n]);
});
//外部迭代器：明显的调用下一次迭代
var Iterator = function(obj) {
    var current = 0;
    var next = function() {
        current += 1;
    };
    var isDone = function() {
        return current >= obj.length;
    };
    var getCurrItem = function() {
        return obj[current];
    };
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    };
};
var compare = function(iterator1, iterator2) {
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw new Error('iterator1 和 iterator2 不相等');
        }
        iterator1.next();
        iterator2.next();
    }
    console.log('iterator1 和 iterator2 相等');
};
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);
compare(iterator1, iterator2); // 输出:iterator1 和 iterator2 相等


//迭代器模式的应用举例:文件上传
var getActiveUploadObj = function() {
    try {
        return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
    } catch (e) {
        return false;
    }
};
var getFlashUploadObj = function() {
    if (supportFlash()) { // supportFlash 函数未提供
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return false;
};

var getFormUpladObj = function() {
    var str = '<input name="file" type = "file" class = "ui-file" / > '; // 表单上传
    return $(str).appendTo($('body'));
};
var iteratorUploadObj = function() {
    for (var i = 0, fn; fn = arguments[i++];) {
        var uploadObj = fn();
        if (uploadObj !== false) {
            return uploadObj;
        }
    }
};
var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUpladObj);
//es6中的迭代器，为了解决回调和异步无线循环和调用的问题，es6引入新的遍历器和解决方案：
//如：Iterator，for..in,,promise,Generator等。详见：http://es6.ruanyifeng.com/#docs/async

//总结：随着es6，nodejs的发展，迭代器将大放光彩！

//-----------------------------------------------
//5，发布—订阅模式又叫观察者模式,它定义对象间的一种一对多的依赖关系,当一个对象的状 态发生改变时,
//所有依赖于它的对象都将得到通知。在 JavaScript 开发中,我们一般用事件模型 来替代传统的发布—订阅模式
//[1]售楼处与买房者
var Event = (function() {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function(key, fn) {
        //订阅
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    trigger = function() {
        //发布
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    remove = function(key, fn) {
        //取消订阅
        var fns = clientList[key];
        if (!fns) {
            return false;
        }

        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    };
    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    };
})();

Event.listen('squareMeter88', fn1 = function(price) { // 小明订阅消息
    console.log('价格= ' + price);
});
Event.listen('squareMeter88', fn2 = function(price) { // 小红订阅消息
    console.log('价格= ' + price);
});
Event.remove('squareMeter88', fn1); // 删除小明的订阅
Event.trigger('squareMeter88', 2000000); // 输出:2000000
//[2]网站登录后初始化
var login = {
    clientList: [],
    listen: function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
    },
    trigger: function() {
        var key = Array.prototype.shift.call(arguments), // (1);
            fns = this.clientList[key];
        if (!fns || fns.length === 0) { // 如果没有绑定对应的消息
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments); // (2) // arguments 是 trigger 时带上的参数
        }
    }
};

var header = (function() { // header 模块
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(data) {
            console.log('设置 header 模块的头像');
        }
    };
})();

//
var nav = (function() { //nav 模块
    login.listen('loginSucc', function(data) {
        nav.setAvatar(data.avatar);
    });
    return {
        setAvatar: function(avatar) {
            console.log('设置 nav 模块的头像');
        }
    };
})();
var address = (function() { // nav 模块
    login.listen('loginSucc', function(obj) {
        address.refresh(obj);
    });
    return {
        refresh: function(avatar) {
            console.log('刷新收货地址列表');
        }
    };
})();
$.ajax('http:// xxx.com?login', function(data) { // 登录成功
    login.trigger('loginSucc', data); // 发布登录成功的消息
});
//3,模块间的通信
// <!DOCTYPE html>
// < html >
//     <body >
//       <button id = "count" > 点我 < /button> <div id="show"></div >
//     </body>
//     <script type = "text/JavaScript" >
var a = (function() {
    var count = 0;
    var button = document.getElementById('count');

    button.onclick = function() {
        Event.trigger('add', count++);
    };
})();
var b = (function() {
    var div = document.getElementById('show');
    Event.listen('add', function(count) {
        div.innerHTML = count;
    });
})();
// </script>
// </html >


//4,以上的都是先订阅后发布。还有全局变量的覆盖问题。下边解决类似qq离线信息提示和命名空间的事情
var Event = (function() {
    var global = this,
        Event,
        _default = 'default';

    Event = function() {
        var _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            each = function(ary, fn) {
                var ret;
                for (var i = 0, l = ary.length; i < l; i++) {

                    var n = ary[i];
                    ret = fn.call(n, i, n);
                }
                return ret;
            };
        _listen = function(key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function(key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (var i = cache[key].length; i >= 0; i--) {
                        if (cache[key][i] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key] = [];
                }
            }
        };

        _trigger = function() {
            var cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                ret, stack = cache[key];
            if (!stack || !stack.length) {
                return;
            }

            return each(stack, function() {
                return this.apply(_self, args);
            });
        };
        _create = function(vnamespace) {
            var namespace = vnamespace || _default;
            var cache = {},
                offlineStack = [],
                ret = {
                    listen: function(key, fn, last) {
                        _listen(key, fn, cache);
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === 'last') {
                            offlineStack.length && offlineStack.pop()();
                        } else {
                            each(offlineStack, function() {
                                this();
                            });
                        }
                        offlineStack = null;
                    },
                    one: function(key, fn, last) {
                        _remove(key, cache);
                        this.listen(key, fn, last);
                    },
                    remove: function(key, fn) {
                        _remove(key, cache, fn);
                    },
                    trigger: function() {
                        var fn, args,
                            _self = this;
                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function() {
                            return _trigger.apply(_self, args);
                        };
                        if (offlineStack) {
                            return offlineStack.push(fn);
                        }
                        return fn();
                    }
                };
            return namespace ?
                (namespaceCache[namespace] ? namespaceCache[namespace] :
                    namespaceCache[namespace] = ret) : ret;
        };
        return {
            create: _create,
            one: function(key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function(key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            listen: function(key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function() {
                var event = this.create();
                event.trigger.apply(this, arguments);
            }
        };
    }();
    return Event;
})();
//总结：缺点是会消耗一定时间和内存，所以好合理运用
//-----------------------------------------------
