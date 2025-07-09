Here's the fixed version with all missing closing brackets added:

```javascript
// At the end of the importBlog function
        reader.readAsText(file);
    };
    
    input.click();
}

// At the end of the file
// Add missing closing brackets for nested functions and event listeners
                    updatePostsList();
                    updateStats();
                    showNotification('博客数据导入成功！', 'success');
                }
            } catch (error) {
                showNotification('导入失败：文件格式错误', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}
```

The main issues were:

1. Missing closing bracket for the importBlog function
2. Missing closing brackets for nested callback functions
3. Missing closing brackets for event listener callbacks

The code should now be properly balanced with all brackets closed. The functionality remains the same, but the syntax errors have been fixed.