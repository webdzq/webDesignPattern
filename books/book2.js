//javascript设计模式 张容铭著（2015.8出版）
-- -- -- -- -- -- -- -- -- -- -- - 第一章-- -- -- -- -- -- -- -- -- -- -- -- -
1， 函数的两种写法及区别
写法一：
function email() {

}

function phone() {

}
写法二：
var email = function() {

};
var phone = function() {

};
2, 对象的写法及区别
写法一：
var CheckObject = function() {

};
CheckObject.email = function() {
    console.log("email...");
};
CheckObject.phone = function() {
    console.log("phone...");
};
//测试
CheckObject.email();
写法二：（ 真假对象）
var CheckObject = function() {
    return {
        email: function() {
            console.log("email...");
        },
        phone: function() {
            console.log("phone...");
        }
    };
};
写法三：
var CheckObject = function() {
    this.email = function() {
        console.log("email...");
    };
    this.phone = function() {
        console.log("phone...");
    };
};
写法四：
var CheckObject = function() {

};
CheckObject.prototype.email = function() {
    console.log("email...");
};
CheckObject.prototype.phone = function() {
    console.log("phone...");
};
写法五：
var CheckObject = function() {

};
CheckObject.prototype = {
    Constructor: CheckObject,
    email: function() {
        console.log("email...");
    },
    phone: function() {
        console.log("phone...");
    }
};
//测试
var a = CheckObject();
a.email();
写法六： 链式调用
var CheckObject = function() {

};
CheckObject.prototype = {
    Constructor: CheckObject,
    email: function() {
        console.log("email...");
    },
    phone: function() {
        console.log("phone...");
    }
};
//测试
var a = CheckObject();
a.email().phone();
//3,函数方法拓展
方式一:
    Function.prototype.addMethod = function(name, fn) {
        this[name] = fn;
        return this;
    };
方式二:
    Function.prototype.addMethod = function(name, fn) {
        this.prototype[name] = fn;

    };
//示例
var methods = function() {};
methods.addMethod('email', function() {
    console.log("email...");
    return this;
}).addMethod('phone', function() {
    console.log("phone...");
    return this;
});
//方式一测试
methods.email().phone();
//方式二测试
var m = new methods();
m.email().phone();
课后练习：
1， 真假对象实现链式调用
var CheckObject = function() {
    return {
        email: function() {
            console.log("email...");
            return this;
        },
        phone: function() {
            console.log("phone...");
            return this;
        }
    };
};
var co = CheckObject();
co.email().phone();
2， 定义一个可以为函数添加多个方法的addMethod方法
Function.prototype.addMethod = function(obj) {
    for (var item in obj) {
        this.prototype[item] = obj[item];
    }
};
var Methods = function() {

};

Methods.addMethod({
    'email': function() {
        console.log("email...");
        return this;
    },
    'phone': function() {
        console.log("phone...");
        return this;
    }
});

var m = new Methods();
m.email().phone();
3， 定义一个既可以为函数原型也可以为自身添加方法的addMethod方法

Function.prototype.addMethod = function(obj) {

    for (var item in obj) {
        this[item] = obj[item];
        this.prototype[item] = obj[item];
    }


};
var Methods = function() {

};
Methods.addMethod({
    'email': function() {
        console.log("email...");
        return this;
    },
    'phone': function() {
        console.log("phone...");
        return this;
    }
});
Methods.email().phone();
var m = new Methods();
m.email().phone();
本章总结： 展示了函数和对象的「 灵活性」。
-- -- -- -- -- -- -- -- -- -- -- - 第二章-- -- -- -- -- -- -- -- -- -- -- -- -
1， 面向对象与面向过程。 未使用new使用函数的， 都是面向过程的。
私有： 外部无法访问到的。
公有： 通过this创建的方法和属性， new 创建后， 外部通过都可以访问到。
静态： 所有实例不可修改， 不可以访问。
共有： 所有实例共同拥有的。
构造器： 创建对象时调用的方法。 影响对象的传入参数的调整等。
特权方法： 可以访问到类的私有和共有属性和方法的方法。
静态属性：
静态方法：
共有属性：
共有方法：
注： 严格上只区分公有和私有。 其他命名是根据他们的特殊用途命名的。 并无严格的划分。
写法一：
var Book = function(id, name, price) {
    var num = 1; //私有属性
    function checkId() {
        //私有方法
    };
    this.id = id; //对象公有属性
    this.copy = function() {}; //对象公有方法

    this.setName = function(name) {}; //构造器
    this.setPrice = function(price) {}; //构造器

    this.getName = function() {}; //特权方法
    this.getPrice = function() {}; //特权方法

};
Book.isChinese = true; //静态属性，对象不能访问
Book.resetTime = function() {}; //静态方法，对象不能访问
Book.prototype = function() {
        isJsBook: true, //共有属性
        display: function() { //共有方法

        }
    }
    //测试
