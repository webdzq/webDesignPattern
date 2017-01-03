//javascript设计模式与开发实践  ---曾探（2015年出版）
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
//6,命令模式：指的是一个执行某些特定事情的指令。并不需要知道实现细节。如：单击事件处理。键盘操作,自动化测试，智能家居等。
//宏命令---一组命令的集合,批量执行
var MacroCommand = function() {
    return {
        commandsList: [],
        add: function(command) {
            this.commandsList.push(command);
        },
        execute: function() {
            for (var i = 0, command; command = this.commandsList[i++];) {
                command.execute();
            }
        }
    };
};

var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();
//-----------------------------------------------
//7，组合模式：
// 应用场合：
// [1]表示对象的部分-整体层次结构。组合模式可以方便地构造一棵树来表示对象的部分-整 体结构。
// 特别是我们在开发期间不确定这棵树到底存在多少层次的时候。
// 在树的构造最 终完成之后,只需要通过请求树的最顶层对象,便能对整棵树做统一的操作。
// 在组合模 式中增加和删除树的节点非常方便,并且符合开放封闭原则。
// [2]客户希望统一对待树中的所有对象。组合模式使客户可以忽略组合对象和叶对象的区别, 客户在面对这棵树的时候,
// 不用关心当前正在处理的对象是组合对象还是叶对象,也就 不用写一堆 if、else 语句来分别处理它们。
// 组合对象和叶对象会各自做自己正确的事情, 这是组合模式最重要的能力
//-----------------------------------------------
//应用举例：扫描文件夹
var File = function(name) {
    this.name = name;
    this.parent = null;
};
File.prototype.add = function() {
    throw new Error('不能添加在文件下面');
};
File.prototype.scan = function() {
    console.log('开始扫描文件: ' + this.name);
};
File.prototype.remove = function() {
    if (!this.parent) { //根节点或者树外的游离节点
        return;
    }
    for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};

var folder = new Folder('学习资料');
var folder1 = new Folder('JavaScript');
var file1 = new Folder('深入浅出 Node.js');

folder1.add(new File('JavaScript 设计模式与开发实践'));
folder.add(folder1);
folder.add(file1);
folder1.remove(); //移除文件夹 folder.scan();
//-----------------------------------------------
//8，模板方法模式：是一种典型的通过封装变化提高系统扩展性的设计模式。以泡咖啡和茶为例。如下四步：
// (1) 把水煮沸
// (2) 用沸水冲泡饮料
// (3) 把饮料倒进杯子
// (4) 加调料
//--------------------------------
//【1】java实现：
// Java 代码
public abstract class Beverage { // 饮料抽象类

    // 模板方法
    // 具体方法 boilWater

    final void init() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }
    void boilWater() {
        System.out.println("把水煮沸");
    }
    abstract void brew(); // 抽象方法 brew
    abstract void addCondiments(); // 抽象方法 addCondiments
    abstract void pourInCup(); // 抽象方法 pourInCup
}

public class Coffee extends Beverage { // Coffee 类 @Override
    void brew() { // 子类中重写 brew 方法
        System.out.println("用沸水冲泡咖啡");
    }
    @Override
    void pourInCup() { // 子类中重写 pourInCup 方法
        System.out.println("把咖啡倒进杯子");
    }
    @Override
    void addCondiments() { // 子类中重写 addCondiments 方法
        System.out.println("加糖和牛奶");
    }
}
public class Tea extends Beverage { // Tea 类 @Override
    void brew() { // 子类中重写 brew 方法
        System.out.println("用沸水浸泡茶叶");
    }
    @Override

    void pourInCup() { // 子类中重写 pourInCup 方法
        System.out.println("把茶倒进杯子");
    }
    @Override
    void addCondiments() { // 子类中重写 addCondiments 方法
        System.out.println("加柠檬");
    }
}
public class Test {
    private static void prepareRecipe(Beverage beverage) {
        beverage.init();
    }
    public static void main(String args[]) {
        Beverage coffee = new Coffee(); // 创建 coffee 对象
        prepareRecipe(coffee); // 把水煮沸
        // 用沸水冲泡咖啡
        // 把咖啡倒进杯子
        // 加糖和牛奶
        Beverage tea = new Tea();
        prepareRecipe(tea); // 把水煮沸
        // 用沸水浸泡茶叶
        // 把茶倒进杯子
        // 加柠檬
    }
}
//[2]javascript实现：
var Beverage = function(param) {
    var boilWater = function() {
        console.log('把水煮沸');
    };

    var brew = param.brew || function() {

        throw new Error('必须传递 brew 方法');
    };
    var pourInCup = param.pourInCup || function() {
        throw new Error('必须传递 pourInCup 方法');
    };
    var addCondiments = param.addCondiments || function() {
        throw new Error('必须传递 addCondiments 方法');
    };
    var F = function() {};
    F.prototype.init = function() {
        boilWater();

        brew();
        pourInCup();
        addCondiments();
    };
    return F;
};
var Coffee = Beverage({
    brew: function() {
        console.log('用沸水冲泡咖啡');
    },
    pourInCup: function() {
        console.log('把咖啡倒进杯子');
    },
    addCondiments: function() {
        console.log('加糖和牛奶');
    }
});

