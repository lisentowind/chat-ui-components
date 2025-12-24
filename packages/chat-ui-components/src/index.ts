import "./assets/style/base.less";

// 导出组件
export { ChatMessage } from "./components/chat-message";
export { ChatInput } from "./components/chat-input";
export { ChatContainer } from "./components/chat-container";

// 导出类型
export type { Message, ChatEvents, ThemeColors, ThemeMode } from "./types";

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
