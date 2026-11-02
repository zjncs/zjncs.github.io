---
title: micrograd from karpathy
date: 2026-11-02 16:30:00
updated: 2026-11-02 16:30:00
slug: micrograd-from-karpathy
permalink: /2026/11/02/micrograd-from-karpathy/
categories:
  - 课程学习
tags:
  - Python
  - Micrograd
  - 深度学习
  - 反向传播
math: true
katex: true
draft: false
---

## 一、Python 基础

### 1. 魔法方法

魔法方法（Magic Methods）通常以双下划线开头和结尾，也叫 Dunder Methods。Python 会在特定操作发生时调用相应的方法，用于自定义对象的行为。

| 方法 | 对应操作 | 作用 |
| --- | --- | --- |
| `__init__` | `Value(2)` | 初始化对象 |
| `__repr__` | `repr(a)` | 定义用于查看和调试的字符串表示 |
| `__str__` | `str(a)`、`print(a)` | 定义面向用户的字符串表示 |
| `__add__` | `a + b` | 定义加法 |
| `__sub__` | `a - b` | 定义减法 |
| `__mul__` | `a * b` | 定义乘法 |
| `__truediv__` | `a / b` | 定义除法 |
| `__pow__` | `a ** b` | 定义幂运算 |
| `__len__` | `len(a)` | 定义长度 |
| `__getitem__` | `a[0]` | 定义索引访问 |

数值运算示例：

```py
class Value:
    def __init__(self, data):
        self.data = data

    def __repr__(self):
        return f"Value(data={self.data})"

    def __add__(self, other):
        return Value(self.data + other.data)

    def __mul__(self, other):
        return Value(self.data * other.data)


a = Value(2.0)
b = Value(3.0)

print(a)      # Value(data=2.0)
print(a + b)  # Value(data=5.0)
print(a * b)  # Value(data=6.0)
```

本例中，`a + b` 调用 `a.__add__(b)`，`a * b` 调用 `a.__mul__(b)`。

`print(a)` 使用对象的字符串表示；如果类没有定义 `__str__`，默认行为会回退到 `__repr__`。

Micrograd 的 `c = a * b` 同时完成数值计算、创建输出节点、记录输入节点和保存反向传播规则。

### 2. `__repr__` 与 f-string

`__repr__` 返回对象的字符串表示，便于交互式查看和调试。

```py
def __repr__(self):
    return f"Value(data={self.data})"
```

- `repr(a)` 会使用 `a.__repr__()`。
- `f"...{表达式}..."` 是 f-string，会将表达式的值插入字符串。
- 当 `self.data = 2.0` 时，返回值为 `"Value(data=2.0)"`。

### 3. 函数本身与函数调用

不加括号表示函数对象；加括号表示调用函数并得到返回值。

```py
def hello():
    print("你好！")


a = hello    # 保存函数，此时不执行
a()          # 现在执行，输出：你好！

b = hello()  # 立即执行，输出：你好！
print(b)     # None，因为 hello 没有显式 return
```

函数是一等对象（First-Class Object），可以像普通变量一样被赋值、传递和保存。

| 写法 | 含义 |
| --- | --- |
| `backward` | 函数对象 |
| `backward()` | 调用函数，得到返回值 |
| `out._backward = backward` | 保存函数，留待之后调用 |
| `out._backward = backward()` | 立即调用，并保存返回值 |
| `out._backward()` | 调用先前保存的函数 |

`out._backward = _backward` 保存局部反向传播函数，在前向计算完成、上游梯度计算出来后调用。

如果误写为 `out._backward = _backward()`，函数会过早执行；而没有显式返回值的 `_backward()` 返回 `None`，之后调用 `out._backward()` 就会报错。

### 4. `lambda` 匿名函数

语法为 `lambda 参数: 表达式`。函数体只能是一个表达式，表达式的结果会自动作为返回值。

```py
square = lambda x: x ** 2
add = lambda x, y: x + y
noop = lambda: None

print(square(3))  # 9
print(add(3, 5))  # 8
print(noop())     # None
```

`square` 也可以用 `def` 定义：

```py
def square(x):
    return x ** 2
```

| 对比 | `def` | `lambda` |
| --- | --- | --- |
| 定义方式 | 函数定义语句 | 创建函数的表达式 |
| 函数体 | 可包含多条语句 | 只能包含一个表达式 |
| 返回值 | 用 `return`；不写则返回 `None` | 自动返回表达式结果 |
| 适用场景 | 较复杂或需要复用的逻辑 | 简短的临时逻辑 |

作为排序依据：

```py
students = [
    ("Tom", 90),
    ("Jack", 75),
    ("Alice", 95),
]

students.sort(key=lambda x: x[1])
print(students)
# [('Jack', 75), ('Tom', 90), ('Alice', 95)]
```

`lambda x: x[1]` 提取元组的第二个元素，`sort()` 据此按成绩升序排列。

### 5. 包装器与装饰器

包装器（Wrapper）是在原有函数、对象或类之外增加的一层结构，用于在不直接修改原有实现的情况下扩展功能。

```py
def wrapper(func):
    def inner():
        print("开始执行函数...")
        func()
        print("函数执行结束！")
    return inner


def hello():
    print("你好！")


new_hello = wrapper(hello)
new_hello()
```

输出：

```txt
开始执行函数...
你好！
函数执行结束！
```

| 名称 | 作用 |
| --- | --- |
| `hello` | 原始函数 |
| `wrapper` | 接收原始函数，返回包装后的函数 |
| `inner` | 调用原始函数，并执行额外逻辑 |

`wrapper(hello)` 返回 `inner` 函数；调用 `new_hello()` 时才执行其函数体。`inner` 引用了外层的 `func`，也是一个闭包。

装饰器语法：

```py
@wrapper
def hello():
    print("你好！")
```

等价于：

```py
def hello():
    print("你好！")


hello = wrapper(hello)
```

这里的包装器只处理无参数函数；包装带参数的函数时，需要接收和传递参数。

## 二、Value、计算图与局部反向传播

### 1. 节点属性

| 属性 | 含义 |
| --- | --- |
| `data` | 前向计算得到的数值 |
| `grad` | 最终标量目标对当前节点的导数 |
| `_prev` | 当前节点依赖的输入节点集合 |
| `_backward` | 将当前节点的梯度传给输入节点的函数 |

例如 `c = a * b`，`c._prev` 保存 `a` 和 `b`。代码中可能把它们命名为 `child`，但沿计算依赖关系看，它们是 `c` 的前驱节点。

### 2. 默认空函数与闭包

```py
self._backward = lambda: None
```

`_backward` 默认指向无参数、返回 `None` 的空函数。叶子节点没有前驱运算，调用该函数不执行梯度传播。

运算创建输出节点时，再用具体的局部反向函数替换默认值。以下是简化示例，仅处理两个 `Value` 对象的加法和乘法：

```py
class Value:
    def __init__(self, data, _children=()):
        self.data = data
        self.grad = 0.0
        self._prev = set(_children)
        self._backward = lambda: None

    def __repr__(self):
        return f"Value(data={self.data})"

    def __add__(self, other):
        out = Value(self.data + other.data, (self, other))

        def _backward():
            self.grad += out.grad
            other.grad += out.grad

        out._backward = _backward
        return out

    def __mul__(self, other):
        out = Value(self.data * other.data, (self, other))

        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad

        out._backward = _backward
        return out
```

这里的 `_backward` 是闭包：它引用外层的 `self`、`other` 和 `out`。即使运算方法已经返回，之后调用闭包时仍能访问这些对象，并读取调用时的 `out.grad`。

手动调用一次加法的反向传播：

```py
a = Value(2.0)
b = Value(3.0)
out = a + b

out.grad = 1.0
out._backward()

print(a.grad)  # 1.0
print(b.grad)  # 1.0
```

`out._backward()` 只传播当前运算的梯度。完整计算图按逆拓扑顺序调用各节点的 `_backward()`。

## 三、梯度与链式法则

### 1. `grad` 相对于最终目标定义

设最终求导目标为标量 $L$，则节点 `x` 的梯度为：

$$
x.\mathrm{grad}=\frac{\partial L}{\partial x}
$$