var book = new Book(11, 'javascript设计模式', 50);
console.log(book.num); //undefined
console.log(book.isJsBook); //true
console.log(book.id); //11
console.log(book.isChinese); //undefined
console.log(Book.isChinese); //true

写法二： 闭包实现（ 简言之： 函数里有函数） 特点: 可以使用被调用函数内的变量和方法并保留。
var Book = (function(id, name, price) {
    var bookNum = 0; //静态私有属性
    function checkBook(name) {
        //静态私有方法
    };
    //创建类
    function _book(newId, newName, newPrice) {
        var name, price; //私有变量
        function checkId() {
            //私有方法
        };
        this.id = id; //对象公有属性
        this.copy = function() {}; //对象公有方法

        this.setName = function(name) {}; //构造器
        this.setPrice = function(price) {}; //构造器

        this.getName = function() {}; //特权方法
        this.getPrice = function() {}; //特权方法
        bookNum++;
        if (bookNum > 100) {
            throw new Error('我们仅出版100本');
        }


    }
    _book.prototype = {
            isJsBook: true, //静态共有属性
            display: function() { //静态共有方法

            }
        }
        //返回类
    return _book;

})();
//类使用的安全模式:
var Book = function(title, time, type) {
    if (this instanceof Book) {
        this.title = title;
        this.time = time;
        this.type = type;
    } else {
        return new Book(title, time, type);
    }
}
var book = Book('javascript', 2016, 'js');
console.log(book);
console.log(book.title); //javascript
console.log(window.title); //undefined
建议； 类的创建， 尽量使用new 来操作。 按照规范来。
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2, 继承
2.1 类式继承： 子类的原型作为父类的实例。
特点：(1) 新创建的对象， 可以访问父类原型上的属性和方法， 也可以访问父类构造函数内的属性和方法;
(2) 新创建的对象的原型， 也可以访问父类原型上的属性和方法， 也可以访问父类构造函数内的属性和方法;
(3) 父类的属性和方法， 成为子类的共有属性和方法。 每个实例共有。(缺点)

function SuperClass() {
    this.superValue = true;
}
SuperClass.prototype.getSuperValue = function() {
    return this.superValue;
}

function SubClass() {
    this.subValue = false;
}
SubClass.prototype = new SuperClass(); //实现继承
SubClass.prototype.getSubValue = function() {
        return this.subValue;
    }
    //测试
var subcls = new SubClass();
console.log(subcls.getSuperValue()); //true
console.log(subcls.getSubValue()); //false
console.log(subcls instanceof SubClass); //true
console.log(subcls instanceof SuperClass); //true
console.log(SubClass instanceof SubClass); //false
console.log(SubClass.prototype instanceof SuperClass); //true
console.log(subcls instanceof Object); //true
2.2 构造函数继承： 在子类的构造函数环境中执行父类构造函数。
特点：(1) 在子类的构造函数中使用call函数实现继承， 继承了父类的共有属性;
(2) 父类的属性和方法， 每个子类的实例都不同;
(3) 新创建的对象， 不能继承父类原型的方法;
(缺点)

function SuperClass(id) {
    this.id = id; //值类型共有属性
    this.books = ['javascript', 'html', 'css']; //引用类型共有属性
}
SuperClass.prototype.showBooks = function() {
    console.log(this.books);
}

