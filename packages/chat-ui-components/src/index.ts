// 导出原有组件
export { ChatMessage } from "./components/chat-message";
export { ChatInput } from "./components/chat-input";
export { ChatContainer } from "./components/chat-container";

// 导出 Chat 组件
export { ChatBubble } from "./components/chat-bubble";
export { ChatSender } from "./components/chat-sender";
export { ChatWelcome } from "./components/chat-welcome";
export {
  ChatNotification,
  NotificationManager,
  showNotification,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "./components/chat-notification";

// 导出 Chat Provider
export { ChatProvider, getChatProvider, t } from "./providers/chat-provider";

// 导出类型
export type { Message, ChatEvents, ThemeColors, ThemeMode } from "./types";
export type {
  Message as XMessage,
  MessageType,
  MessageRole,
  SourceItem,
  FileItem,
  ThinkingStep,
  ThoughtChain,
  NotificationType,
  Notification,
  Suggestion,
  Prompt,
  Conversation,
  ExtendedThemeColors,
  LocaleConfig,
  XProviderConfig,
  XEvents,
} from "./types/x";

// 导出事件总线工具
export { createEventBus } from "./event-bus";

// 导出主题系统
export {
  applyTheme,
  customizeTheme,
  removeTheme,
  getThemeColor,
  watchSystemTheme,
  defaultLightTheme,
  defaultDarkTheme,
} from "./theme";
