//es6实现设计模式：https://github.com/tcorral/Design-Patterns-in-Javascript
/*************************************
 * 1,Adapter（适配器模式）
 *@bref：将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。
 * 如：读卡器，电源适配器，转接口等。
 *************************************/
//Duck.js 
class Duck {
    constructor() {}

    fly() {
        throw new Error('This method must be overwritten!');
    }

    quack() {
        //嘎
        throw new Error('This method must be overwritten!');
    }
}

export default Duck;


//MallardDuck.js -野鸭
import Duck from './Duck';

class MallardDuck extends Duck {
    fly() {
        console.log('Can fly long distances!');
    }

    quack() {
        console.log('Quack! Quack!');
    }
}

export default MallardDuck;

//Turkey.js-火鸡
class Turkey {
    fly() {
        throw new Error('This method must be overwritten!');
    }

    gobble() {
        throw new Error('This method must be overwritten');
    }
}

export default Turkey;

//WildTurkey.js--野火鸡
import Turkey from './Turkey';

class WildTurkey extends Turkey {
    fly() {
        console.log('Fly short distance!');
    }

    gobble() {
        console.log('Gobble!, Gobble!');
    }
}

export default WildTurkey;

//TurkeyAdapter.js -适配器（鸭子具备火鸡的某些特点）
import Duck from './Duck';

const MAX_FLIES = 5;

class TurkeyAdapter extends Duck {
    constructor(oTurkey) {
        super(oTurkey);
        this.oTurkey = oTurkey;
    }

    fly() {
        for (let index = 0; index < MAX_FLIES; index++) {
            this.oTurkey.fly();
        }
    }

    quack() {
        this.oTurkey.gobble();
    }
}

export default TurkeyAdapter;


//main.js-执行主文件

import MallardDuck from './MallardDuck';
import WildTurkey from './WildTurkey';
import TurkeyAdapter from './TurkeyAdapter';

let oMallardDuck = new MallardDuck();
let oWildTurkey = new WildTurkey();
let oTurkeyAdapter = new TurkeyAdapter(oWildTurkey);

oMallardDuck.fly();
oMallardDuck.quack();

oWildTurkey.fly();
oWildTurkey.gobble();

oTurkeyAdapter.fly();
oTurkeyAdapter.quack();

//运行结果：
//Can fly long distances!
// Quack! Quack!

// Fly short distance!
//  Gobble!, Gobble!

// Fly short distance!（5次）
// Gobble!, Gobble!


/*************************************
 * 2,Chaining（方法链模式）
 *@bref：也叫任务链模式。针对一个对象，完成一系列的任务并保存记录。可以跟踪和记录该对象的时间轴。
 * 这种写法方便了对类方法的连续调用。灵感来源于jquey的链式调用。
 * 应用如：统计员工季度任务列表，支付宝的月度账单，博客里博主的年度时间轴总结等。打开脑洞，自由发散。
 *************************************/

//Chainable.js
class Chainable {
    constructor() {
        this.number = 0;
        this.billRecord = [];
    }

    add(number) {
        this.number += number;
        return this;
    }
    shopping(bag) {
        this.billRecord.push(bag);
        return this;
    }
    multiply(number) {
        this.number *= number;
        return this;
    }

    toString() {
        return this.number.toString();
    }
    getRecord() {
        return this.billRecord.join(',');
    }
}

//export default Chainable;

//main.js
//import Chainable from './Chainable';

let chainable = new Chainable();

console.log(chainable.add(3).add(4).toString());
console.log(chainable.add(5).toString());
console.log(chainable.multiply(3).add(6).toString());
console.log(chainable.shopping('书包').shopping('电脑').getRecord());
//运行结果：
// 7
// 12
// 42
//书包，电脑

/*************************************
 * 3,Command（命令模式）
 *@bref：将一个请求封装成一个对象，从而使您可以用不同的请求对客户进行参数化。
 * 即，通过调用者调用接受者执行命令，顺序：调用者→接受者→命令。也是为了解耦。
 * 应用如：d3，canvas画图，echart图表等第三方工具类使用，分为工具类提供的方法（命令），我们需要功能方法（接受者），用户调用类（调用者）。打开脑洞，自由发散。
 *************************************/

//Light.js---点火器（命令）
class Light {
    constructor() {
        this._on = false;
    }

    on() {
        this._on = true;
        console.log('Light is on');
    }

    off() {
        this._on = false;
        console.log('Light is off');
    }
}

//export default Light;

//SimpleRemoteControl.js --命令控制(调用者)
class SimpleRemoteControl {
    constructor() {
        this.command = null;
    }

    setCommand(command) {
        this.command = command;
    }

    buttonWasPressed() {
        this.command.execute();
    }
    buttonUndoWasPressed() {
        this.command.undo();
    }
}

//export default SimpleRemoteControl;

//Command.js
class Command {
    execute() {
        throw new Error('This method must be overwritten!');
    }
    undo() {
        throw new Error('This method must be overwritten!');
    }
}

//export default Command;

//LightOnCommand.js --命令类（接受者）

//import Command from './Command';

class LightOnCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }

    execute() {
        this.light.on();
    }
    undo() {
        this.light.off();
    }
}

//export default LightOnCommand;



//main.js --执行文件
// import Light from '../../common/Light';
// import LightOnCommand from '../../common/LightOnCommand';
// import SimpleRemoteControl from '../../common/SimpleRemoteControl';

let oSimpleRemote = new SimpleRemoteControl();
let oLight = new Light();
let oLightCommand = new LightOnCommand(oLight);

oSimpleRemote.setCommand(oLightCommand);
oSimpleRemote.buttonWasPressed();
oSimpleRemote.buttonUndoWasPressed();
//运行结果：
//Light is on
//Light is off



/*************************************
 * 4,Composite（组合模式）
 *@bref：将对象组合成树形结构以表示“部分-整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。
 * 掌握组合模式的重点是要理解清楚 “部分/整体” 还有 ”单个对象“ 与 "组合对象" 的含义。。
 * 应用如：系统目录结构，网站导航结构等层次结构。打开脑洞，自由发散。
 *************************************/

//MenuComponent.js
class MenuComponent {
    constructor(name = '', description = '', isVegetarian = false, price = 0) {
        this.name = name;
        this.description = description;
        this._isVegetarian = isVegetarian; //是否是素食主义者
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getPrice() {
        return this.price;
    }


    isVegetarian() {
        return !!this._isVegetarian;
    }
    print() {
        throw new Error('This method must be overwritten!');
    }

    add() {
        throw new Error('This method must be overwritten!');
    }

    remove() {
        throw new Error('This method must be overwritten!');
    }

    getChild() {
        throw new Error('This method must be overwritten!');
    }
    createIterator() {
        throw new Error("This method must be overwritten!");
    }
}

//export default MenuComponent;

//MenuItem.js
//import MenuComponent from './MenuComponent';

class MenuItem extends MenuComponent {
    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getPrice() {
        return this.price;
    }
    print() {
        console.log(this.getName() + ": " + this.getDescription() + ", " + this.getPrice() + "euros");
    }
    createIterator() {
        var arr = [];
        return arr[Symbol.iterator]();
    }
}

//export default MenuItem;
//Iterator.js
class Iterator {
    hasNext() {
        throw new Error("This method must be overwritten!");
    }

