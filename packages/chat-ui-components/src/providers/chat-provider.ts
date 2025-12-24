import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import mitt from "mitt";
import type { XProviderConfig, XEvents } from "../types/x";

// 默认配置
const defaultConfig: XProviderConfig = {
  theme: {
    mode: "light",
  },
  locale: {
    locale: "zh-CN",
    messages: {},
  },
  notifications: {
    position: "top-right",
    maxCount: 5,
    duration: 4500,
  },
  sender: {
    maxLength: 4000,
    placeholder: "请输入消息...",
    enableAttachments: true,
    enableVoice: false,
  },
  bubble: {
    showAvatar: true,
    showTimestamp: true,
    showStatus: true,
    enableCopy: true,
    enableRetry: true,
    enableDelete: true,
  },
};

// 默认国际化消息
const defaultMessages: Record<string, Record<string, string>> = {
  "zh-CN": {
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
  "en-US": {
    send: "Send",
    typing: "Typing...",
    retry: "Retry",
    copy: "Copy",
    delete: "Delete",
    uploading: "Uploading...",
    upload_failed: "Upload failed",
    thinking: "Thinking...",
    error_occurred: "An error occurred",
    network_error: "Network error",
    file_too_large: "File too large",
    unsupported_file: "Unsupported file type",
  },
};

/**
 * ChatProvider - 全局配置中心
 * 提供主题、国际化、全局配置等功能
 */
export class ChatProvider extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
  `;

  @property({ type: Object })
  config: XProviderConfig = {};

  @state()
  private _currentConfig: XProviderConfig = { ...defaultConfig };

  @state()
  private _currentTheme: string = "light";

  @state()
  private _currentLocale: string = "zh-CN";

  // 事件总线
  public eventBus: ReturnType<typeof mitt<XEvents>> = mitt<XEvents>();

  // 全局单例
  private static _instance: ChatProvider | null = null;

  static get instance(): ChatProvider | null {
    return this._instance;
  }

  connectedCallback() {
    super.connectedCallback();

    // 设置全局实例
    ChatProvider._instance = this;

    // 合并配置
    this._currentConfig = this._mergeConfig(defaultConfig, this.config);

    // 应用主题
    this._applyTheme(this._currentConfig.theme?.mode || "light");

    // 应用国际化
    this._applyLocale(this._currentConfig.locale?.locale || "zh-CN");

    // 监听系统主题变化
    if (this._currentConfig.theme?.mode === "auto") {
      this._watchSystemTheme();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    ChatProvider._instance = null;
    this.eventBus.all.clear();
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<XProviderConfig>) {
    this._currentConfig = this._mergeConfig(this._currentConfig, newConfig);
    this.config = this._currentConfig;

    // 应用主题变化
    if (newConfig.theme?.mode) {
      this._applyTheme(newConfig.theme.mode);
      this.eventBus.emit("theme-change", { theme: newConfig.theme.mode });
    }

    // 应用国际化变化
    if (newConfig.locale?.locale) {
      this._applyLocale(newConfig.locale.locale);
      this.eventBus.emit("locale-change", { locale: newConfig.locale.locale });
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): XProviderConfig {
    return { ...this._currentConfig };
  }

  /**
   * 获取国际化文本
   */
  t(key: string, fallback?: string): string {
    const messages = this._currentConfig.locale?.messages || {};
    const defaultLocaleMessages = defaultMessages[this._currentLocale] || {};

    return messages[key] || defaultLocaleMessages[key] || fallback || key;
  }

  /**
   * 切换主题
   */
  setTheme(mode: "light" | "dark" | "auto") {
    this.updateConfig({
      theme: { ...this._currentConfig.theme, mode },
    });
  }

  /**
   * 切换语言
   */
  setLocale(locale: string, messages?: Record<string, string>) {
    this.updateConfig({
      locale: { locale, messages: messages || {} },
    });
  }

  /**
   * 自定义主题颜色
   */
  customizeTheme(colors: Record<string, string>) {
    this.updateConfig({
      theme: {
        ...this._currentConfig.theme,
        customColors: {
          ...this._currentConfig.theme?.customColors,
          ...colors,
        },
      },
    });
    this._applyCustomColors(colors);
  }

  private _mergeConfig(
    defaultConfig: XProviderConfig,
    newConfig: XProviderConfig
  ): XProviderConfig {
    return {
      theme: { ...defaultConfig.theme, ...newConfig.theme },
      locale: {
        locale:
          newConfig.locale?.locale || defaultConfig.locale?.locale || "zh-CN",
        messages: {
          ...defaultConfig.locale?.messages,
          ...newConfig.locale?.messages,
        },
      },
      notifications: {
        ...defaultConfig.notifications,
        ...newConfig.notifications,
      },
      sender: { ...defaultConfig.sender, ...newConfig.sender },
      bubble: { ...defaultConfig.bubble, ...newConfig.bubble },
    };
  }

  private _applyTheme(mode: string) {
    this._currentTheme = mode;

    if (mode === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      this._applyThemeToDocument(prefersDark ? "dark" : "light");
    } else {
      this._applyThemeToDocument(mode as "light" | "dark");
    }
  }

  private _applyThemeToDocument(theme: "light" | "dark") {
    document.documentElement.setAttribute("data-chat-theme", theme);

    // 应用预设主题变量
    const themeVars = this._getThemeVariables(theme);
    Object.entries(themeVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--chat-${key}`, value);
    });
  }

  private _getThemeVariables(theme: "light" | "dark"): Record<string, string> {
    const lightTheme = {
      // 基础主题变量
      primary: "#007bff",
      "primary-hover": "#0056b3",
      background: "#ffffff",
      "container-bg": "#ffffff",
      "header-bg": "#007bff",
      "text-primary": "#333333",
      "text-secondary": "#666666",
      "text-on-primary": "#ffffff",
      border: "#e0e0e0",
      divider: "#e0e0e0",

      // 消息气泡
      "user-msg-bg": "#007bff",
      "user-msg-text": "#ffffff",
      "assistant-msg-bg": "#f1f3f5",
      "assistant-msg-text": "#333333",

      // 输入框
      "input-bg": "#ffffff",
      "input-border": "#cccccc",
      "input-border-focus": "#007bff",
      "input-text": "#333333",
      "input-placeholder": "#999999",

      // 按钮
      "button-disabled-bg": "#cccccc",
      "button-disabled-text": "#888888",

      // 思考过程和代码块
      thinking: "#8b5cf6",
      "thinking-bg": "#f3e8ff",
      "code-bg": "#f3f4f6",
      "code-border": "#e5e7eb",
      "source-border": "#e5e7eb",
      "source-bg": "#f9fafb",

      // 通知系统
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
    };

    const darkTheme = {
      // 基础主题变量
      primary: "#1e88e5",
      "primary-hover": "#1565c0",
      background: "#1a1a1a",
      "container-bg": "#2d2d2d",
      "header-bg": "#1e88e5",
      "text-primary": "#e0e0e0",
      "text-secondary": "#b0b0b0",
      "text-on-primary": "#ffffff",
      border: "#4a4a4a",
      divider: "#4a4a4a",

      // 消息气泡
      "user-msg-bg": "#1e88e5",
      "user-msg-text": "#ffffff",
      "assistant-msg-bg": "#3a3a3a",
      "assistant-msg-text": "#e0e0e0",

      // 输入框
      "input-bg": "#3a3a3a",
      "input-border": "#4a4a4a",
      "input-border-focus": "#1e88e5",
      "input-text": "#e0e0e0",
      "input-placeholder": "#888888",

      // 按钮
      "button-disabled-bg": "#4a4a4a",
      "button-disabled-text": "#888888",

      // 思考过程和代码块
      thinking: "#a78bfa",
      "thinking-bg": "#4c1d95",
      "code-bg": "#2d3748",
      "code-border": "#4a5568",
      "source-border": "#4a5568",
      "source-bg": "#2d3748",

      // 通知系统
      "notification-success-bg": "#065f46",
      "notification-success-text": "#6ee7b7",
      "notification-success-border": "#34d399",
      "notification-error-bg": "#7f1d1d",
      "notification-error-text": "#f87171",
      "notification-error-border": "#ef4444",
      "notification-warning-bg": "#78350f",
      "notification-warning-text": "#fbbf24",
      "notification-warning-border": "#f59e0b",
      "notification-info-bg": "#1c3a5e",
      "notification-info-text": "#7dd3fc",
      "notification-info-border": "#60a5fa",
    };

    return theme === "dark" ? darkTheme : lightTheme;
  }

  private _applyCustomColors(colors: Record<string, string>) {
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--chat-${key}`, value);
    });
  }

  private _applyLocale(locale: string) {
    this._currentLocale = locale;
    document.documentElement.setAttribute("lang", locale);
  }

  private _watchSystemTheme() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (this._currentConfig.theme?.mode === "auto") {
        this._applyThemeToDocument(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // 清理函数会在 disconnectedCallback 中调用
    this._cleanupMediaQuery = () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }

  private _cleanupMediaQuery?: () => void;

  render() {
    return html``; // Provider 组件不渲染任何内容
  }
}

// 自定义元素注册
if (!customElements.get("chat-provider")) {
  customElements.define("chat-provider", ChatProvider);
}

// 便捷函数
export function getChatProvider(): ChatProvider | null {
  return ChatProvider.instance;
}

export function t(key: string, fallback?: string): string {
  const provider = getChatProvider();
  return provider?.t(key, fallback) || fallback || key;
}
