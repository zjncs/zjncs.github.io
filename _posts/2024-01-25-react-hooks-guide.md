---
layout: post
title: "React Hooks 完全指南"
date: 2024-01-25 16:45:00 +0800
categories: [前端开发]
tags: [React, Hooks, 状态管理]
featured: true
---

React Hooks自16.8版本引入以来，彻底改变了React组件的编写方式。本文将深入探讨Hooks的使用方法、最佳实践和常见陷阱。

## 什么是Hooks？

Hooks是让你在函数组件中"钩入"React特性的函数。它们让你在不编写class的情况下使用state以及其他的React特性。

## 基础Hooks

### useState - 状态管理

```jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>你点击了 {count} 次</p>
            <button onClick={() => setCount(count + 1)}>
                点击我
            </button>
        </div>
    );
}
```

#### 函数式更新

```jsx
// ✅ 推荐：基于前一个状态更新
const increment = () => {
    setCount(prevCount => prevCount + 1);
};

// ❌ 避免：直接使用当前状态
const increment = () => {
    setCount(count + 1);
};
```

### useEffect - 副作用处理

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        let cancelled = false;
        
        async function fetchUser() {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${userId}`);
                const userData = await response.json();
                
                if (!cancelled) {
                    setUser(userData);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to fetch user:', error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        fetchUser();
        
        // 清理函数
        return () => {
            cancelled = true;
        };
    }, [userId]); // 依赖数组
    
    if (loading) return <div>加载中...</div>;
    if (!user) return <div>用户不存在</div>;
    
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}
```

## 高级Hooks

### useContext - 上下文管理

```jsx
import React, { createContext, useContext, useState } from 'react';

// 创建上下文
const ThemeContext = createContext();

// 提供者组件
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 使用上下文的组件
function ThemedButton() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    return (
        <button 
            onClick={toggleTheme}
            style={{
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#333' : '#fff'
            }}
        >
            切换到 {theme === 'light' ? '暗色' : '亮色'} 主题
        </button>
    );
}
```

### useReducer - 复杂状态管理

```jsx
import React, { useReducer } from 'react';

// 定义状态和动作类型
const initialState = {
    todos: [],
    filter: 'all'
};

function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, {
                    id: Date.now(),
                    text: action.payload,
                    completed: false
                }]
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            };
        default:
            return state;
    }
}

function TodoApp() {
    const [state, dispatch] = useReducer(todoReducer, initialState);
    const [inputValue, setInputValue] = useState('');
    
    const addTodo = () => {
        if (inputValue.trim()) {
            dispatch({ type: 'ADD_TODO', payload: inputValue });
            setInputValue('');
        }
    };
    
    const filteredTodos = state.todos.filter(todo => {
        if (state.filter === 'completed') return todo.completed;
        if (state.filter === 'active') return !todo.completed;
        return true;
    });
    
    return (
        <div>
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo}>添加</button>
            
            <div>
                <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
                    全部
                </button>
                <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
                    未完成
                </button>
                <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
                    已完成
                </button>
            </div>
            
            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                        />
                        <span style={{ 
                            textDecoration: todo.completed ? 'line-through' : 'none' 
                        }}>
                            {todo.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

## 性能优化Hooks

### useMemo - 记忆化计算

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ items, filter }) {
    const [count, setCount] = useState(0);
    
    // ✅ 使用useMemo缓存昂贵的计算
    const filteredItems = useMemo(() => {
        console.log('过滤计算执行'); // 只在items或filter变化时执行
        return items.filter(item => item.category === filter);
    }, [items, filter]);
    
    const expensiveValue = useMemo(() => {
        console.log('昂贵计算执行');
        return filteredItems.reduce((sum, item) => sum + item.value, 0);
    }, [filteredItems]);
    
    return (
        <div>
            <p>总值: {expensiveValue}</p>
            <p>计数: {count}</p>
            <button onClick={() => setCount(count + 1)}>增加计数</button>
            <ul>
                {filteredItems.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

### useCallback - 记忆化函数

```jsx
import React, { useState, useCallback, memo } from 'react';

// 子组件使用memo优化
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
    console.log('TodoItem渲染:', todo.id);
    
    return (
        <li>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>删除</button>
        </li>
    );
});

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    
    // ✅ 使用useCallback缓存函数
    const handleToggle = useCallback((id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, []);
    
    const handleDelete = useCallback((id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, []);
    
    const filteredTodos = useMemo(() => {
        return todos.filter(todo => {
            if (filter === 'completed') return todo.completed;
            if (filter === 'active') return !todo.completed;
            return true;
        });
    }, [todos, filter]);
    
    return (
        <div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">全部</option>
                <option value="active">未完成</option>
                <option value="completed">已完成</option>
            </select>
            
            <ul>
                {filteredTodos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
}
```

## 自定义Hooks

### 创建可复用的逻辑

```jsx
// 自定义Hook：本地存储
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return initialValue;
        }
    });
    
    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage:', error);
        }
    }, [key, storedValue]);
    
    return [storedValue, setValue];
}

