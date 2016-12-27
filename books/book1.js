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
//策略模式
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
calculateBonus(S, 10000);// 输出:40000
