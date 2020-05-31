# 卢显灿 ｜ Part 1 | 模块二

## 简答题

### 1.描述引用计数的工作原理和优缺点。

引用计数的工作原理：设置对象的引用数，有一个引用计数器来维护这些引用数，引用关系改变时修改引用数。判断当前对象引用数是否为0，引用数为0时立即回收。

引用计数算法优点：
- 发现垃圾时立即回收
- 最大限度减少程序暂停

引用计数算法缺点：
- 无法回收循环引用的对象
- 时间开销大，资源消耗较大

### 2.描述标记整理算法的工作流程。

标记整理算法工作流程：
- 标记整理可以看做是标记清除的增强，也是分标记和清除两个阶段来完成
- 标记阶段：遍历所有对象找标记活动对象
- 清除阶段：先执行整理，移动对象的位置，然后遍历所有对象清除没有标记的对象
- 最后回收相应的空间

标记整理算法优缺点：
- 减少碎片化空间
- 不会立即回收垃圾对象

### 3.描述 V8 中新生代存储区垃圾回收的流程。

新生代存储区垃圾回收流程：
- 回收过程采用复制算法 + 标记整理
- 新生代内存区分为两个等大小空间 From 和 To
- 使用空间为 From，空闲空间为 To
- 活动对象存储在 From 空间，标记整理后将活动对象拷贝至 To
- 拷贝过程中可能出现晋升（晋升就是将新生代对象移动至老生代）。
- 一轮 GC 还存活的新生代需要晋升；To 空间使用率超过 25%，也要将活动对象移动至老生代。
- 最后将 From 与 To 交换空间完成内存释放

### 4.描述增量标记算法在何时使用，以及工作原理。

增量标记算法：将一整段的垃圾回收操作，拆分成多个小步，组合完成整个垃圾回收操作。我们知道，当垃圾回收工作的时候，会阻塞JS程序执行，当我们需要优化垃圾回收的效率时，就可以使用增量标记算法。

优点：让垃圾回收与程序执行可以交替完成，让时间消耗更合理，达到效率优化的好处。

工作原理：
- JS 程序执行的过程中，会伴随着垃圾回收的工作
- 当垃圾回收工作时，需要遍历对象进行标记，此时不需要将所有对象进行标记，可以先将直接可达的对象进行标记，此时停下标记操作
- 然后让JS程序执行一会，之后，再让 GC 机制去做二步的标记操作，去标记那些间接可达的对象
- 重复以上两步，让程序执行和垃圾回收的标记操作交替执行，来达到优化效率和提升用户体验的目的
- 直到标记操作完成之后，最后执行垃圾回收


## 代码题1

基于以下代码完成下面的练习
```javascript
const fp = require('lodash/fp');

// 数据
// horsepower 马力，dollar_value 价格， in_stock 库存 
const cars = [
    { name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true }, 
    { name: "Spyker Cl2 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false } ,
    { name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false }, 
    { name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true },
    { name: "Pagani Huayra" , horsepower: 700, dollar_value: 1300000, in_stock: false }
];
```

### 练习1
使用函数组合 fp.flowRight() 重新实现下面这个函数
```javascript
let isLastInStock = function(cars) {
    // 获取最后一条数据
    let last_car = fp.last(cars);
    // 获取最后一条数据的 in_stock 属性值
    return fp.prop('in_stock', last_car);
}
```

答：
```javascript
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars)); // false
```

### 练习2
使用 fp.flowRight(), fp.prop() 和 fp.first() 获取第一个 car 的 name

答：
```javascript
let getFirstCarName = fp.flowRight(fp.prop('name'), fp.first);
console.log(getFirstCarName(cars)); // Ferrari FF
```

### 练习3
使用帮助函数 _average 重构 averageDollarValue ，使用函数组合的方式实现
```javascript
// _average 无需改动
let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length;
}

let averageDollarValue = function(cars) {
    let dollar_values = fp.map(function(car) {
        return car.dollar_value
    }, cars);
    return _average(dollar_values);
}
```

答：
```javascript
let averageDollarValue = fp.flowRight(_average, fp.map(car => car.dollar_value));
console.log(averageDollarValue(cars)); // 790700
```

### 练习4
使用 flowRight 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串，把数组中的 name 转换为这种形式：例如：sanitizeNames(["Hello World"]) => ["hello_world"]
```javascript
let _underscore = fp.replace(/\W+/g, '_'); // 无需改动，并在 sanitizeNames 中使用它
```

答：
```javascript
let sanitizeNames = fp.flowRight(fp.map(fp.flowRight(_underscore, fp.toLower)));

console.log(sanitizeNames(["Hello World"]));
// [ 'hello_world' ]

console.log(sanitizeNames(["Hello World", "I am Lxcan"]));
// [ 'hello_world', 'i_am_lxcan' ]
```


## 代码题2
基于下面提供的代码，完成后续的练习
```javascript
// support.js

class Container {
    static of (value) {
        return new Container(value);
    }
    constructor (value) {
        this._value = value;
    }
    map (fn) {
        return Container.of(fn(this._value));
    }
}

class Maybe {
    static of (x) {
        return new Maybe(x);
    }
    isNothing () {
        return this._value === null || this._value === undefined;
    }
    constructor (x) {
        this._value = x;
    }
    map (fn) {
        return this.isNothing() ? this : Maybe.of(fn(this._value));
    }
}

module.exports = {
    Maybe,
    Container
}
```

### 练习1
使用 fp.add(x, y) 和 fp.map(f, x) 创建一个能让 functor 里的值增加的函数 ex1
```javascript
const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

let maybe = Maybe.of([5, 6, 1]);
// let ex1 = // ... 你需要实现的位置
```

答：
```javascript
// let ex1 = fp.flowRight(fp.map(v => fp.add(v, 1)));
// console.log(maybe.map(ex1));
// Maybe { _value: [ 6, 7, 2 ] }

let ex1 = n => maybe.map(arr => fp.map(v => fp.add(v, n), arr));
console.log(ex1(1)); // 数组每一项加1
// Maybe { _value: [ 6, 7, 2 ] }
```

### 练习2
实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素
```javascript
const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
// let ex2 = // ... 你需要实现的位置
```

答：
```javascript
let ex2 = fn => xs.map(fn)._value;
console.log(ex2(fp.first)); // "do"
```

### 练习3
实现一个函数 ex3 ，使用 safeProp 和 fp.first 找到 user 的名字的首字母
```javascript
const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x]);
});
let user = { id: 2, name: 'Albert' };
// let ex3 = // ... 你需要实现的位置
```

答：
```javascript
let ex3 = () => safeProp('name', user).map(fp.first)._value;
console.log(ex3()); // A
```

### 练习4
使用 Maybe 重写 ex4 ，不要有 if 语句
```javascript
const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

let ex4 = function (n) {
    if (n) {
        return parseInt(n)
    }
}
```

答：
```javascript
let ex4 = n => Maybe.of(n).map(parseInt)._value;
console.log(ex4('100')); // 100
```


## 项目文件说明

- code : 代码
- notes : 笔记
