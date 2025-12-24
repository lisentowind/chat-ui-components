export interface Message {
  sender: "user" | "assistant";
  content: string;
  timestamp?: number;
}

export type ChatEvents = {
  "send-message": { message: string };
  "message-sent": { message: string };
};

// 主题配置
export interface ThemeColors {
  // 主色调
  primary?: string;
  primaryHover?: string;

  // 背景色
  background?: string;
  containerBackground?: string;
  headerBackground?: string;

  // 文字颜色
  textPrimary?: string;
  textSecondary?: string;
  textOnPrimary?: string;

  // 消息气泡
  userMessageBackground?: string;
  userMessageText?: string;
  assistantMessageBackground?: string;
  assistantMessageText?: string;

  // 输入框
  inputBackground?: string;
  inputBorder?: string;
  inputBorderFocus?: string;
  inputText?: string;
  inputPlaceholder?: string;

  // 边框和分隔线
  border?: string;
  divider?: string;

  // 按钮
  buttonDisabledBackground?: string;
  buttonDisabledText?: string;

  // 思考过程
  thinking?: string;
  thinkingBg?: string;

  // 代码块
  codeBg?: string;
  codeBorder?: string;

  // 来源引用
  sourceBorder?: string;
  sourceBg?: string;

  // 通知系统
  "notification-success-bg"?: string;
  "notification-success-text"?: string;
  "notification-success-border"?: string;
  "notification-error-bg"?: string;
  "notification-error-text"?: string;
  "notification-error-border"?: string;
  "notification-warning-bg"?: string;
  "notification-warning-text"?: string;
  "notification-warning-border"?: string;
  "notification-info-bg"?: string;
  "notification-info-text"?: string;
  "notification-info-border"?: string;
}

export type ThemeMode = "light" | "dark" | "auto" | "custom";
