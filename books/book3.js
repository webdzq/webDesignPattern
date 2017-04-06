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
 * 2,Composite（组合模式）
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
 * 3,Compound（复合模式）
 *@bref：类似组合模式。
 * 三个示例演示了这个过程：单个鸭子--》鸭子工厂--》鸭子集群--观察者鸭子集群。
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
 * 5,Chaining（方法链模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/
/*************************************
 * 2,Chaining（方法链模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/
/*************************************
 * 2,Chaining（方法链模式）
 *@bref：。
 * 。
 * 应用如：等。打开脑洞，自由发散。
 *************************************/