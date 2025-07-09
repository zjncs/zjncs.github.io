---
layout: post
title: "React 深入学习系列（二）：生命周期与 Hooks"
date: 2024-02-08 14:30:00 +0800
categories: [前端开发]
tags: [React, Hooks, 生命周期, useState, useEffect]
series: "React 深入学习"
series_order: 2
excerpt: "深入理解 React 组件生命周期和 Hooks 的使用，掌握 useState、useEffect 等核心 Hooks。"
---

在上一篇文章中，我们学习了 React 组件的基础知识。今天我们将深入探讨组件的生命周期和 React Hooks。

## 组件生命周期

### 类组件生命周期

虽然现在主要使用函数组件，但了解类组件的生命周期有助于理解 React 的工作原理：

```jsx
class LifecycleDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        console.log('1. Constructor');
    }
    
    componentDidMount() {
        console.log('3. ComponentDidMount');
        // 组件挂载后执行，适合进行 API 调用
    }
    
    componentDidUpdate(prevProps, prevState) {
        console.log('4. ComponentDidUpdate');
        // 组件更新后执行
    }
    
    componentWillUnmount() {
        console.log('5. ComponentWillUnmount');
        // 组件卸载前执行，适合清理工作
    }
    
    render() {
        console.log('2. Render');
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                    Increment
                </button>
            </div>
        );
    }
}
```

## React Hooks

Hooks 让我们在函数组件中使用状态和其他 React 特性。

### useState Hook

管理组件的本地状态：

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    
    return (
        <div>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加</button>
            <button onClick={() => setCount(count - 1)}>减少</button>
            
            <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入姓名"
            />
            <p>你好, {name}!</p>
        </div>
    );
}
```

### useEffect Hook

处理副作用，相当于类组件中的生命周期方法：

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 相当于 componentDidMount 和 componentDidUpdate
    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const response = await fetch(`/api/users/${userId}`);
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('获取用户信息失败:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchUser();
    }, [userId]); // 依赖数组，只有 userId 变化时才重新执行
    
    // 清理副作用，相当于 componentWillUnmount
    useEffect(() => {
        const timer = setInterval(() => {
            console.log('定时器执行');
        }, 1000);
        
        return () => {
            clearInterval(timer); // 清理定时器
        };
    }, []);
    
    if (loading) return <div>加载中...</div>;
    if (!user) return <div>用户不存在</div>;
    
    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

### 自定义 Hooks

创建可重用的状态逻辑：

```jsx
// 自定义 Hook：本地存储
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('保存到本地存储失败:', error);
        }
    };
    
    return [storedValue, setValue];
}

// 使用自定义 Hook
function Settings() {
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const [language, setLanguage] = useLocalStorage('language', 'zh-CN');
    
    return (
        <div>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">浅色主题</option>
                <option value="dark">深色主题</option>
            </select>
            
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="zh-CN">中文</option>
                <option value="en-US">English</option>
            </select>
        </div>
    );
}
```

### 其他常用 Hooks

#### useContext

共享状态，避免 prop drilling：

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

function ThemedButton() {
    const { theme, setTheme } = useContext(ThemeContext);
    
    return (
        <button 
            style={{ 
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#333' : '#fff'
            }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            切换主题
        </button>
    );
}
```

#### useReducer

管理复杂状态：

```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return initialState;
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <div>
            Count: {state.count}
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
    );
}
```

## Hooks 使用规则

1. **只在最顶层调用 Hooks**：不要在循环、条件或嵌套函数中调用
2. **只在 React 函数中调用 Hooks**：函数组件或自定义 Hooks

```jsx
// ❌ 错误用法
function BadExample({ condition }) {
    if (condition) {
        const [state, setState] = useState(0); // 不要在条件中使用
    }
    
    for (let i = 0; i < 10; i++) {
        useEffect(() => {}); // 不要在循环中使用
    }
}

// ✅ 正确用法
function GoodExample({ condition }) {
    const [state, setState] = useState(0);
    
    useEffect(() => {
        if (condition) {
            // 在 Hook 内部使用条件逻辑
        }
    }, [condition]);
}
```

## 实际应用示例

让我们创建一个完整的待办事项应用：

```jsx
import { useState, useEffect } from 'react';

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
    
    // 从本地存储加载数据
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);
    
    // 保存到本地存储
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
    
    const addTodo = () => {
        if (inputValue.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: inputValue,
                completed: false
            }]);
            setInputValue('');
        }
    };
    
    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };
    
    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };
    
    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'active') return !todo.completed;
        return true;
    });
    
    return (
        <div>
            <h1>待办事项</h1>
            
            <div>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="添加新任务..."
                />
                <button onClick={addTodo}>添加</button>
            </div>
            
            <div>
                <button onClick={() => setFilter('all')}>全部</button>
                <button onClick={() => setFilter('active')}>未完成</button>
                <button onClick={() => setFilter('completed')}>已完成</button>
            </div>
            
            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}>
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>删除</button>
                    </li>
                ))}
            </ul>
            
            <p>
                总计: {todos.length}, 
                已完成: {todos.filter(t => t.completed).length}, 
                未完成: {todos.filter(t => !t.completed).length}
            </p>
        </div>
    );
}
```

## 小结

在这篇文章中，我们学习了：

- React 组件的生命周期概念
- useState 和 useEffect 等核心 Hooks
- 如何创建自定义 Hooks
- Hooks 的使用规则和最佳实践
- 实际应用中的 Hooks 使用

下一篇文章我们将学习 React 中的状态管理，包括 Context API 和第三方状态管理库。

## 练习题

1. 使用 useEffect 创建一个数字时钟组件
2. 实现一个自定义 Hook `useFetch`，用于处理 API 请求
3. 创建一个购物车组件，使用 useReducer 管理复杂状态

继续关注我们的 React 深入学习系列，下一篇将深入探讨状态管理的高级技巧！