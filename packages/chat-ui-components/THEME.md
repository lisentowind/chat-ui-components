# 主题系统使用指南

## 概述

Chat UI Components 使用 **CSS Variables（CSS 自定义属性）** 实现主题系统。这种方式的优势：

- ✅ 可以穿透 Shadow DOM（Lit 组件使用的技术）
- ✅ 支持运行时动态修改
- ✅ 用户可以轻松覆盖任何颜色
- ✅ 无需额外的构建工具（如 UnoCSS、Less）
- ✅ 完全的 TypeScript 类型支持

## 快速开始

### 1. 应用预设主题

```typescript
import { applyTheme } from '@workspace/chat-ui-components';

const chatContainer = document.getElementById('chat') as HTMLElement;

// 亮色主题
applyTheme(chatContainer, 'light');

// 暗色主题
applyTheme(chatContainer, 'dark');

// 自动跟随系统
applyTheme(chatContainer, 'auto');
```

### 2. 自定义主题颜色

```typescript
import { applyTheme, customizeTheme } from '@workspace/chat-ui-components';

// 方式一：基于预设主题修改
applyTheme(chatContainer, 'light');
customizeTheme(chatContainer, {
  primary: '#9333ea',
  userMessageBackground: '#9333ea',
});

// 方式二：直接在 CSS 中覆盖
// 在你的样式文件中：
```

```css
chat-container {
  --chat-primary: #9333ea;
  --chat-user-msg-bg: #9333ea;
}
```

### 3. 完全自定义主题

```typescript
import { customizeTheme } from '@workspace/chat-ui-components';

customizeTheme(chatContainer, {
  // 主色调
  primary: '#ff6b6b',
  primaryHover: '#ff5252',

  // 背景
  containerBackground: '#f8f9fa',
  headerBackground: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',

  // 消息气泡
  userMessageBackground: '#ff6b6b',
  userMessageText: '#ffffff',
  assistantMessageBackground: '#e9ecef',
  assistantMessageText: '#212529',

  // 输入框
  inputBorder: '#ced4da',
  inputBorderFocus: '#ff6b6b',
});
```

## API 参考

### applyTheme()

应用预设主题。

```typescript
applyTheme(element: HTMLElement, mode: 'light' | 'dark' | 'auto', customColors?: Partial<ThemeColors>)
```

**参数：**
- `element` - 要应用主题的元素（通常是 `chat-container`）
- `mode` - 主题模式：`'light'`、`'dark'` 或 `'auto'`
- `customColors` - 可选的自定义颜色覆盖

**示例：**
```typescript
applyTheme(chatContainer, 'dark', {
  primary: '#00ff00',
});
```

### customizeTheme()

自定义主题颜色。

```typescript
customizeTheme(element: HTMLElement, colors: Partial<ThemeColors>)
```

**参数：**
- `element` - 要应用主题的元素
- `colors` - 要自定义的颜色对象

**示例：**
```typescript
customizeTheme(chatContainer, {
  userMessageBackground: '#ff0000',
  assistantMessageBackground: '#00ff00',
});
```

### watchSystemTheme()

监听系统主题变化（用于 `auto` 模式）。

```typescript
watchSystemTheme(element: HTMLElement, callback: (isDark: boolean) => void): () => void
```

**返回值：** 清理函数，调用后停止监听

**示例：**
```typescript
const cleanup = watchSystemTheme(chatContainer, (isDark) => {
  console.log('系统主题变化:', isDark ? '暗色' : '亮色');
  applyTheme(chatContainer, isDark ? 'dark' : 'light');
});

// 不需要时清理
cleanup();
```

### removeTheme()

移除应用的主题。

```typescript
removeTheme(element: HTMLElement)
```

### getThemeColor()

获取当前主题颜色值。

```typescript
getThemeColor(element: HTMLElement, key: keyof ThemeColors): string
```

**示例：**
```typescript
const primaryColor = getThemeColor(chatContainer, 'primary');
console.log(primaryColor); // "#007bff"
```

## 主题变量完整列表

