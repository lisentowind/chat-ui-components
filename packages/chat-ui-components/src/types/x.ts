// X 组件专用类型定义

// 消息类型扩展
export type MessageRole = "user" | "assistant" | "system";

export type MessageType =
  | "text"
  | "image"
  | "file"
  | "code"
  | "markdown"
  | "thinking"
  | "error";

export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
  timestamp?: number;
  thinking?: string; // 思考过程
  sources?: SourceItem[]; // 来源引用
  files?: FileItem[]; // 文件附件
  metadata?: Record<string, any>;
}

// 来源引用
export interface SourceItem {
  id: string;
  title: string;
  url?: string;
  content?: string;
  type: "web" | "document" | "code" | "other";
}

// 文件项目
export interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress?: number;
}

// 思考步骤
export interface ThinkingStep {
  id: string;
  content: string;
  status: "pending" | "processing" | "completed" | "error";
  timestamp?: number;
}

// 思维链
export interface ThoughtChain {
  id: string;
  steps: ThinkingStep[];
  collapsed?: boolean;
}

// 通知类型
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content?: string;
  duration?: number;
  closable?: boolean;
  action?: {
    text: string;
    onClick: () => void;
  };
}

// 建议项
export interface Suggestion {
  id: string;
  content: string;
  description?: string;
  icon?: string;
  category?: string;
  keywords?: string[];
}

// 提示词
export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  category?: string;
  tags?: string[];
  icon?: string;
}

// 会话
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

// 主题配置扩展
export interface ExtendedThemeColors {
  // X 组件专用颜色
  thinking?: string;
  thinkingBg?: string;
  sourceBorder?: string;
  sourceBg?: string;
  codeBg?: string;
  codeBorder?: string;
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
  [key: string]: string | undefined; // 保持向后兼容
}

// 国际化配置
export interface LocaleConfig {
  locale: string;
  messages: Record<string, string>;
}

// X Provider 配置
export interface XProviderConfig {
  theme?: {
    mode?: "light" | "dark" | "auto";
    customColors?: ExtendedThemeColors;
  };
  locale?: LocaleConfig;
  notifications?: {
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    maxCount?: number;
    duration?: number;
  };
  sender?: {
    maxLength?: number;
    placeholder?: string;
    enableAttachments?: boolean;
    enableVoice?: boolean;
  };
  bubble?: {
    showAvatar?: boolean;
    showTimestamp?: boolean;
    showStatus?: boolean;
    enableCopy?: boolean;
    enableRetry?: boolean;
    enableDelete?: boolean;
  };
}

// X 组件事件
export type XEvents = {
  "message-send": { message: Partial<Message> };
  "message-received": { message: Message };
  "thinking-start": { messageId: string };
  "thinking-update": { messageId: string; step: ThinkingStep };
  "thinking-end": { messageId: string };
  "conversation-create": { conversation: Conversation };
  "conversation-switch": { conversationId: string };
  "notification-show": { notification: Notification };
  "notification-hide": { notificationId: string };
  "theme-change": { theme: string };
  "locale-change": { locale: string };
};
