---
title: JavaScript 基础知识总结
date: 2024-01-02 10:00:00
categories:
  - [前端开发]
tags:
  - JavaScript
  - 前端
  - 基础
cover: assets/js-cover.jpg
---

# JavaScript 基础知识总结

本文总结了 JavaScript 的基础知识点。

## 变量声明

JavaScript 中有三种声明变量的方式：

### var
```javascript
var name = "张三";
console.log(name); // 张三
```

### let
```javascript
let age = 25;
console.log(age); // 25
```

### const
```javascript
const PI = 3.14159;
console.log(PI); // 3.14159
```

<!-- more -->

## 数据类型

JavaScript 有以下几种基本数据类型：

1. **Number** - 数字
2. **String** - 字符串  
3. **Boolean** - 布尔值
4. **Undefined** - 未定义
5. **Null** - 空值
6. **Symbol** - 符号（ES6新增）
7. **BigInt** - 大整数（ES2020新增）

## 函数

### 函数声明
```javascript
function greet(name) {
    return "Hello, " + name + "!";
}
```

### 箭头函数
```javascript
const greet = (name) => {
    return `Hello, ${name}!`;
};
```

## 总结

JavaScript 是一门功能强大的编程语言，掌握好基础知识对后续学习很重要。
