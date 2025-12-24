import type { ThemeColors, ThemeMode } from './types';

// 默认亮色主题
export const defaultLightTheme: Required<ThemeColors> = {
  // 主色调（使用 Lit-chat 颜色）
  primary: '#f5a623',
  primaryHover: '#cb7f16',

  // 背景色
  background: '#ffffff',
  containerBackground: '#ffffff',
  headerBackground: '#f5a623',

  // 文字颜色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textOnPrimary: '#ffffff',

  // 用户消息气泡
  userMessageBackground: '#f5a623',
  userMessageText: '#ffffff',

  // AI 消息气泡
  assistantMessageBackground: '#f1f3f5',
  assistantMessageText: '#333333',

  // 输入框
  inputBackground: '#ffffff',
  inputBorder: '#cccccc',
  inputBorderFocus: '#f5a623',
  inputText: '#333333',
  inputPlaceholder: '#999999',

  // 边框和分隔线
  border: '#e0e0e0',
  divider: '#e0e0e0',

  // 按钮
  buttonDisabledBackground: '#cccccc',
  buttonDisabledText: '#888888',
};

// 默认暗色主题
export const defaultDarkTheme: Required<ThemeColors> = {
  // 主色调（使用 dark-Lit-chat 颜色）
  primary: '#f7ba48',
  primaryHover: '#f9ce71',

  // 背景色
  background: '#1a1a1a',
  containerBackground: '#2d2d2d',
  headerBackground: '#f7ba48',

  // 文字颜色
  textPrimary: '#e0e0e0',
  textSecondary: '#b0b0b0',
  textOnPrimary: '#ffffff',

  // 用户消息气泡
  userMessageBackground: '#f7ba48',
  userMessageText: '#ffffff',

  // AI 消息气泡
  assistantMessageBackground: '#3a3a3a',
  assistantMessageText: '#e0e0e0',

  // 输入框
  inputBackground: '#3a3a3a',
  inputBorder: '#4a4a4a',
  inputBorderFocus: '#f7ba48',
  inputText: '#e0e0e0',
  inputPlaceholder: '#888888',

  // 边框和分隔线
  border: '#4a4a4a',
  divider: '#4a4a4a',

  // 按钮
  buttonDisabledBackground: '#4a4a4a',
  buttonDisabledText: '#888888',
};

// CSS 变量名映射
const cssVariableMap: Record<keyof ThemeColors, string> = {
  primary: '--chat-primary',
  primaryHover: '--chat-primary-hover',
  background: '--chat-background',
  containerBackground: '--chat-container-bg',
  headerBackground: '--chat-header-bg',
  textPrimary: '--chat-text-primary',
  textSecondary: '--chat-text-secondary',
  textOnPrimary: '--chat-text-on-primary',
  userMessageBackground: '--chat-user-msg-bg',
  userMessageText: '--chat-user-msg-text',
  assistantMessageBackground: '--chat-assistant-msg-bg',
  assistantMessageText: '--chat-assistant-msg-text',
  inputBackground: '--chat-input-bg',
  inputBorder: '--chat-input-border',
  inputBorderFocus: '--chat-input-border-focus',
  inputText: '--chat-input-text',
  inputPlaceholder: '--chat-input-placeholder',
  border: '--chat-border',
  divider: '--chat-divider',
  buttonDisabledBackground: '--chat-button-disabled-bg',
  buttonDisabledText: '--chat-button-disabled-text',
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

  if (mode === 'auto') {
    // 检测系统主题
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    baseTheme = prefersDark ? defaultDarkTheme : defaultLightTheme;
  } else {
    baseTheme = mode === 'dark' ? defaultDarkTheme : defaultLightTheme;
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
  element.setAttribute('data-theme', mode === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode);
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
  element.removeAttribute('data-theme');
}

/**
 * 获取当前主题颜色值
 */
export function getThemeColor(element: HTMLElement, key: keyof ThemeColors): string {
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
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handler);

  // 返回清理函数
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
