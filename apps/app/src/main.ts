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

// 颜色选择器逻辑
const colorPicker = document.getElementById("colorPicker") as HTMLElement;
const primaryColorInput = document.getElementById("primaryColor") as HTMLInputElement;
const primaryColorText = document.getElementById("primaryColorText") as HTMLInputElement;
const primaryHoverColorInput = document.getElementById("primaryHoverColor") as HTMLInputElement;
const primaryHoverColorText = document.getElementById("primaryHoverColorText") as HTMLInputElement;
const userMsgBgColorInput = document.getElementById("userMsgBgColor") as HTMLInputElement;
const userMsgBgColorText = document.getElementById("userMsgBgColorText") as HTMLInputElement;
const assistantMsgBgColorInput = document.getElementById("assistantMsgBgColor") as HTMLInputElement;
const assistantMsgBgColorText = document.getElementById("assistantMsgBgColorText") as HTMLInputElement;

// 预设主题配置
const presetThemes = {
  purple: {
    primary: "#9333ea",
    primaryHover: "#7e22ce",
    userMessageBackground: "#9333ea",
    assistantMessageBackground: "#f3e8ff",
  },
  orange: {
    primary: "#f5a623",
    primaryHover: "#cb7f16",
    userMessageBackground: "#f5a623",
    assistantMessageBackground: "#fff7e8",
  },
  blue: {
    primary: "#3491fa",
    primaryHover: "#206ccf",
    userMessageBackground: "#3491fa",
    assistantMessageBackground: "#e8f7ff",
  },
  green: {
    primary: "#00b42a",
    primaryHover: "#009a29",
    userMessageBackground: "#00b42a",
    assistantMessageBackground: "#e8ffea",
  },
  pink: {
    primary: "#f5319d",
    primaryHover: "#cb1e83",
    userMessageBackground: "#f5319d",
    assistantMessageBackground: "#ffe8f1",
  },
  red: {
    primary: "#f53f3f",
    primaryHover: "#cb272d",
    userMessageBackground: "#f53f3f",
    assistantMessageBackground: "#ffece8",
  },
};

// 应用自定义主题
function applyCustomTheme() {
  applyTheme(chatContainer, "light");
  customizeTheme(chatContainer, {
    primary: primaryColorInput.value,
    primaryHover: primaryHoverColorInput.value,
    headerBackground: `linear-gradient(135deg, ${primaryColorInput.value} 0%, ${primaryHoverColorInput.value} 100%)`,
    userMessageBackground: userMsgBgColorInput.value,
    assistantMessageBackground: assistantMsgBgColorInput.value,
    assistantMessageText: "#333333",
  });
}

// 同步颜色选择器和文本输入框
function syncColorInputs(colorInput: HTMLInputElement, textInput: HTMLInputElement) {
  colorInput.addEventListener("input", () => {
    textInput.value = colorInput.value;
    applyCustomTheme();
  });

  textInput.addEventListener("input", () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
      colorInput.value = textInput.value;
      applyCustomTheme();
    }
  });
}

syncColorInputs(primaryColorInput, primaryColorText);
syncColorInputs(primaryHoverColorInput, primaryHoverColorText);
syncColorInputs(userMsgBgColorInput, userMsgBgColorText);
syncColorInputs(assistantMsgBgColorInput, assistantMsgBgColorText);

// 预设主题按钮点击事件
const presetButtons = document.querySelectorAll(".preset-btn");
presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = (btn as HTMLElement).getAttribute("data-preset") as keyof typeof presetThemes;
    const theme = presetThemes[preset];

    primaryColorInput.value = theme.primary;
    primaryColorText.value = theme.primary;
    primaryHoverColorInput.value = theme.primaryHover;
    primaryHoverColorText.value = theme.primaryHover;
    userMsgBgColorInput.value = theme.userMessageBackground;
    userMsgBgColorText.value = theme.userMessageBackground;
    assistantMsgBgColorInput.value = theme.assistantMessageBackground;
    assistantMsgBgColorText.value = theme.assistantMessageBackground;

    applyCustomTheme();
  });
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
      // 显示颜色选择器
      colorPicker.classList.add("active");

      // 应用自定义主题
      applyCustomTheme();

      // 更新页面背景
      document.body.classList.remove("dark-mode");

      currentTheme = "light";
    } else if (theme === "auto") {
      // 隐藏颜色选择器
      colorPicker.classList.remove("active");
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
      // 隐藏颜色选择器
      colorPicker.classList.remove("active");

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