    next() {
        throw new Error("This method must be overwritten!");
    }

    remove() {
        throw new Error("This method must be overwritten!");
    }
}

//export default Iterator;

//Menu.js
//import MenuComponent from './MenuComponent';

class Menu extends MenuComponent {
    constructor(name, description) {
        super();
        this.menuComponents = [];
        this.iterator = null;
        this.name = name;
        this.description = description;
        this.createIterator = function() {
            throw new Error('This method must be overwritten!');
        }
    }

    add(menuComponent) {
        this.menuComponents.push(menuComponent);
    }

    remove(menuComponent) {
        this.menuComponents = this.menuComponents.filter(component => {
            return component !== component;
        });
    }

    getChild(index) {
        return this.menuComponents[index];
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    print() {
        console.log(this.getName() + ": " + this.getDescription());
        console.log("--------------------------------------------");
        this.menuComponents.forEach(component => {
            component.print();
        });
    }
    printI() {
        console.log(this.getName() + ": " + this.getDescription());
        console.log("--------------------------------------------");

        for (let component of this.menuComponents) {
            component.print();
        }
    }

    createIterator() {
        if (this.iterator === null) {
            this.iterator = this.menuComponents[Symbol.iterator]();
        }
        return this.iterator;
    };
}

//export default Menu;

//CafeMenu.js,
//import Menu from './Menu';

class CafeMenu extends Menu {}

//export default CafeMenu;

//LunchMenu.js
//import Menu from './Menu';

class LunchMenu extends Menu {}

//export default LunchMenu;

//PancakeHouseMenu.js
//import Menu from './Menu';

class PancakeHouseMenu extends Menu {}

//export default PancakeHouseMenu;


//Mattress.js
class Mattress {
    //打印菜单
    constructor(aMenus) {
        this.menus = aMenus;
    }

    printMenu() {
        this.menus.print();
    }
    printVegetarianMenu() {
        //迭代遍历器
        let iterator = this.menus.menuComponents[Symbol.iterator]();
        let menu = iterator.next();
        console.log("VEGETARIAN MENU");
        while (menu.value) {
            let menuComponentsIterator = menu.value.menuComponents[Symbol.iterator]();
            let menuComponent = menuComponentsIterator.next();
            while (menuComponent.value) {
                try {
                    if (menuComponent.value.isVegetarian()) {
                        menuComponent.value.print();
                    }
                } catch (error) {}
                menuComponent = menuComponentsIterator.next();
                //console.log('menuComponent', menuComponent);
            }
            menu = iterator.next();
            //console.log('menu', menu);
        }
    }
}

//export default Mattress;

//main.js
// import Menu from './Menu';
// import MenuItem from './MenuItem';
// import Mattress from './Mattress';

let oPanCakeHouseMenu = new Menu("Pancake House Menu", "Breakfast");
let oLunchMenu = new Menu("Dinner Menu", "Lunch");
let oCoffeeMenu = new Menu("Cafe Menu", "Lunch");
let oAllMenus = new Menu("ALL MENUS", "All menus combined");

oAllMenus.add(oPanCakeHouseMenu); //加入早餐
oAllMenus.add(oLunchMenu); //加入午餐

oLunchMenu.add(new MenuItem("Pasta", "Spaghetti with Marinara Sauce, and a slice of sourdough bread", true, 3.89));
oLunchMenu.add(oCoffeeMenu); //午餐中加入咖啡餐

oCoffeeMenu.add(new MenuItem("Express", "Coffee from machine", false, 0.99));

let oMattress = new Mattress(oAllMenus);
console.log("------------------正常打印---------------------------");
//oMattress.printMenu();
console.log("-------------------正常打印结束--------------------------");
console.log("------------------遍历器打印---------------------------");
let oMattressI = new Mattress(oAllMenus);
oMattressI.printVegetarianMenu();
console.log("-------------------遍历打印结束--------------------------");
//运行结果：
/**
------------------正常打印---------------------------
VM16886:92 ALL MENUS: All menus combined
VM16886:93 --------------------------------------------
VM16886:92 Pancake House Menu: Breakfast
VM16886:93 --------------------------------------------
VM16886:92 Dinner Menu: Lunch
VM16886:93 --------------------------------------------
VM16886:49 Pasta: Spaghetti with Marinara Sauce, and a slice of sourdough bread, 3.89euros
VM16886:92 Cafe Menu: Lunch
VM16886:93 --------------------------------------------
VM16886:49 Express: Coffee from machine, 0.99euros
-------------------正常打印结束--------------------------
------------------遍历器打印---------------------------
VM16886:138 VEGETARIAN MENU(是否是素食主义者餐单)
VM16886:49 Pasta: Spaghetti with Marinara Sauce, and a slice of sourdough bread, 3.89euros
-------------------遍历打印结束--------------------------
 */



/*************************************
 * 5,Compound（复合模式）
 *@bref：类似组合模式。
 * 三个示例演示了这个过程：单个鸭子--》鸭子工厂--》鸭子集群--》带观察者的鸭子集群。
 * 应用如：层次复杂的文件系统，树结构等。打开脑洞，自由发散。
 *************************************/

//QuackObservable.js
class QuackObservable {
    registerObserver() { //观察
        throw new Error("This method must be overwritten!");
    }

    notifyObservers() { //通知
        throw new Error("This method must be overwritten!");
    }
}

//export default QuackObservable;

//Quackable.js
//import QuackObservable from './QuackObservable';

class Quackable extends QuackObservable {

    quack() {
        throw new Error("This method must be overwritten!");
    }
}

//export default Quackable;

//Observable.js
//import QuackObservable from './QuackObservable';
const observers = [];
class Observable extends QuackObservable {
    constructor(duck) {
        super();
        //this.observers = [];
        this.duck = duck;
    }

    registerObserver(observer) {
        //console.log("registerObserver...", observer);
        observers.push(observer);
        //console.log("Observable...this.observers...", this.observers);
    }

    notifyObservers() {
        //console.log("this.observers...", this.observers);
        var iterator = observers[Symbol.iterator]();

        let observer = iterator.next();
        //console.log("observer...", observer);
        while (observer.value) {

            //console.log("observer...", observer);
            observer.value.update(this.duck);
            observer = iterator.next();
        }
    }
}

//export default Observable;

//MallardDuck.js
// import Quackable from './Quackable';
// import Observable from './Observable';

class MallardDuck extends Quackable {
    constructor() {
        super();
        this.name = "MallardDuck";
        this.observable = new Observable(this);
    }

    registerObserver(observer) {

        this.observable.registerObserver(observer);
    }

    notifyObservers() {
        this.observable.notifyObservers();
    }

    quack() {
        console.log('Quack!');
        this.notifyObservers();
    }
}

//export default MallardDuck;

//DuckCall.js
//import Quackable from './Quackable';

class DuckCall extends Quackable {
    quack() {
        console.log('Kwak!');
    }
}

//export default DuckCall;

//RedheadDuck.js
//import Quackable from './Quackable';

class RedheadDuck extends Quackable {
    quack() {
        console.log('Quack!');
    }
}

//export default RedheadDuck;



//RubberDuck.js
//import Quackable from './Quackable';

class RubberDuck extends Quackable {
    quack() {
        console.log('Squeak!');
    }
}

//export default RubberDuck;




//Goose.js
class Goose {
    honk() {
        console.log("Honk!");
    }
}

//export default Goose;
//GooseAdapter.js
class GooseAdapter {
    constructor(oGoose) {
        this.oGoose = oGoose;
    }

