import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { NotificationType } from "../types/x";
import { getChatProvider } from "../providers/chat-provider";

/**
 * ChatNotification - 系统通知组件
 * 提供各种类型的系统通知显示
 */
@customElement("chat-notification")
export class ChatNotification extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: 1000;
      pointer-events: auto;
    }

    .notification-container {
      position: fixed;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
      width: 100%;
    }

    .notification-container.top-right {
      top: 20px;
      right: 20px;
      align-items: flex-end;
    }

    .notification-container.top-left {
      top: 20px;
      left: 20px;
      align-items: flex-start;
    }

    .notification-container.bottom-right {
      bottom: 20px;
      right: 20px;
      align-items: flex-end;
    }

    .notification-container.bottom-left {
      bottom: 20px;
      left: 20px;
      align-items: flex-start;
    }

    .notification {
      background: var(--chat-notification-success-bg, #f0f9ff);
      color: var(--chat-notification-success-text, #0c4a6e);
      border: 1px solid var(--chat-notification-success-border, #7dd3fc);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      max-width: 100%;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .notification.removing {
      animation: slideOut 0.3s ease-out forwards;
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    .notification.error {
      background: var(--chat-notification-error-bg, #fef2f2);
      color: var(--chat-notification-error-text, #991b1b);
      border-color: var(--chat-notification-error-border, #fca5a5);
    }

    .notification.warning {
      background: var(--chat-notification-warning-bg, #fffbeb);
      color: var(--chat-notification-warning-text, #92400e);
      border-color: var(--chat-notification-warning-border, #fcd34d);
    }

    .notification.info {
      background: var(--chat-notification-info-bg, #f0f9ff);
      color: var(--chat-notification-info-text, #075985);
      border-color: var(--chat-notification-info-border, #7dd3fc);
    }

    .notification-icon {
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 1.3;
    }

    .notification-message {
      font-size: 13px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .notification-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 16px;
      line-height: 1;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification-close:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }

    .notification-close:active {
      transform: scale(0.95);
    }

    .notification-action {
      margin-top: 8px;
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: inherit;
    }

    .notification-action:hover {
      background: rgba(0, 0, 0, 0.2);
    }

    .notification-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background: currentColor;
      opacity: 0.3;
      animation: progress linear;
    }

    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    /* 响应式设计 */
    @media (max-width: 640px) {
      .notification-container {
        left: 12px !important;
        right: 12px !important;
        top: 12px !important;
        bottom: 12px !important;
        max-width: none;
        width: calc(100% - 24px);
      }

      .notification {
        padding: 10px 12px;
        font-size: 12px;
      }

      .notification-title {
        font-size: 13px;
      }

      .notification-message {
        font-size: 12px;
      }
    }
  `;

  @property({ type: String })
  type: NotificationType = "info";

  @property({ type: String })
  title = "";

  @property({ type: String })
  message = "";

  @property({ type: Number })
  duration = 4500;

  @property({ type: Boolean })
  closable = true;

  @property({ type: String })
  actionText = "";

  @property({ type: String })
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left" =
    "top-right";

  @state()
  private _isVisible = false;

  @state()
  private _isRemoving = false;

  private _timer?: number;
  private _progressTimer?: number;

  connectedCallback() {
    super.connectedCallback();
    const provider = getChatProvider();
    if (provider) {
      const config = provider.getConfig();
      this.position = config.notifications?.position || "top-right";
      this.duration = config.notifications?.duration || 4500;
    }
    // 修复 pointer-events 问题
    this.style.pointerEvents = "auto";
  }

  show() {
    this._isVisible = true;
    this._isRemoving = false;

    // 修复 pointer-events 问题
    this.style.pointerEvents = "auto";

    // 设置自动关闭定时器
    if (this.duration > 0) {
      this._timer = window.setTimeout(() => {
        this.hide();
      }, this.duration);

      // 设置进度条动画
      this._startProgress();
    }
  }

  hide() {
    this._isRemoving = true;

    // 清理定时器
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
    if (this._progressTimer) {
      cancelAnimationFrame(this._progressTimer);
      this._progressTimer = undefined;
    }

    // 延迟移除元素
    setTimeout(() => {
      this._isVisible = false;
      this.dispatchEvent(
        new CustomEvent("close", {
          bubbles: true,
          composed: true,
        })
      );
    }, 300);
  }

  private _startProgress() {
    const startTime = Date.now();
    const animate = () => {
      if (!this._isVisible || this._isRemoving) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 1 - elapsed / this.duration);

      const progressBar = this.shadowRoot?.querySelector(
        ".notification-progress"
      ) as HTMLElement;
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (progress > 0) {
        this._progressTimer = requestAnimationFrame(animate);
      }
    };

    this._progressTimer = requestAnimationFrame(animate);
  }

  private _handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    // 检查是否点击了关闭按钮
    if (target.closest(".notification-close")) {
      this.hide();
      return;
    }

    // 检查是否点击了操作按钮
    if (target.closest(".notification-action")) {
      this.dispatchEvent(
        new CustomEvent("action", {
          detail: { action: "click" },
          bubbles: true,
          composed: true,
        })
      );

      // 点击操作按钮后自动关闭
      this.hide();
      return;
    }

    // 通用点击事件
    this.dispatchEvent(
      new CustomEvent("click", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _getIcon(): string {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    return icons[this.type] || icons.info;
  }

  render() {
    if (!this._isVisible) return html``;

    return html`
      <div class="notification-container ${this.position}">
        <div
          class="notification ${classMap({
            error: this.type === "error",
            warning: this.type === "warning",
            info: this.type === "info",
          })} ${classMap({ removing: this._isRemoving })}"
          @click="${this._handleClick}"
        >
          <!-- 图标 -->
          <div class="notification-icon">${this._getIcon()}</div>

          <!-- 内容 -->
          <div class="notification-content">
            ${this.title
              ? html`<div class="notification-title">${this.title}</div>`
              : ""}
            ${this.message
              ? html`<div class="notification-message">${this.message}</div>`
              : ""}

            <!-- 操作按钮 -->
            ${this.actionText
              ? html`
                  <button
                    class="notification-action"
                    @click="${(e: Event) => e.stopPropagation()}"
                  >
                    ${this.actionText}
                  </button>
                `
              : ""}
          </div>

          <!-- 关闭按钮 -->
          ${this.closable
            ? html`
                <button
                  class="notification-close"
                  @click="${(e: Event) => e.stopPropagation()}"
                >
                  ✕
                </button>
              `
            : ""}

          <!-- 进度条 -->
          ${this.duration > 0
            ? html`
                <div
                  class="notification-progress"
                  style="animation-duration: ${this.duration}ms;"
                ></div>
              `
            : ""}
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // 清理定时器
    if (this._timer) {
      clearTimeout(this._timer);
    }
    if (this._progressTimer) {
      cancelAnimationFrame(this._progressTimer);
    }
  }
}

// 声明 LitElement 自定义元素
declare global {
  interface HTMLElementTagNameMap {
    "chat-notification": ChatNotification;
  }
}

// 通知管理器
export class NotificationManager {
  private static _instance: NotificationManager;
  private _notifications: Array<{ id: string; element: ChatNotification }> = [];
  private _maxCount = 5;

  static get instance(): NotificationManager {
    if (!this._instance) {
      this._instance = new NotificationManager();
    }
    return this._instance;
  }

  show(options: {
    type?: NotificationType;
    title?: string;
    message?: string;
    duration?: number;
    closable?: boolean;
    actionText?: string;
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  }): string {
    const id = Math.random().toString(36).substr(2, 9);

    // 检查是否超过最大数量
    if (this._notifications.length >= this._maxCount) {
      const oldest = this._notifications.shift();
      if (oldest) {
        oldest.element.hide();
      }
    }

    const notification = document.createElement(
      "chat-notification"
    ) as ChatNotification;

    // 设置属性
    if (options.type) notification.type = options.type;
    if (options.title) notification.title = options.title;
    if (options.message) notification.message = options.message;
    if (options.duration !== undefined)
      notification.duration = options.duration;
    if (options.closable !== undefined)
      notification.closable = options.closable;
    if (options.actionText) notification.actionText = options.actionText;
    if (options.position) notification.position = options.position;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示通知
    notification.show();

    // 记录通知
    this._notifications.push({ id, element: notification });

    // 监听关闭事件
    notification.addEventListener("close", () => {
      this._removeNotification(id);
    });

    // 监听点击事件
    notification.addEventListener("click", () => {
      console.log("通知被点击了:", {
        id,
        type: options.type,
        title: options.title,
      });
    });

    // 监听操作事件
    notification.addEventListener("action", (e: any) => {
      console.log("通知操作被触发:", e.detail);
    });

    return id;
  }

  success(message: string, title?: string): string {
    return this.show({ type: "success", title, message });
  }

  error(message: string, title?: string): string {
    return this.show({ type: "error", title, message });
  }

  warning(message: string, title?: string): string {
    return this.show({ type: "warning", title, message });
  }

  info(message: string, title?: string): string {
    return this.show({ type: "info", title, message });
  }

  hide(id: string): void {
    const notification = this._notifications.find((n) => n.id === id);
    if (notification) {
      notification.element.hide();
    }
  }

  hideAll(): void {
    this._notifications.forEach(({ element }) => {
      element.hide();
    });
  }

  setMaxCount(count: number): void {
    this._maxCount = count;
  }

  private _removeNotification(id: string): void {
    const index = this._notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      const { element } = this._notifications.splice(index, 1)[0];
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 100);
    }
  }
}

// 便捷函数
export function showNotification(
  options: Parameters<NotificationManager["show"]>[0]
): string {
  return NotificationManager.instance.show(options);
}

export function showSuccess(message: string, title?: string): string {
  return NotificationManager.instance.success(message, title);
}

export function showError(message: string, title?: string): string {
  return NotificationManager.instance.error(message, title);
}

export function showWarning(message: string, title?: string): string {
  return NotificationManager.instance.warning(message, title);
}

export function showInfo(message: string, title?: string): string {
  return NotificationManager.instance.info(message, title);
}