var Tea = Beverage({
    brew: function() {
        console.log('用沸水浸泡茶叶');
    },
    pourInCup: function() {
        console.log('把茶倒进杯子');
    },
    addCondiments: function() {
        console.log('加柠檬');
    }
});
var coffee = new Coffee();
coffee.init();
var tea = new Tea();
tea.init();
//-----------------------------------------------
// 9，享元模式：运用共享技术来有效支持大量细粒度的对象。
// brif：为解决性能问题而生的模式,这跟大部分模式的诞生原因都不一样。在一个存在
// 大量相似对象的系统中,享元模式可以很好地解决大量对象带来的性能问题。

//通用对象池实现
var objectPoolFactory = function(createObjFn) {
    var objectPool = [];
    return {
        create: function() {
            var obj = objectPool.length === 0 ?
                createObjFn.apply(this, arguments) : objectPool.shift();
            return obj;
        },
        recover: function(obj) {
            objectPool.push(obj);

        }
    };
};
//现在利用 objectPoolFactory 来创建一个装载一些 iframe 的对象池:
var iframeFactory = objectPoolFactory(function() {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.onload = function() {
        iframe.onload = null; // 防止 iframe 重复加载的 bug

        iframeFactory.recover(iframe);
        return iframe;
    }
});
var iframe1 = iframeFactory.create();
iframe1.src = 'http:// baidu.com';
var iframe2 = iframeFactory.create();
iframe2.src = 'http:// QQ.com';
setTimeout(function() {
    var iframe3 = iframeFactory.create();
    iframe3.src = 'http:// 163.com';
}, 3000);
//总结：关键词：大量相似对象  共享
//-----------------------------------------------
// 9,职责链模式：使多个对象都有机会处理，从而避免请求的发送者和接收者之间的耦合关系,
// 这些对象连成一链，并沿着这条链传递该请求，直到有一个对象处理它为止。很像[击鼓传花]一样.
//现实中常用于抢购的环节。下边就是一个例子：
// 如某米手机的抢购。 付500定金的用户， 优先抢并返100优惠券， 付200定金的用户， 优先抢并返10优惠券。
// 其他是普通用户， 库存有限的情况下可能抢不到。
//示例代码
var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500元定金预购，得到100元优惠券');
    } else {
        return 'nextSuccessor'; //向下传递
    }
};
var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200元定金预购，得到10元优惠券');
    } else {
        return 'nextSuccessor'; //向下传递                      }
    };
}
var orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，无优惠券');
    } else {
        console.log('手机库存不足');
    }
};
Function.prototype.after = function(fn) {
    var self = this;
    return function() {
        var ret = self.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }
        return ret;
    }
};
var order = order500yuan.after(order200yuan).after(orderNormal);

order(1, true, 500); //500 付定金
order(2, true, 500); //200付定金
order(1, false, 500); //普通购买
//应用场景2：兼容性处理：比如文件上传，ie，flash，h5的上传
var getActiveUploadObj = function() {
    try { // IE
        return new ActiveXObject("TXFTNActiveX.FTNUpload");
    } catch (e) {
        return 'nextSuccessor';
    }
};
var getFlashUploadObj = function() {
    if (supportFlash()) {
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return 'nextSuccessor';
};
var getFormUpladObj = function() {
    return $('<form><input name="file" type="file"/></form>').appendTo($('body'));
};
var getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUpladObj);
console.log(getUploadObj());
//总结：优点：松耦合，顺序可调。缺点;链条太长很消耗性能，合理搭配优先级。
//-----------------------------------------------
//10，中介者模式：
//中介者模式的作用 是解除对象与对象之间的紧耦合关系。 如链家房产中介， 机场塔台， 博彩公司等。
//泡泡堂游戏
var playerDirector = (function() {
    var players = {}, //保存所有玩家
        operations = {}; //中介者可以执行的操作
    /****************新增一个玩家 ***************************/
    operations.addPlayer = function(player) {
        var teamColor = player.teamColor; //玩家的队伍颜色
        players[teamColor] = players[teamColor] || []; //组建队伍
        players[teamColor].push(player); //添加玩家队伍
    };
    /****************移除一个玩家***************************/
    operations.removePlayer = function(player) {
        var teamColor = player.teamColor, //玩家队伍颜色
            teamPlayers = players[teamColor] || []; //该队伍所有成员
        for (var i = teamPlayers.length - 1; i >= 0; i--) { //遍历删除
            if (teamPlayers[i] === player) {
                teamPlayers.splice(i, 1);
            }
        }
    };
    /****************玩家换队***************************/
    operations.changeTeam = function(player, newTeamColor) { //
        operations.removePlayer(player); //  从原队伍中删除
        player.teamColor = newTeamColor; //  改变队伍颜色
        operations.addPlayer(player); //加入新队伍

    };
    operations.playerDead = function(player) { //玩家死亡
        var teamColor = player.teamColor,
            teamPlayers = players[teamColor];
        var all_dead = true;

        for (var i = 0, player; player = teamPlayers[i++];) {
            if (player.state !== 'dead') {
                all_dead = false;
                break;
            }
        }
        if (all_dead === true) { //全部阵亡
            //
            for (var i = 0, player; player = teamPlayers[i++];) {
                player.lose(); //本队所有玩家lose
            }
            for (var color in players) {
                if (color !== teamColor) {
                    varteamPlayers = players[color]; //其他队伍玩家
                    for (var i = 0, player; player = teamPlayers[i++];) {

                        player.win(); //       其他队伍玩家 win
                    }
                }
            }
        }
    };

    var reciveMessage = function() {
        varmessage = Array.prototype.shift.call(arguments); //arguments
        operations[message].apply(this, arguments);
    };
    return {
        reciveMessage: reciveMessage
    }
})();
//
var player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('卡尔', 'red'),
    player3 = playerFactory('丽塔', 'red'),
    player4 = playerFactory('斯文', 'red');
