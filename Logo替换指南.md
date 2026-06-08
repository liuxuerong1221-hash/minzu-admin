# Logo替换指南

## 📝 说明

您提供的logo图片是红色印章样式，非常符合"铸牢中华民族共同体意识"的主题。

## 🎯 替换步骤

### 第1步：保存Logo图片

1. **下载您的logo图片**
   - 右键点击logo图片
   - 选择"另存为"
   - 文件名设为：`logo.png`
   - 保存到桌面或任意位置

2. **复制到项目目录**
   ```bash
   # 方法1：使用终端命令（推荐）
   cp ~/Desktop/logo.png /Users/chenjiao/Documents/01-cc文件/民族共同体项目/admin-system/src/assets/logo.png
   
   # 方法2：手动复制
   # 将logo.png复制到：
   # /Users/chenjiao/Documents/01-cc文件/民族共同体项目/admin-system/src/assets/logo.png
   ```

### 第2步：修改登录页面

打开文件：`src/views/Login.vue`

**找到这段代码**（约第11-17行）：
```vue
<div class="logo-area">
  <div class="logo-icon">
    <el-icon :size="48" color="#A70101"><Stamp /></el-icon>
  </div>
</div>
```

**替换为**：
```vue
<div class="logo-area">
  <img src="@/assets/logo.png" alt="logo" class="logo" />
</div>
```

**找到样式代码**（约第192-210行）：
```scss
.logo-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  .logo {
    height: 60px;
  }

  .logo-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #A70101 0%, #8B0000 100%);
    border-radius: 50%;
    box-shadow: 0 8px 20px rgba(167, 1, 1, 0.3);
  }
}
```

**替换为**：
```scss
.logo-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  .logo {
    height: 80px;
    width: auto;
  }
}
```

### 第3步：修改侧边栏Logo

打开文件：`src/views/Layout.vue`

**找到这段代码**（约第30-36行）：
```vue
<div class="logo-container" :class="{ collapse: isCollapse }">
  <el-icon v-if="isCollapse" :size="28" color="#A70101"><Stamp /></el-icon>
  <template v-else>
    <el-icon :size="32" color="#A70101"><Stamp /></el-icon>
    <span class="logo-text">民族共同体</span>
  </template>
</div>
```

**替换为**：
```vue
<div class="logo-container" :class="{ collapse: isCollapse }">
  <img src="@/assets/logo.png" alt="logo" class="logo-img-small" v-if="isCollapse" />
  <img src="@/assets/logo.png" alt="logo" class="logo-img" v-else />
</div>
```

**找到样式代码**（约第137-152行）：
```scss
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  transition: all 0.3s;

  .logo-text {
    font-size: 18px;
    font-weight: bold;
    color: #A70101;
    white-space: nowrap;
  }

  &.collapse {
    padding: 0;
  }
}
```

**替换为**：
```scss
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  transition: all 0.3s;
  padding: 0 15px;

  .logo-img {
    height: 45px;
    width: auto;
  }

  .logo-img-small {
    height: 35px;
    width: auto;
  }

  &.collapse {
    padding: 0;
  }
}
```

### 第4步：查看效果

1. 保存所有修改的文件
2. 刷新浏览器（Ctrl+R 或 Cmd+R）
3. 如果看不到变化，可能需要强制刷新（Ctrl+Shift+R）

## 🎨 预期效果

### 登录页面
- Logo居中显示
- 高度约80px
- 位于"铸牢中华民族共同体意识"标题上方

### 侧边栏
- 展开状态：Logo高度45px，居中显示
- 折叠状态：Logo高度35px，居中显示

## 🔧 调整Logo大小

如果Logo显示太大或太小，可以调整这些值：

**登录页面**：修改 `.logo` 的 `height` 值
```scss
.logo {
  height: 80px;  // 调整这个值，如：60px, 100px
}
```

**侧边栏展开**：修改 `.logo-img` 的 `height` 值
```scss
.logo-img {
  height: 45px;  // 调整这个值
}
```

**侧边栏折叠**：修改 `.logo-img-small` 的 `height` 值
```scss
.logo-img-small {
  height: 35px;  // 调整这个值
}
```

## ❓ 常见问题

### Q1: 图片显示不出来？
A: 检查文件路径是否正确：`/Users/chenjiao/Documents/01-cc文件/民族共同体项目/admin-system/src/assets/logo.png`

### Q2: 图片模糊？
A: 确保您保存的图片分辨率足够高，建议至少 200x200 像素

### Q3: 图片背景是白色的？
A: 如果logo有白色背景，建议使用PNG格式并保留透明背景

### Q4: 修改后没有效果？
A: 
1. 检查文件是否保存
2. 强制刷新浏览器（Ctrl+Shift+R）
3. 如果还是不行，重启开发服务器：`npm run dev`

## 📦 快速命令（一键替换）

如果您的logo已经保存到桌面，可以使用这个命令：

```bash
cd /Users/chenjiao/Documents/01-cc文件/民族共同体项目/admin-system

# 复制logo
cp ~/Desktop/logo.png src/assets/logo.png

# 然后手动修改代码文件即可
```

## ✅ 完成

替换完成后，您的系统将使用您提供的红色印章logo，更加符合主题特色！

---

**注意**：目前系统使用的是Element Plus的图标占位，等您保存好logo图片后，按照上述步骤替换即可。
