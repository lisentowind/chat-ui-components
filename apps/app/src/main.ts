import {
  applyTheme,
  customizeTheme,
  watchSystemTheme,
  ChatProvider,
  ChatBubble,
  ChatSender,
  ChatWelcome,
  showNotification,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "@workspace/chat-ui-components";
import type { ThemeMode, XMessage } from "@workspace/chat-ui-components";

// 设置 Chat Provider
const chatProvider = document.createElement("chat-provider") as ChatProvider;
chatProvider.config = {
  theme: {
    mode: "light",
    customColors: {
      primary: "#007bff",
      primaryHover: "#0056b3",
      thinking: "#8b5cf6",
      thinkingBg: "#f3e8ff",
      sourceBorder: "#e5e7eb",
      sourceBg: "#f9fafb",
      codeBg: "#f3f4f6",
      codeBorder: "#e5e7eb",
      "notification-success-bg": "#f0f9ff",
      "notification-success-text": "#0c4a6e",
      "notification-success-border": "#7dd3fc",
      "notification-error-bg": "#fef2f2",
      "notification-error-text": "#991b1b",
      "notification-error-border": "#fca5a5",
      "notification-warning-bg": "#fffbeb",
      "notification-warning-text": "#92400e",
      "notification-warning-border": "#fcd34d",
      "notification-info-bg": "#f0f9ff",
      "notification-info-text": "#075985",
      "notification-info-border": "#7dd3fc",
    },
  },
  locale: {
    locale: "zh-CN",
    messages: {
      welcome_title: "欢迎使用 Chat UI 聊天组件",
      welcome_subtitle:
        "体验全新的 AI 聊天界面，支持多种消息类型、主题定制和国际化",
      feature_chat: "智能对话",
      feature_chat_desc: "支持文本、图片、文件等多种消息格式",
      feature_thinking: "深度思考",
      feature_thinking_desc: "展示 AI 的完整思考过程",
      feature_files: "文件处理",
      feature_files_desc: "拖拽上传、进度显示、文件预览",
      feature_themes: "主题系统",
      feature_themes_desc: "亮色/暗色主题，支持自定义配色",
      suggestion_hello: "你好，介绍一下自己",
      suggestion_help: "展示思考过程",
      suggestion_weather: "上传一个文件",
      suggestion_code: "切换到暗色主题",
      action_start: "开始聊天",
      action_learn: "查看文档",
      stat_availability: "全天候服务",
      stat_users: "活跃用户",
      stat_uptime: "99.9%可用",
      send: "发送",
      typing: "正在输入...",
      retry: "重试",
      copy: "复制",
      delete: "删除",
      uploading: "上传中...",
      upload_failed: "上传失败",
      thinking: "思考中...",
      error_occurred: "发生错误",
      network_error: "网络错误",
      file_too_large: "文件过大",
      unsupported_file: "不支持的文件类型",
    },
  },
  bubble: {
    showAvatar: true,
    showTimestamp: true,
    showStatus: true,
    enableCopy: true,
    enableRetry: true,
    enableDelete: true,
  },
  sender: {
    maxLength: 1000,
    placeholder: "请输入您的消息...",
    enableAttachments: true,
    enableVoice: false,
  },
  notifications: {
    position: "top-right",
    maxCount: 5,
    duration: 4500,
  },
};

document.body.appendChild(chatProvider);

// 创建应用容器
const app = document.getElementById("app")!;
app.innerHTML = `
  <div class="demo-container">
    <!-- 头部控制区 -->
    <header class="demo-header">
      <h1>🎨 Chat UI 聊天组件演示</h1>
      <div class="theme-controls">
        <button class="btn" data-theme="light">☀️ 亮色</button>
        <button class="btn" data-theme="dark">🌙 暗色</button>
        <button class="btn" data-theme="auto">🔄 跟随系统</button>
        <button class="btn" data-theme="custom">🎨 自定义</button>
      </div>
      <div class="feature-controls">
        <button class="btn" id="showWelcome">🏠 欢迎页</button>
        <button class="btn" id="showChat">💬 聊天界面</button>
        <button class="btn" id="showNotifications">🔔 通知演示</button>
        <button class="btn" id="clearChat">🗑️ 清空</button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="demo-main" id="demoContent">
      <!-- 默认显示欢迎页 -->
    </main>
  </div>
`;

// 添加样式
const style = document.createElement("style");
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    transition: background 0.3s ease;
  }

  body.dark-mode {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .demo-header {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }

  .dark-mode .demo-header {
    background: rgba(30, 30, 46, 0.95);
    color: white;
  }

  .demo-header h1 {
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
    color: #333;
  }

  .dark-mode .demo-header h1 {
    color: white;
  }

  .theme-controls, .feature-controls {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background: #007bff;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn.active {
    background: #28a745;
  }

  .demo-main {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 20px;
    flex: 1;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .dark-mode .demo-main {
    background: rgba(30, 30, 46, 0.95);
  }

  .chat-container {
    height: 600px;
    display: flex;
    flex-direction: column;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: var(--chat-container-bg, #ffffff);
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .dark-mode .messages-container {
    background: var(--chat-container-bg-dark, #2d3748);
  }

  .welcome-demo {
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notification-demo {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .notification-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    width: 100%;
    max-width: 500px;
  }

  @media (max-width: 768px) {
    .demo-container {
      padding: 12px;
    }

    .demo-header {
      padding: 16px;
    }

    .demo-header h1 {
      font-size: 20px;
    }

    .theme-controls, .feature-controls {
      gap: 8px;
    }

    .btn {
      padding: 6px 12px;
      font-size: 12px;
    }

    .chat-container {
      height: 500px;
    }
  }
`;
document.head.appendChild(style);

// 应用状态管理
let currentView: "welcome" | "chat" | "notifications" = "welcome";
let messages: XMessage[] = [];
let currentTheme: ThemeMode = "light";
let systemThemeWatcher: (() => void) | null = null;

// 显示欢迎页面
function showWelcome() {
  currentView = "welcome";
  const demoContent = document.getElementById("demoContent")!;

  // 创建 ChatWelcome 元素并设置属性
  const welcome = document.createElement("chat-welcome") as ChatWelcome;
  welcome.setAttribute("showStats", "true");
  welcome.setAttribute(
    "avatar",
    "https://api.dicebear.com/7.x/png?seed=ai-assistant"
  );

  // 设置 suggestions 和 actions 属性
  welcome.suggestions = [
    { text: "你好，介绍一下自己", icon: "👋" },
    { text: "展示思考过程", icon: "🧠" },
    { text: "上传一个文件", icon: "📎" },
    { text: "切换到暗色主题", icon: "🎨" },
  ];

  welcome.actions = [
    {
      text: "开始聊天",
      icon: "✨",
      type: "primary",
      action: "start-chat",
    },
    {
      text: "查看通知",
      icon: "🔔",
      type: "secondary",
      action: "learn-more",
    },
  ];

  demoContent.innerHTML = `<div class="welcome-demo"></div>`;
  demoContent.querySelector(".welcome-demo")?.appendChild(welcome);

  // 监听欢迎页事件
  const welcomeElement = demoContent.querySelector(
    "chat-welcome"
  ) as ChatWelcome;
  welcomeElement.addEventListener("suggestion-click", (e: any) => {
    const { suggestion } = e.detail;

    if (suggestion.text.includes("介绍自己")) {
      showChat();
      setTimeout(() => {
        addMessage({
          role: "assistant",
          content:
            "你好！我是 Chat UI 助手，基于最新的 Web 技术构建的智能聊天界面。我支持：\n\n💬 多种消息类型（文本、图片、文件）\n🧠 展示思考过程\n📎 文件上传处理\n🎨 主题定制\n🌍 国际化支持\n\n让我为您演示一下思考过程吧！",
          type: "markdown",
        });

        // 模拟思考过程
        showThinkingProcess();
      }, 500);
    } else if (suggestion.text.includes("思考")) {
      showChat();
      showThinkingProcess();
    } else if (suggestion.text.includes("文件")) {
      showChat();
      showInfo("请使用输入框的附件按钮上传文件", "文件上传");
    } else if (suggestion.text.includes("暗色")) {
      document
        .querySelector('[data-theme="dark"]')
        ?.dispatchEvent(new MouseEvent("click"));
    }
  });

  welcomeElement.addEventListener("action-click", (e: any) => {
    const { action } = e.detail;

    if (action.action === "start-chat") {
      showChat();
    } else if (action.action === "learn-more") {
      showNotifications();
    }
  });
}

// 显示聊天界面
function showChat() {
  currentView = "chat";
  const demoContent = document.getElementById("demoContent")!;

  demoContent.innerHTML = `
    <div class="chat-container">
      <div class="messages-container" id="messagesContainer"></div>
      <div id="senderContainer"></div>
    </div>
  `;

  // 创建发送器
  const senderContainer = document.getElementById("senderContainer")!;
  const sender = document.createElement("chat-sender") as ChatSender;
  sender.suggestions = [
    "你好，介绍一下自己",
    "展示思考过程",
    "生成一段代码",
    "帮我分析这个文件",
    "今天的天气怎么样",
  ];
  senderContainer.appendChild(sender);

  // 监听发送事件
  sender.addEventListener("send", (e: any) => {
    const { message } = e.detail;

    // 添加用户消息
    addMessage({
      role: "user",
      content: message.content || "",
      type: message.type || "text",
      files: message.files || [],
    });

    // 模拟AI响应
    setTimeout(() => {
      handleAIResponse(message.content || "");
    }, 1000);
  });

  // 监听文件添加事件
  sender.addEventListener("files-add", (e: any) => {
    const { files } = e.detail;
    showSuccess(`已添加 ${files.length} 个文件`, "文件上传");
  });

  // 渲染现有消息
  renderMessages();
}

// 显示通知演示
function showNotifications() {
  currentView = "notifications";
  const demoContent = document.getElementById("demoContent")!;

  demoContent.innerHTML = `
    <div class="notification-demo">
      <h2>🔔 通知系统演示</h2>
      <div class="notification-buttons">
        <button class="btn notification-btn" data-type="success">✅ 成功通知</button>
        <button class="btn notification-btn" data-type="error">❌ 错误通知</button>
        <button class="btn notification-btn" data-type="warning">⚠️ 警告通知</button>
        <button class="btn notification-btn" data-type="info">ℹ️ 信息通知</button>
        <button class="btn notification-btn" data-type="custom">🎨 自定义通知</button>
      </div>
    </div>
  `;

  // 监听通知按钮点击
  document.querySelectorAll(".notification-btn").forEach((btn) => {
    btn.addEventListener("click", (e: any) => {
      const type = e.target.dataset.type;

      switch (type) {
        case "success":
          showSuccess("操作成功完成！", "成功");
          break;
        case "error":
          showError("发生了错误，请重试", "错误");
          break;
        case "warning":
          showWarning("请注意检查输入内容", "警告");
          break;
        case "info":
          showInfo("这是一条信息通知", "信息");
          break;
        case "custom":
          showNotification({
            type: "info",
            title: "自定义通知",
            message: "这是带有操作按钮的通知",
            actionText: "查看详情",
            duration: 6000,
          });
          break;
      }
    });
  });
}

// 添加消息
function addMessage(message: XMessage) {
  message.id = Math.random().toString(36).substr(2, 9);
  message.timestamp = Date.now();
  messages.push(message);
  renderMessages();
}

// 渲染消息
function renderMessages() {
  const container = document.getElementById("messagesContainer");
  if (!container) return;

  container.innerHTML = "";

  messages.forEach((message) => {
    const bubble = document.createElement("chat-bubble") as ChatBubble;
    bubble.message = message;
    container.appendChild(bubble);
  });

  // 滚动到底部
  container.scrollTop = container.scrollHeight;
}

// 模拟思考过程
function showThinkingProcess() {
  const thinkingMessage: XMessage = {
    id: Math.random().toString(36).substr(2, 9),
    role: "assistant",
    content: "",
    type: "thinking",
    thinking: "正在分析您的问题...",
    timestamp: Date.now(),
  };

  messages.push(thinkingMessage);
  renderMessages();

  // 模拟思考步骤
  const steps = [
    "正在分析您的问题...",
    "查找相关信息...",
    "整理答案结构...",
    "生成回复内容...",
  ];

  let stepIndex = 0;
  const thinkingInterval = setInterval(() => {
    if (stepIndex < steps.length) {
      thinkingMessage.thinking = steps[stepIndex];
      renderMessages();
      stepIndex++;
    } else {
      clearInterval(thinkingInterval);

      // 移除思考消息，添加最终回复
      messages = messages.filter((m) => m.id !== thinkingMessage.id);
      addMessage({
        role: "assistant",
        content: `思考完成！这就是我的分析过程。我通过以下步骤来回答您的问题：\n\n1. **理解问题**：分析您的具体需求\n2. **信息检索**：查找相关知识\n3. **逻辑推理**：构建答案框架\n4. **语言组织**：生成清晰的回复\n\n这样的思考过程让您了解我是如何工作的，也能帮助我提供更准确的答案。`,
        type: "markdown",
      });
    }
  }, 1500);
}

// 处理AI响应
function handleAIResponse(userInput: string) {
  const responses = [
    {
      content: `我收到了您的消息："${userInput}"。让我为您详细解答这个问题。`,
      type: "text",
    },
    {
      content:
        '# 代码示例\n\n```javascript\nfunction hello() {\n  console.log("Hello, Chat UI!");\n}\n```\n\n这是一个简单的JavaScript函数示例。Chat UI 支持语法高亮显示。',
      type: "markdown",
    },
    {
      content: "这是我的回复内容。",
      type: "text",
      sources: [
        { id: "1", title: "官方文档", url: "#", type: "web" },
        { id: "2", title: "技术博客", url: "#", type: "web" },
      ],
    },
    {
      content: "这是一个文件类型的消息示例。",
      type: "file",
      files: [
        {
          id: "1",
          name: "example.pdf",
          url: "#",
          size: 1024000,
          type: "application/pdf",
          status: "completed",
        },
        {
          id: "2",
          name: "data.json",
          url: "#",
          size: 512,
          type: "application/json",
          status: "completed",
        },
      ],
    },
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];
  addMessage(response as XMessage);
}

// 主题切换逻辑
document.querySelectorAll(".btn[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = (button as HTMLElement).getAttribute(
      "data-theme"
    ) as ThemeMode;

    // 更新按钮状态
    document
      .querySelectorAll(".btn[data-theme]")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // 清理之前的系统主题监听
    if (systemThemeWatcher) {
      systemThemeWatcher();
      systemThemeWatcher = null;
    }

    if (theme === "custom") {
      // 自定义主题
      applyTheme(document.body, "light");
      customizeTheme(document.body, {
        primary: "#9333ea",
        primaryHover: "#7e22ce",
        userMessageBackground: "#9333ea",
        assistantMessageBackground: "#f3e8ff",
        assistantMessageText: "#6b21a8",
        thinking: "#a78bfa",
        thinkingBg: "#4c1d95",
      });
      document.body.classList.remove("dark-mode");
      currentTheme = "light";

      showInfo("已切换到自定义紫色主题", "主题切换");
    } else if (theme === "auto") {
      // 跟随系统
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(document.body, "auto");

      if (prefersDark) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      // 监听系统主题变化
      systemThemeWatcher = watchSystemTheme(document.body, (isDark) => {
        applyTheme(document.body, isDark ? "dark" : "light");
        if (isDark) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      });

      currentTheme = "auto";
      showInfo("已切换到跟随系统主题", "主题切换");
    } else {
      // 亮色或暗色主题
      applyTheme(document.body, theme);

      if (theme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      currentTheme = theme;
      showInfo(`已切换到${theme === "dark" ? "暗色" : "亮色"}主题`, "主题切换");
    }
  });
});

// 功能按钮事件
document.getElementById("showWelcome")?.addEventListener("click", () => {
  showWelcome();
  showSuccess("已切换到欢迎页面", "页面切换");
});

document.getElementById("showChat")?.addEventListener("click", () => {
  showChat();
  showSuccess("已切换到聊天界面", "页面切换");
});

document.getElementById("showNotifications")?.addEventListener("click", () => {
  showNotifications();
  showSuccess("已切换到通知演示", "页面切换");
});

document.getElementById("clearChat")?.addEventListener("click", () => {
  messages = [];
  if (currentView === "chat") {
    renderMessages();
  }
  showWarning("聊天记录已清空", "操作完成");
});

// 初始化显示欢迎页
showWelcome();

// 监听键盘快捷键
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        showWelcome();
        break;
      case "2":
        e.preventDefault();
        showChat();
        break;
      case "3":
        e.preventDefault();
        showNotifications();
        break;
      case "d":
        e.preventDefault();
        document
          .querySelector('[data-theme="dark"]')
          ?.dispatchEvent(new MouseEvent("click"));
        break;
      case "l":
        e.preventDefault();
        document
          .querySelector('[data-theme="light"]')
          ?.dispatchEvent(new MouseEvent("click"));
        break;
    }
  }
});

// 输出到控制台
console.log("🎨 Chat UI 聊天组件演示已加载");
console.log("📋 功能特性：");
console.log("  • ChatBubble - 升级版消息气泡，支持多种消息类型");
console.log("  • ChatSender - 升级版输入框，支持文件上传和快捷操作");
console.log("  • ChatWelcome - 欢迎页面，支持自定义内容和操作");
console.log("  • ChatNotification - 系统通知，支持多种类型和位置");
console.log("  • ChatProvider - 全局配置中心，支持主题和国际化");
console.log("⌨️ 快捷键：");
console.log("  • Ctrl+1: 欢迎页面");
console.log("  • Ctrl+2: 聊天界面");
console.log("  • Ctrl+3: 通知演示");
console.log("  • Ctrl+D: 切换暗色主题");
console.log("  • Ctrl+L: 切换亮色主题");