function SubClass() {
    SuperClass.call(this, id); //继承父类
}
//测试
var book1 = new SubClass(10);
var book2 = new SubClass(11);
book1.push('css3');
console.log(book1.books);
console.log(book1.id);
console.log(book2.books);
console.log(book2.id);
book1.showBooks(); //TypeError
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2.3 组合继承: 组合了类式继承和构造函数式继承

function SuperClass(name) {
    this.name = name; //值类型共有属性
    this.books = ['javascript', 'html', 'css']; //引用类型共有属性
}
SuperClass.prototype.getName = function() {
    console.log(this.name);
}

function SubClass(name, time) {
    SuperClass.call(this, name); //构造函数式继承父类
    this.time = time; //子类新增共用属性
}
SubClass.prototype = new SuperClass(); //类式继承
SubClass.prototype.getTime = function() {
        return this.time;
    }
    //测试
var book1 = new SubClass('jsbook', 2016);
var book2 = new SubClass('cssbook', 2017);
book1.books.push('css3');
console.log(book1.books);
console.log(book1.getName());
console.log(book1.getTime());
console.log(book2.books);
console.log(book2.getName());
console.log(book2.getTime());

-- - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2.4 原型式继承： 对类式继承的封装。 后来的Object.create() 方法;

function inheritObject(obj) {
    function F() {};
    F.prototype = obj;
    return new F();
}
-- - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2.5 寄生式继承
var book = {
    name: 'jsbook',
    alickbook: ['cssbook', 'htmlbook']
};

function creatBook(obj) {
    var o = inheritObject(obj);
    o.getName = function() { //添加新方法
        console.log(name)
    }
    return o;
}
-- - -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2.6 寄生组合式继承

function inheritPrototype(subClass, superClass) {
    //子类的原型继承了父类的原型，但么有执行父类的构造函数 ，且子类原来的原型被抛弃
    var p = inheritObject(superClass.prototype); //原型式继承
    p.constructor = subClass;
    subClass.prototype = p;
}

function SuperClass(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
SuperClass.prototype.getName = function() {
    console.log(this.name);
}

function SubClass(name, time) {
    SuperClass.call(this, name); //构造函数式继承
    this.time = time;
}
inheritPrototype(subClass, superClass); //实现继承
SubClass.prototype.getTime = function() {
        return this.time;
    }
    //测试
var book1 = new SubClass('jsbook', 2016);
var book2 = new SubClass('cssbook', 2017);

book1.colors.push('black');
console.log(book1.colors);
console.log(book1.getName());
console.log(book1.getTime());
console.log(book2.colors);
console.log(book2.getName());
console.log(book2.getTime());
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2.7 多继承： 复制的原理
Object.prototype.extend = function(target, source) {
    //单继承
    for (var porperty in source) {
        target[porperty] = source[porperty];
    }
    return target;
}
Object.prototype.mix = function() {
        //多继承
        var i = 1,
            len = arguments.length,
            target = arguments[0],
            arg;
        for (; i < len; i++) {
            arg = arguments[i];
            for (var property in arg) {
                target[property] = arg[property];
            }
        }
        return target;
    }
    //测试
var book = {
    name: 'js',
    alike: ['css', 'html']
}
var anthbook = {
    color: 'red'
}
var book2 = {
    type: 'web'
}
book.extend(book, anthbook);
console.log(book.color);
book.mix(book, book2, anthbook);
console.log(book);
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
2.8 多态

function add() {
    var len = arguments.length;
    switch (len) {
        case 0:
            return 10;
        case 1:
            return 10 + arguments[0];
        default:
            return 0;
    }
}
//测试
console.log(add());
console.log(add(1));
console.log(add(1, 2));
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
//课后练习
1， 深复制的实现

var deepCopy = function(source) {
    var result = {};
    for (var key in source) {
        //result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
        if (source[key] === 'object') {
            result[key] = deepCopy(source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}
var test1 = {
    name: 'js',
    colors: ['red', 'blue']
}

var test2 = deepCopy(test1);
console.log(test2);
test1.colors.push('green');
console.log(test1.colors, test2.colors);
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -
