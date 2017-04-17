/**
 * @bookname: 学习JavaScript设计模式
 * @author :©Addy Osmani 2015。
 * @link:https://addyosmani.com/resources/essentialjsdesignpatterns/book/
 * @desc:设计模式是软件设计中常见问题的可重复使用的解决方案.可以用任何编程语言进行探索。
 *       设计模式还为我们提供了一个常见的词汇来描述解决方案。就像我们的成语一样，见名知意。
 * 当我们尝试传达一种将代码形式的解决方案构造到其他人的方法时，这可能比描述语法和语义要简单得多。
 * 
 * 类别及分类：
 * 创建设计模式：基于创建对象的概念。侧重于处理对象创建机制，旨在通过控制创建过程。以适合我们正在工作情况的方式创建对象，如：
 *              构造函数，工厂，抽象，原型，单例和建造者模式。
 * 
 * 工厂模式(Factory):这是基于接口数据或事件的几个派生类的实例。
 * 抽象工厂(Abstract Factory):创建几个类的实例，而不需要详细说明具体的类。
 * 建造者(Builder)： 将对象构造与其表示分开，始终创建相同类型的对象。
 * 原型(Prototype):	用于复制或克隆的方式完全初始化的实例。
 * 单例(Singleton)：一个只有一个具有全局接入点的实例的类。
 * 
 * 
 * 
 * 结构设计模式：基于构建对象块的思想。涉及对象组合，通常识别实现不同对象之间关系的简单方法。有助于确保系统的一部分更改时，系统的整个结构不受影响。
 *             还协助将不符合特定目的的系统的部分重新整理。如：装饰器，外观（facade），Flyweight，适配器和代理。
 * 
 * 适配器(Adapter)：匹配不同类的接口，因此，尽管不兼容的接口，类可以一起工作。
 * 桥接模式(Bridge)：将对象的接口与其实现分开，以便两者可以独立变化。
 * 综合模式(Composite)：简单和复合对象的结构，使得对象的总体不仅仅是其部分的总和。
 * 装饰者(Decorator)：	 动态添加对象的替代处理。
 * 外观模式(Facade)：一个隐藏整个子系统的复杂性的类。
 * 享元模式(Flyweight)：	一个细粒度的实例用于高效地共享其他地方所包含的信息
 * 
 * 
 * 行为设计模式：基于对象的玩法和工作方式。侧重于改进或简化系统中不同对象之间的通信。如：迭代器，中介者（Mediator），观察者和访问者。
 * 
 * 解释器(Interpreter):在应用程序中包含语言元素以匹配预期语言语法的方法.
 * 模板(Template):在方法中创建算法的shell，然后将确切的步骤推迟到一个子类。
 * 职责链(Chain of Responsibility):在一个对象链之间传递请求以找到可以处理请求的对象的一种方法
 * 命令(Command):	将命令请求封装为启用，记录和/或排队请求的对象，并为未处理的请求提供错误处理。
 * 迭代器(Iterator): 在不知道集合的内部工作原理的情况下，顺序访问集合的元素。
 * 中介者(Mediator): 定义类之间的简化通信，以防止一组类明确地相互引用。
 * 备忘录模式(Memento):捕获对象的内部状态，以便以后恢复。
 * 观察者(Observer):通知一些类的更改以确保类之间的一致性的方式。
 * 状态模式(state):当状态发生变化时，改变对象的行为。
 * 策略模式(Strategy):将算法封装在将选择与实现分离的类中。
 * 访问者模式(Visitor):在类中添加新操作，而无需更改类。
 * 
 * 
 */

/**
 * 1,构造器模式(Constructor Pattern)
 * @bref:对象构造函数用于创建特定类型的对象，包括准备要使用的对象和接受构造函数可用于设置对象首次创建时的成员属性和方法的值的参数
 * 
 */

/**------------------1,对象创建--------------------------*/

var newObject = {};

// or
var newObject = Object.create(Object.prototype);

// or
var newObject = new Object();

/**------------------2,对象添加属性的四种方式：--------------------------*/
// Set properties
newObject.someKey = "Hello World";

// Get properties
var value = newObject.someKey;

// 2. Square bracket syntax

// Set properties
newObject["someKey"] = "Hello World";

// Get properties
var value = newObject["someKey"];


// ECMAScript 5 only compatible approaches
// For more information see: http://kangax.github.com/es5-compat-table/

// 3. Object.defineProperty

// Set properties
Object.defineProperty(newObject, "someKey", {
    value: "for more control of the property's behavior",
    writable: true,
    enumerable: true,
    configurable: true
});

// If the above feels a little difficult to read, a short-hand could
// be written as follows:

var defineProp = function(obj, key, value) {
    var config = {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
    };
    Object.defineProperty(obj, key, config);
};

// To use, we then create a new empty "person" object
var person = Object.create(Object.prototype);

// Populate the object with properties
defineProp(person, "car", "Delorean");
defineProp(person, "dateOfBirth", "1981");
defineProp(person, "hasBeard", false);

console.log(person);
// Outputs: Object {car: "Delorean", dateOfBirth: "1981", hasBeard: false}


// 4. Object.defineProperties

// Set properties
Object.defineProperties(newObject, {

    "someKey": {
        value: "Hello World",
        writable: true
    },

    "anotherKey": {
        value: "Foo bar",
        writable: false
    }

});

/**------------------3,基本构造函数--------------------------*/


function Car(model, year, miles) {

    this.model = model;
    this.year = year;
    this.miles = miles;

    this.toString = function() {
        return this.model + " has done " + this.miles + " miles";
    };
}

// Usage:

// We can create new instances of the car
var civic = new Car("Honda Civic", 2009, 20000);
var mondeo = new Car("Ford Mondeo", 2010, 5000);

/**------------------4,具有原型的构造函数--------------------------*/
function Car(model, year, miles) {

    this.model = model;
    this.year = year;
    this.miles = miles;

}


// Note here that we are using Object.prototype.newMethod rather than
// Object.prototype so as to avoid redefining the prototype object
Car.prototype.toString = function() {
    return this.model + " has done " + this.miles + " miles";
};

// Usage:

var civic = new Car("Honda Civic", 2009, 20000);
var mondeo = new Car("Ford Mondeo", 2010, 5000);

console.log(civic.toString());
console.log(mondeo.toString());
/**------------------5,模块模式--------------------------
模块是任何强大的应用程序架构的一个组成部分，通常有助于保持项目的代码单元完全分离和组织。
在JavaScript中，模块模式用于进一步模拟类的概念，使得我们能够在单个对象中包含公共/私有方法和变量，从而将特定部分与全局范围进行屏蔽。
这导致的是减少我们的函数名称与页面上其他脚本中定义的其他函数冲突的可能性。

在JavaScript中，有几个实现模块的选项。这些包括：

    模块模式
    对象字面符号
    AMD模块
    CommonJS模块
    ECMAScript Harmony模块
*/

/**------------------对象字面量--------------------------*/
var myModule = {

    myProperty: "someValue",

    // object literals can contain properties and methods.
    // e.g we can define a further object for module configuration:
    myConfig: {
        useCaching: true,
        language: "en"
    },

    // a very basic method
    saySomething: function() {
        console.log("Where in the world is Paul Irish today?");
    },

    // output a value based on the current configuration
    reportMyConfig: function() {
        console.log("Caching is: " + (this.myConfig.useCaching ? "enabled" : "disabled"));
    },

    // override the current configuration
    updateMyConfig: function(newConfig) {

        if (typeof newConfig === "object") {
            this.myConfig = newConfig;
            console.log(this.myConfig.language);
        }
    }
};

// Outputs: Where in the world is Paul Irish today?
myModule.saySomething();

// Outputs: Caching is: enabled
myModule.reportMyConfig();

// Outputs: fr
myModule.updateMyConfig({
    language: "fr",
    useCaching: false
});

// Outputs: Caching is: disabled
myModule.reportMyConfig();
/**------------------模块模式--------------------------*/

var myRevealingModule = (function() {

    var privateCounter = 0;

    function privateFunction() {
        privateCounter++;
    }

    function publicFunction() {
        publicIncrement();
    }

    function publicIncrement() {
        privateFunction();
    }

    function publicGetCount() {
        return privateCounter;
    }

    function mixins(jQ, _) {
        function privateMethod1() {
            jQ(".container").html("test");
            privateMethod2();
        }

        function privateMethod2() {
            console.log(_.min([10, 5, 100, 2, 1000]));
        }

        return {
            publicMethod: function() {
                privateMethod1();
            }
        };
    }
    // Reveal public pointers to
    // private functions and properties

    return {
        start: publicFunction,
        increment: publicIncrement,
        count: publicGetCount,
        mixins: mixins()
    };

})();

myRevealingModule.start();


/**
 * 2,单例模式(Singleton Pattern)
 * @bref:通过创建一个类来实现，该方法可以创建类的新实例（如果不存在）。
 * 在一个实例已经存在的情况下，它只是返回一个对该对象的引用。
 * 在JavaScript中，Singletons作为一个共享资源命名空间，将实现代码与全局命名空间隔离开，以便为函数提供单一访问点。
 * 
 */


var mySingleton = (function() {

    // Instance stores a reference to the Singleton
    var instance;

    function init() {

        // Singleton

        // Private methods and variables
        function privateMethod() {
            console.log("I am private");
        }

        var privateVariable = "Im also private";

        var privateRandomNumber = Math.random();

        return {

            // Public methods and variables
            publicMethod: function() {
                console.log("The public can see me!");
            },

            publicProperty: "I am also public",

            getRandomNumber: function() {
                return privateRandomNumber;
            }

        };

    };

    return {

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function() {

            if (!instance) {
                instance = init();
            }

            return instance;
        }

    };

})();

var myBadSingleton = (function() { //假单例，

    // Instance stores a reference to the Singleton
    var instance;

    function init() {

        // Singleton

        var privateRandomNumber = Math.random();

        return {

            getRandomNumber: function() {
                return privateRandomNumber;
            }

        };

    };

    return {

        // Always create a new Singleton instance
        getInstance: function() {

            instance = init();

            return instance;
        }

    };

})();


// Usage:

var singleA = mySingleton.getInstance();
var singleB = mySingleton.getInstance();
console.log(singleA.getRandomNumber() === singleB.getRandomNumber()); // true

var badSingleA = myBadSingleton.getInstance();
var badSingleB = myBadSingleton.getInstance();
console.log(badSingleA.getRandomNumber() !== badSingleB.getRandomNumber()); // true

// Note: 内部变量privateRandomNumber值不同。

/**
 * 2,观察者模式(Singleton Pattern)
 * @bref:一个或多个观察者对一个主体的状态感兴趣，并通过附加自己来注册他们对该主题的兴趣，当观察者可能感兴趣的主题发生变化时，
 * 会发送一个通知消息，调用每个更新方法观察者，当观察者对主体的状态不再感兴趣时，他们可以简单地分离自己。
 * 示例是订阅者添加了两个观察对象。
 */
//观察者
function ObserverList() {
    this.observerList = [];
}

ObserverList.prototype.add = function(obj) {
    return this.observerList.push(obj);
};

ObserverList.prototype.count = function() {
    return this.observerList.length;
};

ObserverList.prototype.get = function(index) {
    if (index > -1 && index < this.observerList.length) {
        return this.observerList[index];
    }
};

ObserverList.prototype.indexOf = function(obj, startIndex) {
    var i = startIndex;

    while (i < this.observerList.length) {
        if (this.observerList[i] === obj) {
            return i;
        }
        i++;
    }

    return -1;
};

ObserverList.prototype.removeAt = function(index) {
    this.observerList.splice(index, 1);
};
//观察者
function Observer() {
    this.name = "Observer";
    this.setName = function(name) {
        this.name = name;
    }
    this.getName = function() {
        return this.name;
    }
    this.update = function(context) { //获取更新

        console.log(context + ' Observer: ' + this.name);
    };
}
//订阅者
function Subject() {
    this.observers = new ObserverList();
}

Subject.prototype.addObserver = function(observer) {
    this.observers.add(observer);
};

Subject.prototype.removeObserver = function(observer) {
    this.observers.removeAt(this.observers.indexOf(observer, 0));
};

Subject.prototype.notify = function(context) { //通知观察者有更新
    var observerCount = this.observers.count();
    for (var i = 0; i < observerCount; i++) {
        this.observers.get(i).update(context);
    }
};

//测试
var sub1 = new Subject();

var obs1 = new Observer();
obs1.setName('sub1');
var obs2 = new Observer();
obs2.setName('sub2');
sub1.addObserver(obs1);
sub1.addObserver(obs2);
sub1.notify('查看了');

sub1.removeObserver(obs2);
sub1.notify('访问了');



/**
 * 2.2 发布订阅模式
 * 通过单个对象引导多个事件源的方法，常用于事件触发系统
 * 如：backbone，listenjs等的事件广播系统。
 */
var pubsub = {};

(function(myObject) {
    var topics = {};
    var subUid = -1;

    myObject.publish = function(topic, args) { //发布

        if (!topics[topic]) {
            return false;
        }

        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;

        while (len--) {
            subscribers[len].func(topic, args);
        }

        return this;
    };

    myObject.subscribe = function(topic, func) { //订阅

        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };

    myObject.unsubscribe = function(token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return this;
    };
}(pubsub));

//测试
var messageLogger = function(topics, data) {
    console.log("Logging: " + topics + ": " + data);
};

var subscription = pubsub.subscribe("inbox/newMessage", messageLogger);

pubsub.publish("inbox/newMessage", "hello world!");

// or
pubsub.publish("inbox/newMessage", ["test", "a", "b", "c"]);

// or
pubsub.publish("inbox/newMessage", {
    sender: "hello@google.com",
    body: "Hey again!"
});

pubsub.unsubscribe(subscription);

pubsub.publish("inbox/newMessage", "Hello! are you still there?");

/**
 * 3,中介者模式( Mediator Pattern)
 * @bref:中介者是协调多个对象之间的交互（逻辑和行为）的对象。它根据其他对象和输入的动作（或不作为）来决定何时调用哪些对象。
 * 如：机场的塔台。机场交通管制系统。塔（调解员）处理什么飞机可以起飞和着陆，因为所有通信（正在收听或广播的通知）
 *  都是从飞机到控制塔而不是从飞机到飞机完成的。中央控制器是该系统成功的关键。
 * 
 * 
 */
//  menuItem.js
var MenuItem = MyFrameworkView.extend({

    events: {
        "click .thatThing": "clickedIt"
    },

    clickedIt: function(e) {
        e.preventDefault();

        // assume this triggers "menu:click:foo"
        MyFramework.trigger("menu:click:" + this.model.get("name"));
    }

});

//  myWorkflow.js
var MyWorkflow = function() {
    MyFramework.on("menu:click:foo", this.doStuff, this);
};

MyWorkflow.prototype.doStuff = function() {
    // instantiate multiple objects here.
    // set up event handlers for those objects.
    // coordinate all of the objects into a meaningful workflow.
};


/**
 * 4,原型模式( Prototype Pattern)
 * @bref:通过克隆的现有对象的模板创建对象的模式。可以将原型模式看作是基于原型继承，我们创建对象作为其他对象的原型。
 * 
 * 
 */
var vehicle = {
    getModel: function() {
        console.log("The model of this vehicle is.." + this.model);
    }
};

var car = Object.create(vehicle, {

    "id": {
        value: MY_GLOBAL.nextId(),
        // writable:false, configurable:false by default
        enumerable: true
    },

    "model": {
        value: "Ford",
        enumerable: true
    }

});

//或者：
var beget = (function() {

    function F() {}

    return function(proto) {
        F.prototype = proto;
        return new F();
    };
})();

/**
 * 5,命令模式( Command Pattern)
 * @bref:命令模式旨在将方法调用，请求或操作封装到单个对象中，并使我们能够对我们自行执行的方法调用进行参数化和传递。
 * 
 * 
 */
var carManager = (function() {

    var carManager = {

        // request information
        requestInfo: function(model, id) {
            return "The information for " + model + " with ID " + id + " is foobar";
        },

        // purchase the car
        buyVehicle: function(model, id) {
            return "You have successfully purchased Item " + id + ", a " + model;
        },

        // arrange a viewing
        arrangeViewing: function(model, id) {
            return "You have successfully booked a viewing of " + model + " ( " + id + " ) ";
        },
        execute: function(name) {
            return carManager[name] && carManager[name].apply(carManager, [].slice.call(arguments, 1));
        }

    };

    return {
        execute: carManager.execute
    }
})();
//测试
carManager.execute("arrangeViewing", "Ferrari", "14523");
carManager.execute("requestInfo", "Ford Mondeo", "54323");
carManager.execute("requestInfo", "Ford Escort", "34232");
carManager.execute("buyVehicle", "Ford Escort", "34232");
/**
 * 6,外观模式( Facade Pattern)
 * @bref:这种模式为更大的代码体系提供了一个方便的更高级别的界面，隐藏了其真正的底层复杂性。
 * 认为它是简化向其他开发人员呈现的API，大多数情况下总是提高可用性。
 * 如：jquery，vuejs等库和框架。
 * 
 */
//浏览器事件兼容方案
var addMyEvent = function(el, ev, fn) {

    if (el.addEventListener) {
        el.addEventListener(ev, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + ev, fn);
    } else {
        el["on" + ev] = fn;
    }

};

//包括私有行为
var module = (function() {

    var _private = {
        i: 5,
        get: function() {
            console.log("current value:" + this.i);
        },
        set: function(val) {
            this.i = val;
        },
        run: function() {
            console.log("running");
        },
        jump: function() {
            console.log("jumping");
        }
    };

    return {

        facade: function(args) {
            _private.set(args.val);
            _private.get();
            if (args.run) {
                _private.run();
            }
        }
    };
}());


// Outputs: "current value: 10" and "running"
module.facade({ run: true, val: 10 });




/**
 * 7,工厂模式(Factory Pattern)
 * @bref:工厂可以提供用于创建对象的通用接口，我们可以在此指定要创建的工厂对象的类型。
 * 
 * 
 */
// Types.js - Constructors used behind the scenes

// A constructor for defining new cars
function Car(options) {

    // some defaults
    this.doors = options.doors || 4;
    this.state = options.state || "brand new";
    this.color = options.color || "silver";

}

// A constructor for defining new trucks
function Truck(options) {

    this.state = options.state || "used";
    this.wheelSize = options.wheelSize || "large";
    this.color = options.color || "blue";
}


// FactoryExample.js

// Define a skeleton vehicle factory
function VehicleFactory() {}

// Define the prototypes and utilities for this factory

// Our default vehicleClass is Car
VehicleFactory.prototype.vehicleClass = Car;

// Our Factory method for creating new Vehicle instances
VehicleFactory.prototype.createVehicle = function(options) {

    switch (options.vehicleType) {
        case "car":
            this.vehicleClass = Car;
            break;
        case "truck":
            this.vehicleClass = Truck;
            break;
            //defaults to VehicleFactory.prototype.vehicleClass (Car)
    }

    return new this.vehicleClass(options);

};

// Create an instance of our factory that makes cars
var carFactory = new VehicleFactory();
var car = carFactory.createVehicle({
    vehicleType: "car",
    color: "yellow",
    doors: 6
});

// Test to confirm our car was created using the vehicleClass/prototype Car

// Outputs: true
console.log(car instanceof Car);

// Outputs: Car object of color "yellow", doors: 6 in a "brand new" state
console.log(car);

var movingTruck = carFactory.createVehicle({
    vehicleType: "truck",
    state: "like new",
    color: "red",
    wheelSize: "small"
});

// Test to confirm our truck was created with the vehicleClass/prototype Truck

// Outputs: true
console.log(movingTruck instanceof Truck);

// Outputs: Truck object of color "red", a "like new" state
// and a "small" wheelSize
console.log(movingTruck);


/**
 * 8,混合模式( Mixin Pattern)
 * @bref:Mixins是提供功能，可以轻松地继承子类或一组子类，以实现功能重用。
 * 
 * 
 */
// Define a simple Car constructor
var Car = function(settings) {

    this.model = settings.model || "no model provided";
    this.color = settings.color || "no colour provided";

};

// Mixin
var Mixin = function() {};

Mixin.prototype = {

    driveForward: function() { //前驱
        console.log("drive forward");
    },

    driveBackward: function() {
        console.log("drive backward");
    },

    driveSideways: function() {
        console.log("drive sideways");
    }

};


// Extend an existing object with a method from another
function augment(receivingClass, givingClass) { //扩展

    // only provide certain methods
    if (arguments[2]) {
        for (var i = 2, len = arguments.length; i < len; i++) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }
    // provide all methods
    else {
        for (var methodName in givingClass.prototype) {

            // check to make sure the receiving class doesn't
            // have a method of the same name as the one currently
            // being processed
            if (!Object.hasOwnProperty.call(receivingClass.prototype, methodName)) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }


        }
    }
}


// Augment the Car constructor to include "driveForward" and "driveBackward"
augment(Car, Mixin, "driveForward", "driveBackward");

// Create a new Car
var myCar = new Car({
    model: "Ford Escort",
    color: "blue"
});

// Test to make sure we now have access to the methods
myCar.driveForward();
myCar.driveBackward();

// Outputs:
// drive forward
// drive backward

// We can also augment Car to include all functions from our mixin
// by not explicitly listing a selection of them
augment(Car, Mixin);

var mySportsCar = new Car({
    model: "Porsche",
    color: "red"
});

mySportsCar.driveSideways();

// Outputs:
// drive sideways


/**
 * 9, 装饰者模式( Decorator  Pattern)
 * @bref:
 * 
 * 
 */
function MacBook() {

    this.cost = function() { return 997; };
    this.screenSize = function() { return 11.6; };

}

// Decorator 1
function memory(macbook) {

    var v = macbook.cost();
    macbook.cost = function() {
        return v + 75;
    };

}

// Decorator 2
function engraving(macbook) {

    var v = macbook.cost();
    macbook.cost = function() {
        return v + 200;
    };

}

// Decorator 3
function insurance(macbook) {

    var v = macbook.cost();
    macbook.cost = function() {
        return v + 250;
    };

}

var mb = new MacBook();
memory(mb);
engraving(mb);
insurance(mb);

// Outputs: 1522
console.log(mb.cost());

// Outputs: 11.6
console.log(mb.screenSize());

/**
 * 7,模式( Pattern)
 * @bref:
 * 
 * 
 */
//总结：下边的内容略。