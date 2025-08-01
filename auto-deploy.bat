@echo off
chcp 65001 >nul
title Hexo 自动部署脚本
echo =============================
echo 🚀 Hexo 自动部署开始！
echo =============================

:: 获取当前日期时间作为提交信息
for /f "tokens=1-5 delims=/: " %%a in ("%date% %time%") do (
    set commit_msg=Update on %%a-%%b-%%c %%d:%%e
)

:: Step 1: 查看当前 Git 状态
echo.
echo 📂 当前 Git 状态（源文件仓库）:
git status
echo.

:: Step 2: 提交源文件更改
echo ✅ 提交 Markdown 和配置更改到源码仓库...
git add .
git commit -m "!commit! %commit_msg%"
git push origin main
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Git 源码推送失败，请检查远程仓库配置！
    pause
    exit /b
)
echo ✅ 源码提交完成！

:: Step 3: 清理旧页面
echo.
echo 🧹 清理旧的 Hexo 生成文件...
hexo clean

:: Step 4: 生成新页面
echo ⚙️ 生成静态网页...
hexo g
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Hexo 生成失败，请检查主题或 Markdown 报错！
    pause
    exit /b
)
echo ✅ 网页生成成功！

:: Step 5: 部署到 GitHub Pages 仓库
echo.
echo 🚀 推送到 GitHub Pages 仓库...
hexo d
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ 部署失败，请检查 deploy 配置和权限！
    pause
    exit /b
)
echo ✅ 部署成功！

:: Step 6: 打印地址
echo.
echo 🌐 你的网站已部署到：
echo https://zjncs.github.io

echo.
echo ✅ 所有步骤完成！
pause
