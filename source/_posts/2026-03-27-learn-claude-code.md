---
title: learn claude code
date: 2026-03-27 09:39:00
updated: 2026-03-27 09:39:00
draft: false
---
workflow、提示词链编排库、无代码……不是agent。
只是一个脆弱的流水线，pipline。
在开发agent时，只可能是两个意思

1. 训练模型，通过强化学习、微调、rlhf去调整权重
2. 构造harness，为模型提供一个可操作的环境。

```
Harness = Tools + Knowledge + Observation + Action Interfaces + Permissions

    Tools:          文件读写、Shell、网络、数据库、浏览器
    Knowledge:      产品文档、领域资料、API 规范、风格指南
    Observation:    git diff、错误日志、浏览器状态、传感器数据
    Action:         CLI 命令、API 调用、UI 交互
    Permissions:    沙箱隔离、审批流程、信任边界
```

模型做决策，harness执行。模型做推理，harness提供上下文。模型是决策者，而harness是载具。

如何做一名master of harness？

1. 实现工具。要给agent一双手。文件读写、shell执行、api调用、浏览器控制、数据库查询。
2. 策划知识。要给agent领域专长。比如产品文档、架构决策记录、风格指南、合规要求。应该要按需加载，agent要自己获得所需的内容。
3. 管理上下文。给agent干净的记忆。sub agent隔离防止噪声泄露，上下文压缩来防止历史淹没，任务系统让目标持久化到单次对话之外。
4. 控制权限。给agent边界，沙箱化文件访问。
5. 收集任务过程数据。agent在每一次执行的行动序列都是训练信号。

```
Claude Code = 一个 agent loop
            + 工具 (bash, read, write, edit, glob, grep, browser...)
            + 按需 skill 加载
            + 上下文压缩
            + 子 agent 派生
            + 带依赖图的任务系统
            + 异步邮箱的团队协调
            + worktree 隔离的并行执行
            + 权限治理
```