// 自定义Hook：API请求
function useApi(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        let cancelled = false;
        
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (!cancelled) {
                    setData(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        fetchData();
        
        return () => {
            cancelled = true;
        };
    }, [url]);
    
    return { data, loading, error };
}

// 使用自定义Hooks
function UserSettings() {
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const { data: user, loading, error } = useApi('/api/user/profile');
    
    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;
    
    return (
        <div>
            <h1>用户设置</h1>
            <p>用户名: {user?.name}</p>
            <label>
                主题:
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">亮色</option>
                    <option value="dark">暗色</option>
                </select>
            </label>
        </div>
    );
}
```

## Hooks使用规则和最佳实践

### 规则

1. **只在最顶层调用Hooks**：不要在循环、条件或嵌套函数中调用
2. **只在React函数中调用Hooks**：函数组件或自定义Hooks中

### 最佳实践

```jsx
// ✅ 正确的依赖数组
useEffect(() => {
    fetchData(userId, filter);
}, [userId, filter]); // 包含所有使用的外部变量

// ❌ 错误的依赖数组
useEffect(() => {
    fetchData(userId, filter);
}, []); // 缺少依赖

// ✅ 使用useCallback优化函数依赖
const fetchData = useCallback(async (id, filter) => {
    // 获取数据的逻辑
}, []);

useEffect(() => {
    fetchData(userId, filter);
}, [fetchData, userId, filter]);
```

## 常见陷阱和解决方案

### 1. 闭包陷阱

```jsx
// ❌ 问题：定时器中的count始终是0
function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(count + 1); // count始终是初始值0
        }, 1000);
        
        return () => clearInterval(timer);
    }, []); // 空依赖数组导致闭包问题
    
    return <div>{count}</div>;
}

// ✅ 解决方案1：使用函数式更新
function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prevCount => prevCount + 1); // 使用前一个状态
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    return <div>{count}</div>;
}

// ✅ 解决方案2：使用useRef
function Counter() {
    const [count, setCount] = useState(0);
    const countRef = useRef(count);
    
    useEffect(() => {
        countRef.current = count;
    });
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCount(countRef.current + 1);
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    return <div>{count}</div>;
}
```

### 2. 无限循环

```jsx
// ❌ 问题：无限循环
function UserList() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetchUsers().then(setUsers);
    }, [users]); // users变化会触发重新获取
    
    return <div>{/* 渲染用户列表 */}</div>;
}

// ✅ 解决方案：正确的依赖
function UserList() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []); // 只在组件挂载时获取
    
    return <div>{/* 渲染用户列表 */}</div>;
}
```

## 总结

React Hooks提供了一种更简洁、更灵活的方式来编写React组件：

1. **useState和useEffect**是最基础和常用的Hooks
2. **useContext和useReducer**适合复杂的状态管理
3. **useMemo和useCallback**用于性能优化
4. **自定义Hooks**让逻辑复用变得简单
5. **遵循Hooks规则**避免常见问题

掌握这些概念和最佳实践，你就能充分发挥Hooks的威力，编写出更优雅、更高效的React应用。

你在使用Hooks时遇到过什么问题？欢迎在评论区分享你的经验！