    quack() {
        this.oGoose.honk();
    }
}

//export default GooseAdapter;

//QuackCounter.js
//import Quackable from './Quackable';

let counter = 0;
class QuackCounter extends Quackable {
    constructor(duck) {
        super();
        counter = 0;
        this.duck = duck;
    }

    static get quacks() {
        return counter;
    }

    static getQuacks() {
        return counter;
    }

    quack() {
        this.duck.quack();
        counter++;
    }
}

//export default QuackCounter;
//AbstractDuckFactory.js
class AbstractDuckFactory {
    createMallardDuck() {
        throw new Error("This method must be overwritten!");
    }

    createRedheadDuck() {
        throw new Error("This method must be overwritten!");
    }

    createDuckCall() {
        throw new Error("This method must be overwritten!");
    }

    createRubberDuck() {
        throw new Error("This method must be overwritten!");
    }
}

//export default AbstractDuckFactory;

//CountingDuckFactory.js
// import AbstractDuckFactory from './AbstractDuckFactory';
// import QuackCounter from './QuackCounter';
// import MallardDuck from './MallardDuck';
// import RedheadDuck from './RedheadDuck';
// import DuckCall from './DuckCall';
// import RubberDuck from './RubberDuck';

class CountingDuckFactory extends AbstractDuckFactory {
    createMallardDuck() {
        return new QuackCounter(new MallardDuck());
    }

    createRedheadDuck() {
        return new QuackCounter(new RedheadDuck());
    }

    createDuckCall() {
        return new QuackCounter(new DuckCall());
    }

    createRubberDuck() {
        return new QuackCounter(new RubberDuck());
    }
}

//export default CountingDuckFactory;

//Flock.js
//import Quackable from './Quackable';

class Flock extends Quackable { //群
    constructor() {
        super();
        this.quackers = [];
        this.observable = new Observable(this);
    }

    quack() {
        let iterator = this.quackers[Symbol.iterator]();
        let quacker = iterator.next();

        while (quacker.value) {
            quacker.value.quack();
            quacker = iterator.next();
        }
    }

    add(quackable) {
        this.quackers.push(quackable);
    }



}

//export default Flock;

//main.js
// import MallardDuck from '../../common/MallardDuck';
// import DuckCall from '../../common/DuckCall';
// import RedheadDuck from '../../common/RedheadDuck';
// import RubberDuck from '../../common/RubberDuck';
// import Goose from '../../common/Goose';
// import GooseAdapter from '../../common/GooseAdapter';

let oMallardDuck = new MallardDuck();
let oDuckCall = new DuckCall();
let oRedheadDuck = new RedheadDuck();
let oRubberDuck = new RubberDuck();
let oGoose = new Goose();
let oGooseAdapter = new GooseAdapter(oGoose);

console.log("Duck simulator:");

oMallardDuck.quack();
oDuckCall.quack();
oRedheadDuck.quack();
oRubberDuck.quack();
oGooseAdapter.quack();
//运行结果：
// Duck simulator:
//     Quack!
//     Kwak!
//     Quack!
//     Squeak!
//     Honk!
/**----------------------------end-------------------------------**/
//------ main.js 示例2（鸭子工厂）----
// import CountingDuckFactory from '../../common/CountingDuckFactory';
// import Goose from '../../common/Goose';
// import GooseAdapter from '../../common/GooseAdapter';
// import QuackCounter from '../../common/QuackCounter';
let oDuckFactory = new CountingDuckFactory();
let oMallardDuck2 = oDuckFactory.createMallardDuck();
let oDuckCall2 = oDuckFactory.createDuckCall();
let oRedheadDuck2 = oDuckFactory.createRedheadDuck();
let oRubberDuck2 = oDuckFactory.createRubberDuck();
let oGoose2 = new Goose();
let oGooseAdapter2 = new GooseAdapter(oGoose2);

console.log("Duck simulator:");

oMallardDuck2.quack();
oDuckCall2.quack();
oRedheadDuck2.quack();
oRubberDuck2.quack();
oGooseAdapter2.quack();

console.log(QuackCounter.getQuacks());
//运行结果：
// Duck simulator:
//  Quack!
//  Kwak!
//  Quack!
//  Squeak!
//  Honk!
//  4
/**----------------------------end-------------------------------**/
//------ main.js 示例3（鸭群）----
// import CountingDuckFactory from '../../common/CountingDuckFactory';
// import Goose from '../../common/Goose';
// import GooseAdapter from '../../common/GooseAdapter';
// import Flock from '../../common/Flock';
// import QuackCounter from '../../common/QuackCounter';

let oDuckFactory3 = new CountingDuckFactory();
let oMallardDuck3 = oDuckFactory3.createMallardDuck();
let oDuckCall3 = oDuckFactory3.createDuckCall();
let oRedheadDuck3 = oDuckFactory3.createRedheadDuck();
let oRubberDuck3 = oDuckFactory3.createRubberDuck();
let oGoose3 = new Goose();
let oGooseAdapter3 = new GooseAdapter(oGoose3);

let oFlockOfDucks = new Flock();

oFlockOfDucks.add(oMallardDuck3);
oFlockOfDucks.add(oDuckCall3);
oFlockOfDucks.add(oRedheadDuck3);
oFlockOfDucks.add(oRubberDuck3);
oFlockOfDucks.add(oGooseAdapter3);

let oFlockOfMallards = new Flock();

let oMallardDuck31 = oDuckFactory3.createMallardDuck();
let oMallardDuck32 = oDuckFactory3.createMallardDuck();
let oMallardDuck33 = oDuckFactory3.createMallardDuck();
let oMallardDuck34 = oDuckFactory3.createMallardDuck();

oFlockOfMallards.add(oMallardDuck31);
oFlockOfMallards.add(oMallardDuck32);
oFlockOfMallards.add(oMallardDuck33);
oFlockOfMallards.add(oMallardDuck34);

oFlockOfDucks.add(oFlockOfMallards);

console.log("Duck simulator with Composite - Flocks:");

oFlockOfDucks.quack();

oFlockOfMallards.quack();

console.log(QuackCounter.getQuacks());
//运行结果：
// Duck simulator with Composite - Flocks:
//     Quack!
//     Kwak!
//     Quack!
//     Squeak!
//     Honk!
//     Quack!（4 次）
//     Quack!（4 次）
//     12
/**----------------------------end-------------------------------**/

//Observer.js
class Observer {
    update() {
        throw new Error("This method must be overwritten!");
    }
}

//export default Observer;

//Quackologist.js
//import Observer from './Observer';

class Quackologist extends Observer {
    update(duck) {
        console.log("Quackologist: " + duck.name + " just quacked");
    }
}

//export default Quackologist;




//FlockObservable.js
// import Observable from './Observable';
// import Flock from '../../common/Flock';

class FlockObservable extends Flock {
    constructor() {
        super();
        this.observable = new Observable(this);
    }

    registerObserver(observer) {
        this.observable.registerObserver(observer);
    }

