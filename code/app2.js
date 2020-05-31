
// 练习1
// 使用 fp.add(x, y) 和 fp.map(f, x) 创建一个能让 functor 里的值增加的函数 ex1

// const fp = require('lodash/fp');
// const { Maybe, Container } = require('./support.js');

// let maybe = Maybe.of([5, 6, 1]);
// let ex1 = // ... 你需要实现的位置

// // let ex1 = fp.flowRight(fp.map(v => fp.add(v, 1)));
// // console.log(maybe.map(ex1));
// // Maybe { _value: [ 6, 7, 2 ] }

// let ex1 = n => maybe.map(arr => fp.map(v => fp.add(v, n), arr));
// console.log(ex1(1)); // 数组每一项加1
// // Maybe { _value: [ 6, 7, 2 ] }


/* 练习2
实现一个函数 ex2，能够使用 fp.first 获取列表的第一个元素

const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
// let ex2 = // ... 你需要实现的位置

let ex2 = fn => xs.map(fn)._value;
console.log(ex2(fp.first)); // "do" */


// 练习3
// 实现一个函数 ex3 ，使用 safeProp 和 fp.first 找到 user 的名字的首字母

/* const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x]);
});
let user = { id: 2, name: 'Albert' };
// let ex3 = // ... 你需要实现的位置

let ex3 = () => safeProp('name', user).map(fp.first)._value;
console.log(ex3()); // A */


// 练习4
// 使用 Maybe 重写 ex4 ，不要有 if 语句

const fp = require('lodash/fp');
const { Maybe, Container } = require('./support.js');

// let ex4 = function (n) {
//     if (n) {
//         return parseInt(n)
//     }
// }

let ex4 = n => Maybe.of(n).map(parseInt)._value;
console.log(ex4('100')); // 100