它表示最终目标对当前节点的导数，不能只看当前运算的局部导数。

每次局部反向传播都遵循：

$$
\text{输入节点的梯度贡献}
=
\text{输出节点的上游梯度}
\times
\text{输出对该输入的局部导数}
$$

### 2. 输出节点的初始梯度

当最终目标就是输出本身，即 $L=o$ 时：

$$
\frac{\partial L}{\partial o}=\frac{\partial o}{\partial o}=1
$$

因此从以下初始梯度开始：

```py
o.grad = 1.0
```

`1.0` 是最终节点对自身的导数。

### 3. tanh 的梯度传递

前向计算：

$$
o=\tanh(n)
$$

局部导数：

$$
\frac{\partial o}{\partial n}=1-\tanh^2(n)=1-o^2
$$

根据链式法则：

$$
\frac{\partial L}{\partial n}
=
\frac{\partial L}{\partial o}
\cdot
\frac{\partial o}{\partial n}
$$

对应的梯度累加代码：

```py
n.grad += (1 - o.data**2) * o.grad
```

若 `n.grad` 初始为 `0`，`o.grad = 1.0`，且局部导数约为 `0.5`，则本次传播后 `n.grad ≈ 0.5`。

| 节点 | 前向值（约） | 梯度（以 $L=o$ 为目标） |
| --- | --- | --- |
| `n` | `0.8814` | `0.5` |
| `o = tanh(n)` | `0.7071` | `1.0` |

前向计算从 `n` 到 `o`，反向传播将梯度从 `o` 传回 `n`。

### 4. 最终目标是损失函数时

如果：

$$
L=(o-y)^2
$$

则：

$$
\frac{\partial L}{\partial o}=2(o-y)
$$

此时应从 `L.grad = 1.0` 开始。`o.grad` 由损失函数的反向计算得到，不一定等于 `1`；之后再经过 tanh 节点传给 `n`。

## 四、拓扑排序与反向遍历

### 1. 构建前驱在前、输出在后的顺序

`Value.backward()`：

```py
def backward(self):
    topo = []
    visited = set()

    def build_topo(v):
        if v not in visited:
            visited.add(v)

            for child in v._prev:
                build_topo(child)

            topo.append(v)

    build_topo(self)

    self.grad = 1.0
    for v in reversed(topo):
        v._backward()
```

`build_topo(v)` 的执行过程：

1. 如果节点尚未访问，就先加入 `visited`，避免共享节点被重复遍历。
2. 递归访问 `v._prev` 中的所有前驱节点。
3. 前驱处理完成后，才把当前节点加入 `topo`。

加入 `visited` 表示节点已被发现；加入 `topo` 表示其前驱已处理完成。

因此，`topo` 中每个节点都排在自己的前驱之后。例如 `c = a * b`，可能得到 `[a, b, c]` 或 `[b, a, c]`；因为 `_prev` 是集合，独立节点的顺序不固定，但依赖关系始终满足。

### 2. 逆拓扑遍历

反向传播要先处理输出，再处理它依赖的节点：

```py
for v in reversed(topo):
    v._backward()
```

这样，轮到某个节点向其前驱传播梯度时，所有依赖该节点的后续运算都已贡献了梯度。

## 五、梯度累加：a + a

```py
a = Value(3.0)
out = a + a

out.grad = 1.0
out._backward()

print(a.grad)  # 2.0
```

这里 `out = a + a = 2a`，所以：

$$
\frac{\partial\,out}{\partial a}=1+1=2
$$

虽然加法对每个输入位置的局部导数都是 `1`，但两个输入位置指向同一个 `a`，两条路径的贡献必须相加。

在加法闭包中：

```py
self.grad += out.grad
other.grad += out.grad
```

此时 `self` 和 `other` 是同一个对象，两行分别贡献 `1.0`，最终得到 `2.0`。若使用 `=`，后一次赋值就会覆盖前一次贡献。

即使 `_prev = set(_children)` 把重复输入去重，闭包仍保留两个输入位置的引用，所以两次梯度贡献都能保留。遍历时每个节点处理一次，求导时累加每条路径的贡献。