    notifyObservers() {
        this.observable.notifyObservers();
    }
}

//export default FlockObservable;
//------ main.js 示例4（观察者类）----
// import CountingDuckFactory from '../../common/CountingDuckFactory';
// import Goose from '../../common/Goose';

// import GooseAdapter from '../../common/GooseAdapter';
// import FlockObservable from './FlockObservable';
// import Quackologist from './Quackologist';
// import QuackCounter from '../../common/QuackCounter';

let oDuckFactory4 = new CountingDuckFactory();
let oMallardDuck4 = oDuckFactory4.createMallardDuck();
let oDuckCall4 = oDuckFactory4.createDuckCall();
let oRedheadDuck4 = oDuckFactory4.createRedheadDuck();
let oRubberDuck4 = oDuckFactory4.createRubberDuck();
let oGoose4 = new Goose();
let oGooseAdapter4 = new GooseAdapter(oGoose4);

let oFlockOfDucks4 = new FlockObservable();
oFlockOfDucks4.add(oMallardDuck4);
oFlockOfDucks4.add(oDuckCall4);
oFlockOfDucks4.add(oRedheadDuck4);
oFlockOfDucks4.add(oRubberDuck4);
oFlockOfDucks4.add(oGooseAdapter4);

let oFlockOfMallards4 = new FlockObservable();

let oMallardDuck41 = oDuckFactory4.createMallardDuck();
let oMallardDuck42 = oDuckFactory4.createMallardDuck();
let oMallardDuck43 = oDuckFactory4.createMallardDuck();
let oMallardDuck44 = oDuckFactory4.createMallardDuck();

oFlockOfMallards4.add(oMallardDuck41);
oFlockOfMallards4.add(oMallardDuck42);
oFlockOfMallards4.add(oMallardDuck43);
oFlockOfMallards4.add(oMallardDuck44);

oFlockOfDucks4.add(oFlockOfMallards4);

console.log("Duck simulator with Observer");

let oQuackologist = new Quackologist();

oFlockOfDucks4.registerObserver(oQuackologist);

oFlockOfDucks4.quack();

oFlockOfMallards4.quack();

console.log(QuackCounter.getQuacks());
//运行结果：
//Duck simulator with Observer
//Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:91 Kwak!
// VM1964:102 Quack!
// VM1964:115 Squeak!
// VM1964:127 Honk!
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
// VM1964:79 Quack!
// VM1964:381 Quackologist: MallardDuck just quacked
//     12
/**----------------------------end-------------------------------**/

/*************************************
 * 6,Decorator（装饰器模式）
 *@bref：允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装。
 * 动态地给一个对象添加一些额外的职责。就增加功能来说，装饰器模式相比生成子类更为灵活。
 * 示例是搭配一杯用户需要的咖啡：浓咖啡+奶牛泡沫+摩卡。栗子有点简单，其实功能很强大。
 * 应用如：购物账单，各模块组合，旧模块扩展新功能等。打开脑洞，自由发散。
 *************************************/

//Beverage.js
class Beverage { //饮料
    constructor(description = 'Unknown beverage') {
        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    cost() {
        throw new Error("This method must be overwritten!");
    }
}

//export default Beverage;

//CondimentDecorator.js(调味品)
//import Beverage from './Beverage';

class CondimentDecorator extends Beverage {}

//export default CondimentDecorator;

//Espresso.js(浓咖啡)
//import Beverage from './Beverage';

class Espresso extends Beverage {
    cost() {
        return 1.99;
    }
}

//export default Espresso;

//Mocha.js(摩卡)
//import CondimentDecorator from './CondimentDecorator';

class Mocha extends CondimentDecorator {
    constructor(beverage) {
        super();
        this.beverage = beverage;
    }

    getDescription() {
        return this.beverage.getDescription() + ", Mocha";
    }

    cost() {
        return 0.20 + this.beverage.cost();
    }
}

//export default Mocha;

//Whip.js
//import CondimentDecorator from './CondimentDecorator';

class Whip extends CondimentDecorator { //奶油泡沫
    constructor(beverage) {
        super();
        this.beverage = beverage;
    }

    getDescription() {
        return this.beverage.getDescription() + ', Whip';
    }

    cost() {
        return 0.60 + this.beverage.cost();
    }
}

//export default Whip;

//main.js
// import Espresso from './Espresso';
// import Mocha from './Mocha';
// import Whip from './Whip';

let oEspressoWithMochaAndWhip = new Espresso();
oEspressoWithMochaAndWhip = new Mocha(oEspressoWithMochaAndWhip);
oEspressoWithMochaAndWhip = new Whip(oEspressoWithMochaAndWhip);

console.log(oEspressoWithMochaAndWhip.cost());
//运行结果：
//2.79


/*************************************
 * 7,Facade（外观模式）
 *@bref：隐藏系统的复杂性，并向客户端提供了一个客户端可以访问系统的接口。这种类型的设计模式属于结构型模式，它向现有的系统添加一个接口，来隐藏系统的复杂性。
 * 现实中，如操作系统，电脑，手电筒等设备，我们只需按开关就行，不需要关心开关机细节。
 * 示例，展示的是一个家庭剧院，包括灯光，放映机，幕布，电影等过程，只需要调用一个方法，一切按流程自动化完成。
 * 应用如：组件的封装，第三方插件开发，自动化测试等。打开脑洞，自由发散。
 * 一个技术问题：多继承的实现。如class Amplifier extends Switchable(Object) {}，如果Switchable写成当个文件，
 * 可以使用class Amplifier extends Switchable(null) {}，如果如下面只能使用Switchable(Object)。否则会报错：
 * function is not function。
 *************************************/


//Screen.js
class Screen { //屏幕或显示器
    down() {
        console.log("The screen is down!");
    }

    up() {
        console.log("The screen is up!");
    }
}

//export default Screen;

//Switchable.js

const Switchable = Sup => class extends Sup {
    on() {
        throw new Error('This method should be overwritten!');
    }

    off() {
        throw new Error('This method should be overwritten!');
    }
};

//export default Switchable;

//Playable.js
const Playable = Sup => class extends Sup {
    eject() { //强制关机
        throw new Error('This method should be overwritten!');
    }

    play() {
        throw new Error('This method should be overwritten!');
    }

    stop() {
        throw new Error('This method should be overwritten!');
    }
};

//export default Playable;

//Amplifier.js
//import Switchable from './Switchable';

class Amplifier extends Switchable(Object) { //扩音器, 注：Object而不用Null，用Null会报错
    constructor() {
        super();
        this.volume = 0;
        this.dvdPlayer = null;
        this.cdPlayer = null;
        this.tuner = null;
        this.surroundSound = false; //环绕音
        this.stereoSound = false; //立体声
    }

    on() {
        console.log("Amplifier is on!");
    }

    off() {
        console.log("Amplifier is off!");
    }

    setVolume(volume) {
        this.volume = volume;
        console.log("Volume change to " + volume);
    }

    setDvdPlayer(dvdPlayer) {
        this.dvdPlayer = dvdPlayer;
        console.log("Plugged DVD Player to Amplifier!");
    }

    setCdPlayer(cdPlayer) {
        this.cdPlayer = cdPlayer;
        console.log("Plugged Cd Player to Amplifier!");
    }

    setTuner(tuner) {
        this.tuner = tuner;
        console.log("Plugged on Tuner to Amplifier!");
    }