//
var player5 = playerFactory('毒龙', 'blue'),
    player6 = playerFactory('小黑', 'blue'),
    player7 = playerFactory('风行', 'blue'),
    player8 = playerFactory('白牛', 'blue');
player1.die();
player2.die();
player3.die();
player4.die();
//假如1，2掉线：
player1.remove();
player2.remove();
player3.die();
player4.die();
//加入player1换队：
player1.changeTeam('blue');
player2.die();
player3.die();
player4.die();
//-----------------------------------------------
//11，装饰者模式(decorator)：动态给对象添加职责的方式.如：游戏中的玩家随着等级变化，技能增加和升级。
function Player(name) {
    this.grade = 0;
    this.name = name;
}
Player.prototype = {
    Constructor: Player,
    setGrade: function(grade) {
        this.grade = grade;
    },
    getGrade: function() {
        return this.grade;
    },
    fire: function() {
        console.log(this.name + ',可以发射普通子弹');
    },
    missileDecorator: function() {
        console.log(this.name + ',可以发射导弹');
    },
    getDecorator: function() {

        this.fire();
        if (this.grade > 5) {
            this.missileDecorator();
        }
    }
}
var player1 = new Player('tom');
var player2 = new Player('john');

player1.setGrade(4);
player2.setGrade(8);

player1.getDecorator();
player2.getDecorator();
//上边这种方式扩展性不是很好。添加的技能很多的时候，ifelse会很多。如下：
function Player(name) {
    //this.grade = 0;
    this.name = name;
    this.list = [];
}
Player.prototype = {
    Constructor: Player,
    setDecorator: function() {
        for (var i in arguments) {
            var item = arguments[i];
            //console.log("item=",item);
            this.list.push(item);
        }
    },
    getDecorator: function() {
        //console.log(this.list);
        for (var i in this.list) {
            var itemfn = this.list[i];
            //console.log("itemfn=",itemfn);
            itemfn.apply(this);
        }
    }
}
var player1 = new Player('tom');
var player2 = new Player('john');
var fire = function(name) {
    console.log(this.name + ',可以发射普通子弹');
}
var missileDecorator = function() {
    console.log(this.name + ',可以发射导弹');
}
player1.setDecorator(fire);
player2.setDecorator(fire, missileDecorator);

