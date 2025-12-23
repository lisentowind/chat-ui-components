# Chat UI Components

使用 Lit 构建的 Web 通用聊天 UI 组件库 Monorepo

## 项目结构

```
chat-ui-components/
├── packages/
│   └── chat-ui-components/    # 组件库源码
│       ├── src/
│       │   ├── components/    # 组件实现
│       │   ├── types.ts       # 类型定义
│       │   ├── event-bus.ts   # 事件总线（基于 mitt）
│       │   └── index.ts       # 导出入口
│       ├── dist/              # 构建产物（包含 .d.ts 类型声明）
│       └── package.json
├── apps/
│   └── app/                   # 示例应用
│       ├── src/
│       │   └── main.ts
│       ├── index.html
│       └── package.json
├── pnpm-workspace.yaml        # pnpm workspace 配置
└── package.json               # 根 package.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建组件库

```bash
# 构建组件库
pnpm --filter @workspace/chat-ui-components build

# 或使用快捷命令
pnpm build
```

### 运行示例应用

```bash
# 确保先构建了组件库
pnpm build

# 启动开发服务器
pnpm dev
```

### 同时构建所有包

```bash
pnpm build:all
```

## 组件库特性

### 组件

- **ChatContainer** - 聊天容器组件
- **ChatMessage** - 消息组件
- **ChatInput** - 输入框组件

### TypeScript 支持

组件库完全支持 TypeScript，导出了完整的类型定义：

```typescript
import type { Message, ChatEvents, ThemeColors, ThemeMode } from '@workspace/chat-ui-components';
```

### 事件系统

组件使用 [mitt](https://github.com/developit/mitt) 作为事件总线：

```typescript
import { createEventBus } from '@workspace/chat-ui-components';

const chatContainer = document.getElementById('chat');

// 通过 eventBus 监听事件
chatContainer.eventBus.on('message-sent', (data) => {
  console.log('Message sent:', data.message);
});

// 也可以通过原生事件监听（向后兼容）
chatContainer.addEventListener('message-sent', (e) => {
  console.log('Message sent:', e.detail.message);
});
```

### 主题系统

组件库使用 **CSS Variables** 实现主题系统，支持亮色/暗色主题切换和完全自定义。

#### 基础用法

```typescript
import { applyTheme } from '@workspace/chat-ui-components';

const chatContainer = document.getElementById('chat');

// 应用亮色主题
applyTheme(chatContainer, 'light');

// 应用暗色主题
applyTheme(chatContainer, 'dark');

// 跟随系统主题
applyTheme(chatContainer, 'auto');
```

#### 自定义主题颜色

```typescript
import { applyTheme, customizeTheme } from '@workspace/chat-ui-components';

// 先应用基础主题
applyTheme(chatContainer, 'light');

// 然后自定义特定颜色
customizeTheme(chatContainer, {
  primary: '#9333ea',
  primaryHover: '#7e22ce',
  userMessageBackground: '#9333ea',
  assistantMessageBackground: '#f3e8ff',
  assistantMessageText: '#6b21a8',
});
```

#### 监听系统主题变化

```typescript
import { watchSystemTheme } from '@workspace/chat-ui-components';

const cleanup = watchSystemTheme(chatContainer, (isDark) => {
  console.log('系统主题变化:', isDark ? '暗色' : '亮色');
  applyTheme(chatContainer, isDark ? 'dark' : 'light');
});

// 清理监听器
cleanup();
```

#### 可用的主题变量

所有主题变量都以 `--chat-` 前缀命名，你也可以直接在 CSS 中覆盖：

```css
chat-container {
  --chat-primary: #ff0000;
  --chat-user-msg-bg: #ff0000;
  --chat-header-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

完整的主题变量列表：

| 变量名 | 说明 | 默认值（亮色） | 默认值（暗色） |
|--------|------|---------------|---------------|
| `--chat-primary` | 主色调 | `#007bff` | `#1e88e5` |
| `--chat-primary-hover` | 主色调悬停 | `#0056b3` | `#1565c0` |
| `--chat-background` | 背景色 | `#ffffff` | `#1a1a1a` |
| `--chat-container-bg` | 容器背景 | `#ffffff` | `#2d2d2d` |
| `--chat-header-bg` | 头部背景 | `#007bff` | `#1e88e5` |
| `--chat-text-primary` | 主文字颜色 | `#333333` | `#e0e0e0` |
| `--chat-text-secondary` | 次要文字颜色 | `#666666` | `#b0b0b0` |
| `--chat-text-on-primary` | 主色上的文字 | `#ffffff` | `#ffffff` |
| `--chat-user-msg-bg` | 用户消息背景 | `#007bff` | `#1e88e5` |
| `--chat-user-msg-text` | 用户消息文字 | `#ffffff` | `#ffffff` |
| `--chat-assistant-msg-bg` | AI 消息背景 | `#f1f3f5` | `#3a3a3a` |
| `--chat-assistant-msg-text` | AI 消息文字 | `#333333` | `#e0e0e0` |
| `--chat-input-bg` | 输入框背景 | `#ffffff` | `#3a3a3a` |
| `--chat-input-border` | 输入框边框 | `#cccccc` | `#4a4a4a` |
| `--chat-input-border-focus` | 输入框焦点边框 | `#007bff` | `#1e88e5` |
| `--chat-input-text` | 输入框文字 | `#333333` | `#e0e0e0` |
| `--chat-input-placeholder` | 输入框占位符 | `#999999` | `#888888` |
| `--chat-border` | 边框 | `#e0e0e0` | `#4a4a4a` |
| `--chat-divider` | 分隔线 | `#e0e0e0` | `#4a4a4a` |
| `--chat-button-disabled-bg` | 禁用按钮背景 | `#cccccc` | `#4a4a4a` |
| `--chat-button-disabled-text` | 禁用按钮文字 | `#888888` | `#888888` |

## 开发

### 组件库开发模式

```bash
cd packages/chat-ui-components
pnpm dev
```

### 添加新组件

1. 在 `packages/chat-ui-components/src/components/` 创建组件文件
2. 在 `packages/chat-ui-components/src/index.ts` 中导出组件
3. 运行 `pnpm build` 构建

## License

ISC
