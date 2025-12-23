import {
  applyTheme,
  customizeTheme,
  watchSystemTheme,
} from "@workspace/chat-ui-components";
import type { Message, ThemeMode } from "@workspace/chat-ui-components";

const chatContainer = document.getElementById("chat") as HTMLElement;

// 初始化消息
const messages: Message[] = [
  {
    sender: "assistant",
    content: "你好！我是AI助手，有什么可以帮助你的吗？尝试切换主题看看效果！",
  },
];

(chatContainer as any).messages = messages;
(chatContainer as any).title = "AI 聊天助手";

// 应用默认主题（亮色）
applyTheme(chatContainer, "light");

// 监听消息发送事件
chatContainer.addEventListener("message-sent", (e: Event) => {
  const customEvent = e as CustomEvent;
  const userMessage = customEvent.detail.message;

  // 添加用户消息
  messages.push({
    sender: "user",
    content: userMessage,
  });

  (chatContainer as any).messages = [...messages];

  // 模拟AI响应
  setTimeout(() => {
    messages.push({
      sender: "assistant",
      content: `你说："${userMessage}"。这是一个演示响应。当前主题：${
        chatContainer.getAttribute("data-theme") || "light"
      }`,
    });

    (chatContainer as any).messages = [...messages];
  }, 500);
});

// 主题切换逻辑
const buttons = document.querySelectorAll(".btn[data-theme]");
let currentTheme: ThemeMode = "light";
let systemThemeWatcher: (() => void) | null = null;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = (button as HTMLElement).getAttribute(
      "data-theme"
    ) as ThemeMode;

    // 更新按钮状态
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // 清理之前的系统主题监听
    if (systemThemeWatcher) {
      systemThemeWatcher();
      systemThemeWatcher = null;
    }

    if (theme === "custom") {
      // 自定义主题示例：紫色渐变
      applyTheme(chatContainer, "light");
      customizeTheme(chatContainer, {
        primary: "#9333ea",
        primaryHover: "#7e22ce",
        headerBackground: "linear-gradient(135deg, #9333ea 0%, #c026d3 100%)",
        userMessageBackground: "#9333ea",
        assistantMessageBackground: "#f3e8ff",
        assistantMessageText: "#6b21a8",
      });

      // 更新页面背景
      // document.body.style.background =
      //   "linear-gradient(135deg, #9333ea 0%, #c026d3 100%)";
      document.body.classList.remove("dark-mode");

      currentTheme = "light";
    } else if (theme === "auto") {
      // 跟随系统
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      applyTheme(chatContainer, "auto");

      // 更新页面背景
      if (prefersDark) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      // 监听系统主题变化
      systemThemeWatcher = watchSystemTheme(chatContainer, (isDark) => {
        applyTheme(chatContainer, isDark ? "dark" : "light");
        if (isDark) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      });

      currentTheme = "auto";
    } else {
      // 亮色或暗色主题
      applyTheme(chatContainer, theme);

      // 更新页面背景
      if (theme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      currentTheme = theme;
    }
  });
});

// 输出到控制台，方便开发者查看 API
console.log("Chat UI Components 已加载");
console.log("可用的主题 API：", {
  applyTheme,
  customizeTheme,
  watchSystemTheme,
});
console.log('示例：customizeTheme(chatContainer, { primary: "#ff0000" })');