player1.getDecorator();
player2.getDecorator();
//-----------------------------------------------
//12,状态模式：最熟悉的ajax，promise，游戏角色等状态。合理的方式控制状态的转变，带来的行为的变化。
//使用状态工厂
window.external.upload = function(state) {
    console.log(state); //     sign uploading done error
};
var plugin = (function() {
    var plugin = document.createElement('embed');
    plugin.style.display = 'none';
    plugin.type = 'application/txftn-webkit';
    plugin.sign = function() {
        console.log('开始文件扫描');
    }
    plugin.pause = function() {
        console.log('暂停文件上传');
    };
    7
    plugin.uploading = function() {
        console.log('开始文件上传');
    };
    plugin.del = function() {
        console.log('删除文件上传');
    }

    plugin.done = function() {
        console.log('文件上传完成');
    }
    document.body.appendChild(plugin);
    return plugin;
})();
var Upload = function(fileName) {
    this.plugin = plugin;
    this.fileName = fileName;
    this.button1 = null;
    this.button2 = null;
    this.signState = new SignState(this); // 设置初始状态waiting
    this.uploadingState = new UploadingState(this);

    this.pauseState = new PauseState(this);
    this.doneState = new DoneState(this);
    this.errorState = new ErrorState(this);
    this.currState = this.signState; // 设置当前状态
};
Upload.prototype.init = function() {
    var that = this;
    this.dom = document.createElement('div');
    this.dom.innerHTML =
        '<span>    :' + this.fileName + '</span>\ <button data-action="button1">   </button>\ <button data-action="button2">  </button>';
    document.body.appendChild(this.dom);
    this.button1 = this.dom.querySelector('[data-action="button1"]');
    this.button2 = this.dom.querySelector('[data-action="button2"]');
    this.bindEvent();
};
Upload.prototype.bindEvent = function() {
    var self = this;
    this.button1.onclick = function() {
        self.currState.clickHandler1();
    }
    this.button2.onclick = function() {
        self.currState.clickHandler2();
    }
};
var StateFactory = (function() {
    var State = function() {};
    State.prototype.clickHandler1 = function() {
        throw new Error('子类需要重写clickHandler1');
    }
    State.prototype.clickHandler2 = function() {
        throw new Error('子类需要重写clickHandler2');
    }
    return function(param) {
        var F = function(uploadObj) {
            this.uploadObj = uploadObj;
        };
        F.prototype = new State();
        for (var i in param) {
            F.prototype[i] = param[i];
        }
        return F;
    }
})();
var SignState = StateFactory({
    clickHandler1: function() {
        console.log('扫描中，点击无效...');
    },
    clickHandler2: function() {
        console.log('文件上传中，不能删除');
    }
});
var UploadingState = StateFactory({
    clickHandler1: function() {
        this.uploadObj.pause();
    },
    clickHandler2: function() {
        console.log('文件上传中，不能删除');
    }
});
var PauseState = StateFactory({
    clickHandler1: function() {
        this.uploadObj.uploading();
    },
    clickHandler2: function() {
        this.uploadObj.del();
    }
});
var DoneState = StateFactory({
    clickHandler1: function() {
        console.log('文件已经上传完毕，点击无效');
    },
    clickHandler2: function() {
        this.uploadObj.del();
    }
});
var ErrorState = StateFactory({
    clickHandler1: function() {
        console.log(' 文件上传失败，点击无效');
    },
    clickHandler2: function() {
        this.uploadObj.del();
    }
});
//测试
var uploadObj = new Upload('JavaScript设计模式与开发实践');
uploadObj.init();
window.external.upload = function(state) {
    uploadObj[state]();
};
window.external.upload('sign');
setTimeout(function() {
    window.external.upload('uploading');
}, 1000);
setTimeout(function() {
    window.external.upload('done');
}, 5000);

//-----------------------------------------------
// 13，适配器模式：
//    模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后,原本由于接口不兼容而不能工作的两个软件实体可以一起工作。
//    如：跨公司，跨部门的合作等。
var googleMap = {
    show: function() {
        console.log('渲染谷歌地图');
    }
};
var baiduMap = {
    display: function() {
        console.log('渲染百度地图');
    }
};
var baiduMapAdapter = {
    show: function() {
        return baiduMap.display();
    }
};
renderMap(googleMap);//渲染谷歌地图
renderMap(baiduMapAdapter);//渲染百度地图

//-----------------------------------------------
//设计原则和编程技巧
//-----------------------------------------------
单一职责原则（SRP）:一个对象（方法）只做一件事情。
优点：有助于代码的复用，利于单元测试。缺点：增加代码复杂度，不利于对象之间联系
-------------------------------
最少知识原则（LKP）：也叫迪米特法则。是一个软件实体应当尽可能少地与其他实体发生相互作用。简言之：隐藏细节，
缩短作用链。如自动洗衣机，自动测试等
-------------------------------
开放-封闭的原则（OCP）：软件实体（类，模块，函数）等应该是可以扩展的，但是不可修改的。
--------------------------------
里氏替换原则（LSP）:任何基类可以出现的地方，子类一定可以出现。 LSP是继承复用的基石，只有当衍生类可以替换掉基类，
软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。
---------------------------------
依赖倒置原则（DIP）:
A.高层次的模块不应该依赖于低层次的模块，他们都应该依赖于抽象。
B.抽象不应该依赖于具体实现，具体实现应该依赖于抽象。
---------------------------------
接口隔离原则（ISP）:客户端不应该依赖它不需要的接口；一个类对另一个类的依赖应该建立在最小的接口上

//-----------------------------------------------
总结：书里并不是完全正确的，但是有很多技巧和领悟。多读书总是有好处的，可以开拓视野，开发思维，得到大彻大悟的智慧！
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
