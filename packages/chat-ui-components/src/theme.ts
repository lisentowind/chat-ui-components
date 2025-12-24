import type { ThemeColors, ThemeMode } from "./types";

// 默认亮色主题
export const defaultLightTheme: Required<ThemeColors> = {
  // 主色调
  primary: "#007bff",
  primaryHover: "#0056b3",

  // 背景色
  background: "#ffffff",
  containerBackground: "#ffffff",
  headerBackground: "#007bff",

  // 文字颜色
  textPrimary: "#333333",
  textSecondary: "#666666",
  textOnPrimary: "#ffffff",

  // 用户消息气泡
  userMessageBackground: "#007bff",
  userMessageText: "#ffffff",

  // AI 消息气泡
  assistantMessageBackground: "#f1f3f5",
  assistantMessageText: "#333333",

  // 输入框
  inputBackground: "#ffffff",
  inputBorder: "#cccccc",
  inputBorderFocus: "#007bff",
  inputText: "#333333",
  inputPlaceholder: "#999999",

  // 边框和分隔线
  border: "#e0e0e0",
  divider: "#e0e0e0",

  // 按钮
  buttonDisabledBackground: "#cccccc",
  buttonDisabledText: "#888888",

  // 思考过程
  thinking: "#8b5cf6",
  thinkingBg: "#f3e8ff",

  // 代码块
  codeBg: "#f3f4f6",
  codeBorder: "#e5e7eb",

  // 来源引用
  sourceBorder: "#e5e7eb",
  sourceBg: "#f9fafb",

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

// 默认暗色主题
export const defaultDarkTheme: Required<ThemeColors> = {
  // 主色调
  primary: "#1e88e5",
  primaryHover: "#1565c0",

  // 背景色
  background: "#1a1a1a",
  containerBackground: "#2d2d2d",
  headerBackground: "#1e88e5",

  // 文字颜色
  textPrimary: "#e0e0e0",
  textSecondary: "#b0b0b0",
  textOnPrimary: "#ffffff",

  // 用户消息气泡
  userMessageBackground: "#1e88e5",
  userMessageText: "#ffffff",

  // AI 消息气泡
  assistantMessageBackground: "#3a3a3a",
  assistantMessageText: "#e0e0e0",

  // 输入框
  inputBackground: "#3a3a3a",
  inputBorder: "#4a4a4a",
  inputBorderFocus: "#1e88e5",
  inputText: "#e0e0e0",
  inputPlaceholder: "#888888",

  // 边框和分隔线
  border: "#4a4a4a",
  divider: "#4a4a4a",

  // 按钮
  buttonDisabledBackground: "#4a4a4a",
  buttonDisabledText: "#888888",

  // 思考过程
  thinking: "#a78bfa",
  thinkingBg: "#4c1d95",

  // 代码块
  codeBg: "#2d3748",
  codeBorder: "#4a5568",

  // 来源引用
  sourceBorder: "#4a5568",
  sourceBg: "#2d3748",

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

// CSS 变量名映射
const cssVariableMap: Record<keyof ThemeColors, string> = {
  primary: "--chat-primary",
  primaryHover: "--chat-primary-hover",
  background: "--chat-background",
  containerBackground: "--chat-container-bg",
  headerBackground: "--chat-header-bg",
  textPrimary: "--chat-text-primary",
  textSecondary: "--chat-text-secondary",
  textOnPrimary: "--chat-text-on-primary",
  userMessageBackground: "--chat-user-msg-bg",
  userMessageText: "--chat-user-msg-text",
  assistantMessageBackground: "--chat-assistant-msg-bg",
  assistantMessageText: "--chat-assistant-msg-text",
  inputBackground: "--chat-input-bg",
  inputBorder: "--chat-input-border",
  inputBorderFocus: "--chat-input-border-focus",
  inputText: "--chat-input-text",
  inputPlaceholder: "--chat-input-placeholder",
  border: "--chat-border",
  divider: "--chat-divider",
  buttonDisabledBackground: "--chat-button-disabled-bg",
  buttonDisabledText: "--chat-button-disabled-text",

  // 思考过程
  thinking: "--chat-thinking",
  thinkingBg: "--chat-thinking-bg",

  // 代码块
  codeBg: "--chat-code-bg",
  codeBorder: "--chat-code-border",

  // 来源引用
  sourceBorder: "--chat-source-border",
  sourceBg: "--chat-source-bg",

  // 通知系统
  "notification-success-bg": "--chat-notification-success-bg",
  "notification-success-text": "--chat-notification-success-text",
  "notification-success-border": "--chat-notification-success-border",
  "notification-error-bg": "--chat-notification-error-bg",
  "notification-error-text": "--chat-notification-error-text",
  "notification-error-border": "--chat-notification-error-border",
  "notification-warning-bg": "--chat-notification-warning-bg",
  "notification-warning-text": "--chat-notification-warning-text",
  "notification-warning-border": "--chat-notification-warning-border",
  "notification-info-bg": "--chat-notification-info-bg",
  "notification-info-text": "--chat-notification-info-text",
  "notification-info-border": "--chat-notification-info-border",
};

/**
 * 应用主题到指定元素
 */
export function applyTheme(
  element: HTMLElement,
  mode: ThemeMode,
  customColors?: Partial<ThemeColors>
): void {
  // 根据模式选择基础主题
  let baseTheme: Required<ThemeColors>;

  if (mode === "auto") {
    // 检测系统主题
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    baseTheme = prefersDark ? defaultDarkTheme : defaultLightTheme;
  } else {
    baseTheme = mode === "dark" ? defaultDarkTheme : defaultLightTheme;
  }

  // 合并自定义颜色
  const finalTheme = { ...baseTheme, ...customColors };

  // 应用 CSS 变量
  Object.entries(finalTheme).forEach(([key, value]) => {
    const cssVar = cssVariableMap[key as keyof ThemeColors];
    if (cssVar && value) {
      element.style.setProperty(cssVar, value);
    }
  });

  // 设置主题模式属性
  element.setAttribute(
    "data-theme",
    mode === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode
  );
}

/**
 * 自定义主题颜色
 */
export function customizeTheme(
  element: HTMLElement,
  colors: Partial<ThemeColors>
): void {
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = cssVariableMap[key as keyof ThemeColors];
    if (cssVar && value) {
      element.style.setProperty(cssVar, value);
    }
  });
}

/**
 * 移除主题
 */
export function removeTheme(element: HTMLElement): void {
  Object.values(cssVariableMap).forEach((cssVar) => {
    element.style.removeProperty(cssVar);
  });
  element.removeAttribute("data-theme");
}

/**
 * 获取当前主题颜色值
 */
export function getThemeColor(
  element: HTMLElement,
  key: keyof ThemeColors
): string {
  const cssVar = cssVariableMap[key];
  return getComputedStyle(element).getPropertyValue(cssVar).trim();
}

/**
 * 监听系统主题变化（仅在 auto 模式下）
 */
export function watchSystemTheme(
  element: HTMLElement,
  callback: (isDark: boolean) => void
): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener("change", handler);

  // 返回清理函数
  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}