| CSS 变量 | TypeScript 键名 | 说明 |
|----------|----------------|------|
| `--chat-primary` | `primary` | 主色调 |
| `--chat-primary-hover` | `primaryHover` | 主色调悬停状态 |
| `--chat-background` | `background` | 背景色 |
| `--chat-container-bg` | `containerBackground` | 容器背景 |
| `--chat-header-bg` | `headerBackground` | 头部背景 |
| `--chat-text-primary` | `textPrimary` | 主文字颜色 |
| `--chat-text-secondary` | `textSecondary` | 次要文字颜色 |
| `--chat-text-on-primary` | `textOnPrimary` | 主色上的文字 |
| `--chat-user-msg-bg` | `userMessageBackground` | 用户消息背景 |
| `--chat-user-msg-text` | `userMessageText` | 用户消息文字 |
| `--chat-assistant-msg-bg` | `assistantMessageBackground` | AI 消息背景 |
| `--chat-assistant-msg-text` | `assistantMessageText` | AI 消息文字 |
| `--chat-input-bg` | `inputBackground` | 输入框背景 |
| `--chat-input-border` | `inputBorder` | 输入框边框 |
| `--chat-input-border-focus` | `inputBorderFocus` | 输入框焦点边框 |
| `--chat-input-text` | `inputText` | 输入框文字 |
| `--chat-input-placeholder` | `inputPlaceholder` | 输入框占位符 |
| `--chat-border` | `border` | 边框 |
| `--chat-divider` | `divider` | 分隔线 |
| `--chat-button-disabled-bg` | `buttonDisabledBackground` | 禁用按钮背景 |
| `--chat-button-disabled-text` | `buttonDisabledText` | 禁用按钮文字 |

## 高级用法

### 渐变色支持

CSS 变量支持任何 CSS 颜色值，包括渐变：

```typescript
customizeTheme(chatContainer, {
  headerBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  userMessageBackground: 'linear-gradient(45deg, #ff6b6b, #ee5a6f)',
});
```

### 响应式主题

结合 CSS 媒体查询：

```css
/* 默认（桌面）主题 */
chat-container {
  --chat-container-bg: #ffffff;
}

/* 移动端主题 */
@media (max-width: 768px) {
  chat-container {
    --chat-container-bg: #f8f9fa;
  }
}
```

### 动态主题切换

```typescript
let currentTheme: 'light' | 'dark' = 'light';

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(chatContainer, currentTheme);
}
```

### 主题预设集

创建你自己的主题预设：

```typescript
const myThemes = {
  ocean: {
    primary: '#006994',
    primaryHover: '#005578',
    userMessageBackground: '#006994',
    assistantMessageBackground: '#e0f2f7',
    assistantMessageText: '#00344d',
  },
  sunset: {
    primary: '#ff6b6b',
    primaryHover: '#ff5252',
    userMessageBackground: '#ff6b6b',
    assistantMessageBackground: '#fff3e0',
    assistantMessageText: '#e65100',
  },
};

// 应用自定义主题
applyTheme(chatContainer, 'light');
customizeTheme(chatContainer, myThemes.ocean);
```

## 最佳实践

1. **始终设置基础主题** - 在使用 `customizeTheme()` 之前先调用 `applyTheme()`
2. **使用 TypeScript 类型** - 利用 `ThemeColors` 类型获得完整的类型提示
3. **保持一致性** - 确保文字颜色在背景上有足够的对比度
4. **测试两种模式** - 如果支持暗色模式，确保在两种模式下都测试过
5. **考虑可访问性** - 遵循 WCAG 对比度标准

## 故障排除

### 主题不生效

确保在组件加载后应用主题：

```typescript
// ❌ 错误 - 组件可能还未加载
applyTheme(chatContainer, 'dark');

// ✅ 正确 - 等待组件加载
customElements.whenDefined('chat-container').then(() => {
  applyTheme(chatContainer, 'dark');
});

// 或者在 DOMContentLoaded 之后
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(chatContainer, 'dark');
});
```

### 颜色被覆盖

检查 CSS 优先级。组件内部使用的是 `var(--chat-*, fallback)`，所以：

1. 直接在元素上设置的样式优先级最高
2. CSS 中的规则次之
3. JavaScript `applyTheme()` 再次之
4. 组件内部的 fallback 值优先级最低

## 示例项目

查看 `apps/app` 目录获取完整的示例应用，包括：
- 亮色/暗色/自动主题切换
- 自定义主题示例
- 动态主题修改
