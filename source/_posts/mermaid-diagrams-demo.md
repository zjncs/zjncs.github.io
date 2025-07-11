---
title: Mermaid 流程图展示
date: 2024-01-05 15:00:00
categories:
  - [工具与环境]
tags:
  - Mermaid
  - 流程图
  - 图表
mermaid: true
cover: /images/mermaid-cover.jpg
---

# Mermaid 流程图展示

本文展示了 Mermaid 的各种图表类型。

## 流程图 (Flowchart)

### 基础流程图
```mermaid
graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作A]
    B -->|否| D[执行操作B]
    C --> E[结束]
    D --> E
```

### 复杂流程图
```mermaid
graph LR
    A[用户访问] --> B{是否登录?}
    B -->|是| C[显示主页]
    B -->|否| D[跳转登录页]
    D --> E[输入用户名密码]
    E --> F{验证成功?}
    F -->|是| C
    F -->|否| G[显示错误信息]
    G --> E
    C --> H[用户操作]
    H --> I{需要权限?}
    I -->|是| J{有权限?}
    I -->|否| K[直接执行]
    J -->|是| K
    J -->|否| L[权限不足]
    K --> M[操作完成]
```

<!-- more -->

## 时序图 (Sequence Diagram)

### 用户登录时序图
```mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库
    
    用户->>前端: 输入用户名密码
    前端->>后端: 发送登录请求
    后端->>数据库: 查询用户信息
    数据库-->>后端: 返回用户数据
    后端->>后端: 验证密码
    alt 验证成功
        后端-->>前端: 返回 Token
        前端-->>用户: 登录成功
    else 验证失败
        后端-->>前端: 返回错误信息
        前端-->>用户: 显示错误
    end
```

### API 调用时序图
```mermaid
sequenceDiagram
    participant C as 客户端
    participant G as 网关
    participant A as 认证服务
    participant B as 业务服务
    participant D as 数据库
    
    C->>G: 发送请求
    G->>A: 验证 Token
    A-->>G: 验证结果
    alt Token 有效
        G->>B: 转发请求
        B->>D: 查询数据
        D-->>B: 返回数据
        B-->>G: 返回结果
        G-->>C: 返回响应
    else Token 无效
        G-->>C: 返回 401 错误
    end
```

## 甘特图 (Gantt Chart)

```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 需求分析
    需求调研           :done,    des1, 2024-01-01,2024-01-05
    需求文档           :done,    des2, after des1, 3d
    section 设计阶段
    系统设计           :active,  des3, 2024-01-08, 5d
    UI设计            :         des4, after des3, 3d
    section 开发阶段
    前端开发           :         dev1, 2024-01-15, 10d
    后端开发           :         dev2, 2024-01-15, 12d
    section 测试阶段
    单元测试           :         test1, after dev1, 3d
    集成测试           :         test2, after dev2, 4d
    section 部署上线
    部署准备           :         deploy1, after test2, 2d
    正式上线           :         deploy2, after deploy1, 1d
```

## 类图 (Class Diagram)

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +eat()
        +sleep()
    }
    
    class Dog {
        +String breed
        +bark()
        +wagTail()
    }
    
    class Cat {
        +String color
        +meow()
        +purr()
    }
    
    class Owner {
        +String name
        +feedPet()
        +walkDog()
    }
    
    Animal <|-- Dog
    Animal <|-- Cat
    Owner --> Dog : owns
    Owner --> Cat : owns
```

## 状态图 (State Diagram)

```mermaid
stateDiagram-v2
    [*] --> 待机
    待机 --> 运行 : 启动
    运行 --> 暂停 : 暂停操作
    暂停 --> 运行 : 恢复操作
    运行 --> 停止 : 停止操作
    暂停 --> 停止 : 停止操作
    停止 --> [*]
    
    state 运行 {
        [*] --> 初始化
        初始化 --> 处理中
        处理中 --> 完成
        完成 --> [*]
    }
```

## 饼图 (Pie Chart)

```mermaid
pie title 编程语言使用占比
    "JavaScript" : 35
    "Python" : 25
    "Java" : 20
    "C++" : 10
    "其他" : 10
```

## Git 图 (Git Graph)

```mermaid
gitgraph
    commit id: "初始提交"
    branch develop
    checkout develop
    commit id: "添加功能A"
    commit id: "修复bug"
    checkout main
    merge develop
    commit id: "发布v1.0"
    branch feature
    checkout feature
    commit id: "开发功能B"
    checkout develop
    commit id: "优化性能"
    checkout feature
    commit id: "完成功能B"
    checkout develop
    merge feature
    checkout main
    merge develop
    commit id: "发布v1.1"
```

## 用户旅程图 (User Journey)

```mermaid
journey
    title 用户购物体验
    section 发现产品
      浏览网站: 5: 用户
      搜索产品: 3: 用户
      查看详情: 4: 用户
    section 购买决策
      比较价格: 2: 用户
      查看评价: 4: 用户
      咨询客服: 3: 用户, 客服
    section 下单购买
      加入购物车: 5: 用户
      填写信息: 3: 用户
      支付订单: 4: 用户
    section 售后服务
      物流跟踪: 4: 用户
      收货确认: 5: 用户
      评价商品: 3: 用户
```

## 总结

Mermaid 提供了丰富的图表类型：

- **流程图**: 展示业务流程和逻辑关系
- **时序图**: 描述系统间的交互过程
- **甘特图**: 项目进度和时间规划
- **类图**: 面向对象设计的类关系
- **状态图**: 系统状态转换
- **饼图**: 数据占比展示
- **Git图**: 版本控制流程
- **用户旅程图**: 用户体验流程

这些图表让技术文档更加直观易懂！