    setSurroundSound() {
        this.surroundSound = true;
        console.log("Surround Mode is active!");
    }

    setStereoSound() {
        this.stereoSound = true;
        console.log("Stereo Mode is active!");
    }
}

//export default Amplifier;

//CdPlayer.js
// import Switchable from './Switchable';
// import Playable from './Playable';

class CdPlayer extends Switchable(Playable(Object)) { //实现了多继承，注：Object而不用Null，用Null会报错
    on() {
        console.log("CdPlayer is on!");
    }

    off() {
        console.log("CdPlayer is off!");
    }

    eject() {
        console.log("Eject Cd!");
    }

    play(cd) {
        console.log("Playing " + cd.sName);
    }

    stop() {
        console.log("Stop CdPlayer!");
    }
}

//export default CdPlayer;

//DvdPlayer.js
// import Switchable from './Switchable';
// import Playable from './Playable';

class DvdPlayer extends Switchable(Playable(Object)) {
    on() {
        console.log("DvdPlayer is on!");
    }

    off() {
        console.log("DvdPlayer is off!");
    }

    eject() {
        console.log("Eject Dvd!");
    }

    play(movie) {
        console.log("Playing " + movie.name);
    }

    stop() {
        console.log("Stop DvdPlayer!");
    }
}

//export default DvdPlayer;

//PopcornPopper.js
//import Switchable from './Switchable';

class PopcornPopper extends Switchable(Object) { //爆米花机
    on() {
        console.log("PopcornPopper is on!");
    }

    off() {
        console.log("PopcornPopper is off!");
    }

    pop() {
        console.log("Yum!Yum!"); //美味，美味！
    }
}

//export default PopcornPopper;

//Projector.js
//import Switchable from './Switchable';

class Projector extends Switchable(Object) { //放映机
    constructor() {
        super();
        this.wideScreenMode = false;
    }

    on() {
        console.log("Projector is on!");
    }

    off() {
        console.log("Projector is off!");
    }

    setWideScreenMode() {
        this.wideScreenMode = true;
        console.log("Projector now is on wide screen mode!");
    }
}

//export default Projector;




//TheaterLights.js
//import Switchable from './Switchable';

class TheaterLights extends Switchable(Object) { //剧场的灯光
    on() {
        console.log("The lights are on!");
    }

    off() {
        console.log("The lights are off!");
    }
}


//export default TheaterLights;

//Tuner.js
//import Switchable from './Switchable';

class Tuner extends Switchable(Object) { //电视频道
    constructor() {
        this.amplifier = null;
        this.frequency = 0;
    }

    on() {
        console.log("Tuner is on!");
    }

    off() {
        console.log("Tuner is off!");
    }

    setAm() {
        console.log("Tuner AM!");
    }

    setFm() {
        console.log("Tuner FM!");
    }

    setFrequency(frequency) {
        this.frequency = frequency;
        console.log("Tuner frequency changed to " + frequency);
    }
}

//export default Tuner;


//HomeTheaterFacade.js
class HomeTheaterFacade { //家庭剧院外设
    constructor({
        amplifier = null,
        tuner = null,
        dvdPlayer = null,
        cdPlayer = null,
        projector = null,
        theaterLights = null,
        screen = null,
        popcornPopper = null
    }) {
        this.amplifier = amplifier;
        this.tuner = tuner;
        this.dvdPlayer = dvdPlayer;
        this.cdPlayer = cdPlayer;
        this.projector = projector;
        this.theaterLights = theaterLights;
        this.screen = screen;
        this.popcornPopper = popcornPopper;
    }

    watchMovie(movie) {
        console.log('Get ready to watch a movie...');

        this.popcornPopper.on();
        this.popcornPopper.pop();

        this.theaterLights.off();

        this.screen.down();

        this.projector.on();
        this.projector.setWideScreenMode();

        this.amplifier.on();
        this.amplifier.setDvdPlayer(this.dvdPlayer);
        this.amplifier.setSurroundSound();
        this.amplifier.setVolume(5);

        this.dvdPlayer.on();
        this.dvdPlayer.play(movie);
    }

    endMovie() {
        console.log("Shutting movie theater down...");
        this.popcornPopper.off();

        this.theaterLights.on();

        this.screen.up();

        this.projector.off();

        this.amplifier.off();

        this.dvdPlayer.stop();
        this.dvdPlayer.eject();
        this.dvdPlayer.off();
    }

    listenToCd(cd) {
        console.log("Start listening your music...");

        this.amplifier.on();
        this.amplifier.setCdPlayer(this.cdPlayer);
        this.amplifier.setStereoSound();
        this.amplifier.setVolume(5);

        this.cdPlayer.on();
        this.cdPlayer.play(cd);
    }

    endCd() {
        console.log("End listening your music or the Cd has finished!");

        this.amplifier.off();

        this.cdPlayer.stop();
        this.cdPlayer.eject();
        this.cdPlayer.off();
    }

    listenToRadio() {
        console.log("Start listening your favorite radio station...");

        this.amplifier.on();
        this.amplifier.setTuner(this.tuner);
        this.amplifier.setStereoSound();
        this.amplifier.setVolume(5);

        this.tuner.on();
        this.tuner.setFm();
        this.tuner.setFrequency(90.9);
    }

    endRadio() {
        console.log("End listening your favorite radio station...");

        this.amplifier.off();

        this.tuner.off();
    }
}

//export default HomeTheaterFacade;

//Movie.js
class Movie { //电影
    constructor(name = '', minutes = 0, director = '', actors = [], description = '') {
        this.name = name;
        this.minutes = minutes;
        this.director = director;
        this.actors = actors;
        this.description = description;
    }

    setName(name) {
        this.name = name;
    }

    setMinutes(minutes) {
        this.minutes = minutes;
    }

    setDirector(director) {
        this.director = director;
    }

    setActors(actors) {
        this.actors = actors;
    }

    setDescription(description) {
        this.description = description;
    }
}

//export default Movie;

//Nikita.js
//import Movie from './Movie';

class Nikita extends Movie { //《尼基塔》电视连续剧
    constructor() {
        super('Nikita, hard to kill!',
            120,
            'Steven Spielberg', ['Brad Pitt'],
            'Bloody!'
        );
    }
}

//export default Nikita;

//main.js
// import HomeTheaterFacade from './HomeTheaterFacade';
// import Amplifier from './elements/Amplifier';
// import DvdPlayer from './elements/DvdPlayer';
// import CdPlayer from './elements/CdPlayer';
// import Projector from './elements/Projector';
// import TheaterLights from './elements/TheaterLights';
// import Screen from './elements/Screen';
// import PopcornPopper from './elements/PopcornPopper';
// import Nikita from './Nikita';

var oHomeTheaterFacade = new HomeTheaterFacade({
    amplifier: new Amplifier(),
    dvdPlayer: new DvdPlayer(),
    cdPlayer: new CdPlayer(),
    projector: new Projector(),
    theaterLights: new TheaterLights(),
    screen: new Screen(),
    popcornPopper: new PopcornPopper()
});
oHomeTheaterFacade.watchMovie(new Nikita());
oHomeTheaterFacade.endMovie();
//运行结果
/**-----------------------start------------------------------
Get ready to watch a movie...
VM7709:162 PopcornPopper is on!
VM7709:170 Yum!Yum!
VM7709:213 The lights are off!
VM7709:5 The screen is down!
VM7709:186 Projector is on!
VM7709:195 Projector now is on wide screen mode!
VM7709:61 Amplifier is on!
VM7709:75 Plugged DVD Player to Amplifier!
VM7709:90 Surround Mode is active!
VM7709:70 Volume change to 5
VM7709:135 DvdPlayer is on!
VM7709:147 Playing Nikita, hard to kill!
VM7709:299 Shutting movie theater down...
VM7709:166 PopcornPopper is off!
VM7709:209 The lights are on!
VM7709:9 The screen is up!
VM7709:190 Projector is off!
VM7709:65 Amplifier is off!
VM7709:151 Stop DvdPlayer!
VM7709:143 Eject Dvd!
VM7709:139 DvdPlayer is off!

--中文
- 准备看电影...
- PopcornPopper开启！
- 好吃！
- 灯灭了！
- 屏幕已关闭！
- 投影机在上！
- 投影仪现在是在宽屏幕模式！
- 放映机开了！
- 将DVD播放机插入放映机！
- 环绕模式激活！
- 音量更改为5
- DvdPlayer在上！
- 看《尼基塔》，艰苦的拼杀，搏斗！
- 关闭电影院...
- PopcornPopper关闭！
- 灯亮了！
- 屏幕起来了！
- 投影机关闭！
- 放大器关闭！
- 停止DvdPlayer！
- 弹出Dvd！
- DvdPlayer已关闭！

---------------------------end-----------------------------*/

/*************************************
 * 8,Factory（工厂模式）
 *@bref：定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。
 * 主要解决接口选择的问题
 * 示例是一个披萨工厂。
 * 应用如：常见与java大型项目中，商城项目，外卖项目，超市等品类繁多的项目。打开脑洞，自由发散。
 *************************************/



//PizzaStore.js
class PizzaStore {
    createPizza() {
        throw new Error("This method must be overwritten!");
    }

    orderPizza(type) {
        let pizza = this.createPizza(type);

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();
    }
}

//export default PizzaStore;


//PizzaIngredientFactory.js
class PizzaIngredientFactory { //披萨原料工厂
    createDough() {
        throw new Error("This method must be overwritten!");
    }

    createSauce() {
        throw new Error("This method must be overwritten!");
    }

    createCheese() {
        throw new Error("This method must be overwritten!");
    }

    createCheese() {
        throw new Error("This method must be overwritten!");
    }

    createVeggies() {
        throw new Error("This method must be overwritten!");
    }

    createPepperoni() {
        throw new Error("This method must be overwritten!");
    }

    createClam() {
        throw new Error("This method must be overwritten!");
    }
}

//export default PizzaIngredientFactory;

//FreshClams.js
class FreshClams {}

//export default FreshClams;

//Garlic.js
class Garlic {} //蒜头

//export default Garlic;

//MarinaraSauce.js
class MarinaraSauce {}

//export default MarinaraSauce;

//Mushroom.js
class Mushroom {} //蘑菇

//export default Mushroom;

//Onion.js
class Onion {}

//export default Onion;

//RedPepper.js
class RedPepper {}

//export default RedPepper;

//ReggianoCheese.js
class ReggianoCheese {}

//export default ReggianoCheese;

//SlicedPepperoni.js
class SlicedPepperoni {}

//export default SlicedPepperoni;

//ThinCrustDough.js
class ThinCrustDough {}

//export default ThinCrustDough;


//NewYorkPizzaIngredientFactory.js
// import PizzaIngredientFactory from '../PizzaIngredientFactory';
// import ThinCrustDough from '../ingredients/ThinCrustDough';
// import MarinaraSauce from '../ingredients/MarinaraSauce';
// import ReggianoCheese from '../ingredients/ReggianoCheese';
// import Garlic from '../ingredients/Garlic';
// import Mushroom from '../ingredients/Mushroom';
// import RedPepper from '../ingredients/RedPepper';

class NewYorkPizzaIngredientFactory extends PizzaIngredientFactory {
    createDough() {
        return new ThinCrustDough();
    }

    createSauce() {
        return new MarinaraSauce();
    }

    createCheese() {
        return new ReggianoCheese();
    }

    createVeggies() {
        return [new Garlic(), new Mushroom(), new RedPepper()];
    }

    createPepperoni() {}

    createClam() {}
}

//export default NewYorkPizzaIngredientFactory;

//Pizza.js
class Pizza {
    constructor({ name = '', dough = null, sauce = null, veggies = [], cheese = null, pepperoni = null, clams = null }) {
        this.name = name;
        this.dough = dough; //生面团
        this.sauce = sauce; //酱汁; 调味汁
        this.veggies = veggies; //蔬菜
        this.cheese = cheese; //奶酪
        this.pepperoni = pepperoni; //香肠
        this.clams = clams; //蛤; 蚌
    }

    prepare() {
        throw new Error("This method must be overwritten!");
    }

    bake() {
        console.log("Bake for 25 minutes at 350");
    }

    cut() {
        console.log("Cutting the pizza into diagonal slices");
    }

    box() {
        console.log("Place pizza in official PizzaStore box");
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }
}

//export default Pizza;


//CheesePizza.js
//import Pizza from '../Pizza';

class CheesePizza extends Pizza {
    constructor(style, ingredientFactory) {
        super({
            name: style + ' Cheese Pizza'
        });
        console.log(this.name);
        this.ingredientFactory = ingredientFactory;
    }

    prepare() {
        let ingredientFactory = this.ingredientFactory;
        console.log("Preparing " + this.name);
        this.dough = ingredientFactory.createDough();
        this.sauce = ingredientFactory.createSauce();
        this.cheese = ingredientFactory.createCheese();
    }
}

//export default CheesePizza;


//ClamPizza.js
//import Pizza from '../Pizza';

class ClamPizza extends Pizza {
    constructor(style, ingredientFactory) {
        super({
            name: style + ' Clams Pizza'
        });
        this.ingredientFactory = ingredientFactory;
    }

    prepare() {
        let ingredientFactory = this.ingredientFactory;
        console.log("Preparing " + this.name);
        this.dough = ingredientFactory.createDough();
        this.sauce = ingredientFactory.createSauce();
        this.cheese = ingredientFactory.createCheese();
        this.clams = ingredientFactory.createClam();
    }
}

//export default ClamPizza;


//PepperoniPizza.js
//import Pizza from '../Pizza';

class PepperoniPizza extends Pizza {
    constructor(style, ingredientFactory) {
        super({
            name: style + ' Pepperoni Pizza'
        });
        this.ingredientFactory = ingredientFactory;
    }

    prepare() {
        let ingredientFactory = this.ingredientFactory;
        console.log("Preparing " + this.name);
        this.dough = ingredientFactory.createDough();
        this.sauce = ingredientFactory.createSauce();
        this.cheese = ingredientFactory.createCheese();
    }
}

//export default PepperoniPizza;


//VeggiePizza.js
//import Pizza from '../Pizza';

class VeggiePizza extends Pizza {
    constructor(style, ingredientFactory) {
        super({
            name: style + ' Veggie Pizza'
        });
        this.ingredientFactory = ingredientFactory;
    }

    prepare() {
        let ingredientFactory = this.ingredientFactory;
        console.log("Preparing " + this.name);
        this.dough = ingredientFactory.createDough();
        this.sauce = ingredientFactory.createSauce();
        this.cheese = ingredientFactory.createCheese();
    }
}

//export default VeggiePizza;


//NewYorkPizzaStore.js
// import PizzaStore from '../../../common/PizzaStore';
// import NewYorkPizzaIngredientFactory from '../ingredientFactory/NewYorkPizzaIngredientFactory';
// import CheesePizza from '../pizzas/CheesePizza';
// import VeggiePizza from '../pizzas/VeggiePizza';
// import ClamPizza from '../pizzas/ClamPizza';
// import PepperoniPizza from '../pizzas/PepperoniPizza';

const PIZZAS = {
    cheese: CheesePizza, //奶酪
    veggie: VeggiePizza, //素食
    clam: ClamPizza, //蚌，蛤
    pepperoni: PepperoniPizza //意大利辣香肠
};

class NewYorkPizzaStore extends PizzaStore {
    createPizza(type) {
        let ingredientFactory = new NewYorkPizzaIngredientFactory();
        let PizzaConstructor = PIZZAS[type];
        let pizza = null;
        if (PizzaConstructor) {
            pizza = new PizzaConstructor('New York Style', ingredientFactory);
        }
        return pizza;
    }
}

//export default NewYorkPizzaStore;


//main.js
//import NewYorkPizzaStore from './stores/NewYorkPizzaStore';

var oPizzaStore = new NewYorkPizzaStore();
oPizzaStore.orderPizza("cheese");

//运行结果
/**-----------------------start------------------------------
New York Style Cheese Pizza
VM13946:187 Preparing New York Style Cheese Pizza
VM13946:150 Bake for 25 minutes at 350
VM13946:154 Cutting the pizza into diagonal slices
VM13946:158 Place pizza in official PizzaStore box


---------------------------end-----------------------------*/


/*************************************
 * 9,Iterator（迭代器模式）
 * @bref：属于行为型模式。用于顺序访问对象的元素，不需要知道对象的底层表示。
 * es6中引入了Iterator类，有三类数据结构原生具备Iterator接口：数组、某些类似数组的对象、Set和Map结构。对象需要自己在
 * Symbol.iterator属性上面部署。
 * 迭代是每种语言都具备的特性。es6有如下几种常用的迭代方式和方法：while，for...of,for,for...in,Iterator,forEach等。
 * 示例是一个用户的点菜单。餐厅根据用户的需要打印一张点菜详情。常见于kfc，家常菜等饭店。
 * 应用很广泛。主要用于一些查询类的系统和站点，如餐厅，图书馆，账户查询等，打开脑洞，自由发散。
 *************************************/

//MenuItem.js
class MenuItem {
    constructor(name, description, isVegetarian, price) {
        this.name = name;
        this.description = description;
        this._isVegetarian = isVegetarian;
        this.price = price;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getPrice() {
        return this.price;
    }

    isVegetarian() {
        return this._isVegetarian;
    }
}

//export default MenuItem;

//Menu.js
class Menu {
    constructor() {
        this.menuItems = [];
        this.length = 0;
    }

    addItem(menuItem) {
        this.menuItems.push(menuItem);
        this.length++;
    }

    getMenuItems() {
        return this.menuItems;
    }
}

//export default Menu;

//Iterator.js
class Iterator {
    constructor(menuItems) {
        this.iterator = menuItems[Symbol.iterator]();
        this.keys = Object.keys(menuItems);
        this.length = this.keys.length;
    }

    next() {
        return this.iterator.next();
    }

    remove(key) {
        delete this.menuItems[key];
        this.keys = Object.keys(this.menuItems);
        this.length = this.keys.length;
    }
}

//export default Iterator;

//Mattress.js
function printMenu(iterator) { //垫片，辅助类
    let menuItem = iterator.next();
    while (menuItem.value) {
        console.log(menuItem.value.getName() + ": " + menuItem.value.getDescription() + ", " + menuItem.value.getPrice() + "eur.");
        menuItem = iterator.next();
    }
}

class Mattress {
    constructor(menus) {
        this.menus = menus;
    }
    printMenu() {
        this.menus.forEach(function(menu) {
            let iterator = menu.createIterator();
            printMenu(iterator);
        });
    }
}

//export default Mattress;

//PancakeHouseMenu.js
// import Menu from '../../common/Menu';
// import MenuItem from '../../common/MenuItem';
// import Iterator from '../../common/Iterator';

class PancakeHouseMenu extends Menu { //农家饼
    constructor() {
        super();
        this.addItem("K&B's Pancake Breakfast", "Pancakes with scrambled eggs, and toast", true, 2.99);
        this.addItem("Regular Pancake Breakfast", "Pancakes with fried eggs, sausage", false, 2.99);
        this.addItem("Blueberry Pancakes", "Pancakes made with fresh blueberries", true, 3.49);
        this.addItem("Waffles", "Waffles, with your choice of blueberries or strawberries", true, 3.59);
    }
    createIterator() {
        return new Iterator(this.menuItems);
    }
    addItem(name, description, isVegetarian, price) {
        super.addItem(new MenuItem(name, description, isVegetarian, price));
    }
}

//export default PancakeHouseMenu;

//LunchMenu.js
// import Menu from '../../common/Menu';
// import MenuItem from '../../common/MenuItem';
// import Iterator from '../../common/Iterator';

const MAX_ITEMS = 6;
class LunchMenu extends Menu {
    constructor() {
        super();
        this.addItem("Vegetarian BLT", "(Fakin') Bacon with lettuce and tomato on whole wheat", true, 2.99);
        this.addItem("BLT", "Bacon with lettuce and tomato on whole wheat", false, 2.99);
        this.addItem("Soup of the day", "Soup of the day, with a side of potato salad", false, 3.29);
        this.addItem("Hotdog", "A hotdog with saurkraut, relish, onions, topped with cheese", false, 3.05);
    }
    createIterator() {
        return new Iterator(this.menuItems);
    }
    addItem(name, description, isVegetarian, price) {
        if (this.length === MAX_ITEMS) {
            super.addItem(new MenuItem(name, description, isVegetarian, price));
        }
    }
}

//export default LunchMenu;

//CafeMenu.js
// import Menu from '../../common/Menu';
// import MenuItem from '../../common/MenuItem';
// import Iterator from '../../common/Iterator';

class CafeMenu extends Menu {
    constructor() {
        super();
        this.addItem("Express", "Coffee from machine", false, 0.99);
        this.addItem("Long with water", "Coffee with a lot of water", false, 1.20);
        this.addItem("On the rocks", "Coffee with ice", false, 2.00);
    }
    createIterator() {
        return new Iterator(this.menuItems);
    }
    addItem(name, description, isVegetarian, price) {
        super.addItem(new MenuItem(name, description, isVegetarian, price));
    }
}

//export default CafeMenu;

//main.js
// import Mattress from './Mattress';
// import PancakeHouseMenu from './PancakeHouseMenu';
// import LunchMenu from './LunchMenu';
// import CafeMenu from './CafeMenu';

var oMattress = new Mattress([new PancakeHouseMenu(), new LunchMenu(), new CafeMenu()]);
console.log("---------------------------------------------");
oMattress.printMenu();
console.log("---------------------------------------------");

//运行结果
/**-----------------------start------------------------------

---------------------------------------------
VM18774:72 K&B's Pancake Breakfast: Pancakes with scrambled eggs, and toast, 2.99eur.
VM18774:72 Regular Pancake Breakfast: Pancakes with fried eggs, sausage, 2.99eur.
VM18774:72 Blueberry Pancakes: Pancakes made with fresh blueberries, 3.49eur.
VM18774:72 Waffles: Waffles, with your choice of blueberries or strawberries, 3.59eur.
VM18774:72 Express: Coffee from machine, 0.99eur.
VM18774:72 Long with water: Coffee with a lot of water, 1.2eur.
VM18774:72 On the rocks: Coffee with ice, 2eur.
---------------------------------------------
--中文log：
- ---------------------------------------------
- K＆B的煎饼早餐：煎蛋与炒鸡蛋，烤面包，2.99eur。
- 定期煎饼早餐：煎蛋，煎鸡蛋，香肠，2.99eur。
- 蓝莓煎饼：用新鲜蓝莓制成的薄煎饼，3.49eur。
- 华夫饼干：华夫饼，您可以选择蓝莓或草莓，3.59eur。
- 快递：咖啡机，0.99eur。
- 长水：咖啡用大量的水，1.2eur。
- 加冰的：咖啡与冰，2eur。
- ---------------------------------------------
---------------------------end-----------------------------*/



/*************************************
 * 10,Lazy（懒、惰性加载模式）
 * @bref：也叫延迟加载。大型系统中，单次加载大量数据需要很长时间，页面数据太多，导致内存不足，浏览器也会假死。
 * 通过数据分批次分层次加载，页面滚动加载，逐步展示内容等惰性加载模式，有效的解决了这个问题。
 * 示例是一个动态，分批次修改dom元素内容的栗子。使用了es的模板字符串，很实用。
 * 
 * 应用如：滚动加载，分批次查询，分层次和优先级加载，大量图片延迟加载等。打开脑洞，自由发散。
 *************************************/


//Lazy.js
class Lazy {
    constructor(container, text, date) {
        this.container = container;
        this.update(text, date);
    }

    static addZero(time) {
        return time < 10 ? '0' + time : time;
    }

    getFormattedTime(date) {
        return Lazy.addZero(date.getHours()) + ":" + Lazy.addZero(date.getMinutes()) + ":" + Lazy.addZero(date.getSeconds());
    }

    update(text, date) {
        this.container.innerHTML = `
            <div>
                <div>
                Not changed:
                <span>
                    ${this.getFormattedTime(new Date())}
                </span>
                </div>
                <span class="text">
                ${text}
                </span>
                <span class="time">
                ${this.getFormattedTime(date)}
                </span>
            </div>
            `;
        this.update = (text, date) => {
            var textNode = this.container.querySelector('.text');
            var timeNode = this.container.querySelector('.time');
            textNode.innerHTML = text;
            timeNode.innerHTML = this.getFormattedTime(date);
        };
    }
}

//export default Lazy;

//main.js
//import Lazy from './Lazy';

let counter = 0;
const elements = ['Zero', 'First', 'Second', 'Third', 'Fourth'];

let timeout = null;
let lazy = new Lazy(document.getElementById('test'), elements[counter], new Date());

timeout = setInterval(function() {
    if (counter === 4) {
        clearInterval(timeout);
    }
    lazy.update(elements[counter++], new Date());
}, 500);

//运行结果
/**-----------------------start------------------------------
Not changed: 10:25:15
Fourth 10:25:18


---------------------------end-----------------------------*/



/*************************************
 * 11,Module（模块模式）
 *@bref：能够帮助我们清晰地分离和组织项目中的代码单元。
 * js中实现模块的方法:1》对象字面量表示法，如:const obj={}. 2》es6中的Module模式,如:import,export 
 * 3》AMD模式,CMD模式如：require.js，seajs 4》CommonJS模块,如nodejs 5》es6中的class
 * 文献：https://addyosmani.com/writing-modular-js/和http://blog.csdn.net/vuturn/article/details/51970567
 * 
 * 
 * 
 * 应用广泛。打开脑洞，自由发散。
 *************************************/

//ModuleRevealed.js
export default (function(win) {
    //在js中，Module模式用于进一步模拟类的概念，通过这种方式，能够使一个单独的对象用于公有/私有方法和变量，
    //从而屏蔽来自全局作用域的特殊部分。产生的结果是：函数名与在页面上其他脚本定义的函数冲突的可能性降低。
    var oContainer = null;

    function setContainer(oCont) {
        oContainer = oCont;
    }

    function addZero(nTime) {
        return nTime < 10 ? '0' + nTime : nTime;
    }

    function getFormattedTime(dTime) {
        return addZero(dTime.getHours()) + ":" + addZero(dTime.getMinutes()) + ":" + addZero(dTime.getSeconds());
    }

    function insertTestModule() {
        oContainer.innerHTML = 'Test Module: ' + getFormattedTime(new Date());
    }

    function removeContent() {
        oContainer.innerHTML = '';
    }

    return {
        init: function(oContainer) {
            setContainer(oContainer);
            insertTestModule();
        },
        destroy: function() {
            removeContent();
        }
    };
}());
//Module.js
function Module(container) {
    return new class {
        get container() {
            return container;
        }

        init() {
            this.container.innerHTML = 'Test module';
            this.compeled();
            this.initData();
            this.bindEvent();

        }
        compeled() {
            console.log('compeled');
        }
        initData() {
            console.log('initData');
        }
        bindEvent() {
            console.log('initEvent');
        }
        destroy() {
            this.container.innerHTML = '';
            delete this.container;
        }
    }
}

//export default Module;

//main.js
//import Module from './Module';
//import ModuleRevealed from './ModuleRevealed';


var oModule = Module(document.getElementById('test'));
oModule.init();

ModuleRevealed.init(document.getElementById('test2'));
//运行结果
/**-----------------------start------------------------------
---------------------------end-----------------------------*/



/*************************************
 * 12,Multi-Inheritance（多重继承模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/

//Quackable.js
const Quackable = Sup => class extends Sup {
    quack() {
        console.log('Quack!');
    }
};

//export default Quackable;

//Flyable.js
const Flyable = Sup => class extends Sup {
    fly() {
        console.log('Flap, Flap!');
    }
};

//export default Flyable;

//Duck.js
// import Flyable from './Flyable';
// import Quackable from './Quackable';

class Duck extends Quackable(Flyable(Object)) {
    swim() {
        console.log('Chop!');
    }
}

//export default Duck;

//man.js
//import Duck from './Duck';

var duck = new Duck();

duck.fly();
duck.quack();
duck.swim();

//运行结果
/**-----------------------start------------------------------
duck.fly();
duck.quack();
duck.swim();
VM28442:13 Flap, Flap!
VM28442:4 Quack!
VM28442:25 Chop!


---------------------------end-----------------------------*/




/*************************************
 * 13,Factory（工厂模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/

//运行结果
/**-----------------------start------------------------------



---------------------------end-----------------------------*/


/*************************************
 * 13,Factory（工厂模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/

//运行结果
/**-----------------------start------------------------------



---------------------------end-----------------------------*/






/*************************************
 * 13,Factory（工厂模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/

//运行结果
/**-----------------------start------------------------------



---------------------------end-----------------------------*/