import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import type { Message, SourceItem, FileItem } from "../types/x";
import { getXProvider, t } from "../providers/x-provider";

/**
 * XBubble - 升级版消息气泡组件
 * 支持多种消息类型、头像、时间戳、操作按钮等
 */
@customElement("x-bubble")
export class XBubble extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 16px;
      animation: fadeInUp 0.3s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .bubble-container {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      max-width: 100%;
    }

    .bubble-container.user {
      flex-direction: row-reverse;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
      color: white;
    }

    .avatar.user {
      background: var(--chat-user-msg-bg, #007bff);
    }

    .avatar.assistant {
      background: var(--chat-primary, #007bff);
    }

    .avatar.system {
      background: var(--chat-border, #e0e0e0);
      color: var(--chat-text-secondary, #666666);
    }

    .bubble-content {
      flex: 1;
      min-width: 0;
    }

    .bubble-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 12px;
      color: var(--chat-text-secondary, #666666);
    }

    .bubble-header.user {
      justify-content: flex-end;
    }

    .message-bubble {
      background: var(--chat-assistant-msg-bg, #f1f3f5);
      color: var(--chat-assistant-msg-text, #333333);
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--chat-border, #e0e0e0);
      word-wrap: break-word;
      position: relative;
    }

    .message-bubble.user {
      background: var(--chat-user-msg-bg, #007bff);
      color: var(--chat-user-msg-text, #ffffff);
      border-color: var(--chat-user-msg-bg, #007bff);
    }

    .message-bubble.system {
      background: var(--chat-notification-bg, #fff3cd);
      color: var(--chat-notification-text, #856404);
      border-color: var(--chat-notification-border, #ffeaa7);
    }

    .message-bubble.thinking {
      background: var(--chat-thinking-bg, #f3e8ff);
      color: var(--chat-thinking, #8b5cf6);
      border-color: var(--chat-thinking, #8b5cf6);
    }

    .message-bubble.error {
      background: #fef2f2;
      color: #991b1b;
      border-color: #fca5a5;
    }

    /* 消息类型样式 */
    .text-content {
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .markdown-content {
      line-height: 1.6;
    }

    .markdown-content h1,
    .markdown-content h2,
    .markdown-content h3,
    .markdown-content h4,
    .markdown-content h5,
    .markdown-content h6 {
      margin: 16px 0 8px 0;
      font-weight: 600;
    }

    .markdown-content h1 {
      font-size: 1.5em;
    }
    .markdown-content h2 {
      font-size: 1.3em;
    }
    .markdown-content h3 {
      font-size: 1.2em;
    }

    .markdown-content p {
      margin: 8px 0;
    }

    .markdown-content ul,
    .markdown-content ol {
      margin: 8px 0;
      padding-left: 20px;
    }

    .markdown-content li {
      margin: 4px 0;
    }

    .markdown-content code {
      background: var(--chat-code-bg, #f3f4f6);
      border: 1px solid var(--chat-code-border, #e5e7eb);
      border-radius: 4px;
      padding: 2px 6px;
      font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
      font-size: 0.9em;
    }

    .markdown-content pre {
      background: var(--chat-code-bg, #f3f4f6);
      border: 1px solid var(--chat-code-border, #e5e7eb);
      border-radius: 8px;
      padding: 12px;
      overflow-x: auto;
      margin: 8px 0;
    }

    .markdown-content pre code {
      background: none;
      border: none;
      padding: 0;
    }

    .image-content {
      max-width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }

    .image-content img {
      width: 100%;
      height: auto;
      display: block;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .image-content img:hover {
      transform: scale(1.02);
    }

    .file-list {
      margin: 8px 0;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--chat-container-bg, #ffffff);
      border: 1px solid var(--chat-border, #e0e0e0);
      border-radius: 6px;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .file-item:hover {
      background: var(--chat-background, #ffffff);
      border-color: var(--chat-primary, #007bff);
    }

    .file-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      opacity: 0.6;
    }

    .file-info {
      flex: 1;
      min-width: 0;
    }

    .file-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--chat-text-primary, #333333);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-size {
      font-size: 12px;
      color: var(--chat-text-secondary, #666666);
    }

    .sources-section {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--chat-divider, #e0e0e0);
    }

    .sources-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--chat-text-secondary, #666666);
      margin-bottom: 8px;
    }

    .source-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--chat-source-bg, #f9fafb);
      border: 1px solid var(--chat-source-border, #e5e7eb);
      border-radius: 4px;
      margin: 2px 4px 2px 0;
      font-size: 12px;
      color: var(--chat-text-primary, #333333);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .source-item:hover {
      background: var(--chat-background, #ffffff);
      border-color: var(--chat-primary, #007bff);
    }

    .thinking-content {
      font-style: italic;
      opacity: 0.8;
      font-size: 0.9em;
    }

    .bubble-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 12px;
      color: var(--chat-text-secondary, #666666);
    }

    .bubble-footer.user {
      justify-content: flex-end;
    }

    .timestamp {
      opacity: 0.7;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .action-button {
      background: none;
      border: none;
      color: var(--chat-text-secondary, #666666);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .action-button:hover {
      background: var(--chat-background, #ffffff);
      color: var(--chat-primary, #007bff);
    }

    .action-button:active {
      transform: scale(0.95);
    }

    .thinking-indicator {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }

    .thinking-dot {
      width: 6px;
      height: 6px;
      background: var(--chat-thinking, #8b5cf6);
      border-radius: 50%;
      animation: thinking 1.4s ease-in-out infinite both;
    }

    .thinking-dot:nth-child(1) {
      animation-delay: -0.32s;
    }
    .thinking-dot:nth-child(2) {
      animation-delay: -0.16s;
    }
    .thinking-dot:nth-child(3) {
      animation-delay: 0;
    }

    @keyframes thinking {
      0%,
      80%,
      100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* 响应式设计 */
    @media (max-width: 640px) {
      .bubble-container {
        gap: 8px;
      }

      .avatar {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }

      .message-bubble {
        padding: 10px 12px;
        font-size: 14px;
      }
    }
  `;

  @property({ type: Object })
  message!: Message;

  @property({ type: String })
  avatar?: string;

  @property({ type: Boolean })
  showAvatar = true;

  @property({ type: Boolean })
  showTimestamp = true;

  @property({ type: Boolean })
  showStatus = true;

  @property({ type: Boolean })
  enableCopy = true;

  @property({ type: Boolean })
  enableRetry = true;

  @property({ type: Boolean })
  enableDelete = true;

  @state()
  private _isThinking = false;

  connectedCallback() {
    super.connectedCallback();
    const provider = getXProvider();
    if (provider) {
      const config = provider.getConfig();
      this.showAvatar = config.bubble?.showAvatar ?? true;
      this.showTimestamp = config.bubble?.showTimestamp ?? true;
      this.showStatus = config.bubble?.showStatus ?? true;
      this.enableCopy = config.bubble?.enableCopy ?? true;
      this.enableRetry = config.bubble?.enableRetry ?? true;
      this.enableDelete = config.bubble?.enableDelete ?? true;
    }
  }

  private _formatTimestamp(timestamp?: number): string {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      // 1分钟内
      return t("just_now", "刚刚");
    } else if (diff < 3600000) {
      // 1小时内
      return t("minutes_ago", `${Math.floor(diff / 60000)}分钟前`);
    } else if (diff < 86400000) {
      // 1天内
      return t("hours_ago", `${Math.floor(diff / 3600000)}小时前`);
    } else {
      return date.toLocaleDateString();
    }
  }

  private _getAvatarContent(): string {
    const roleNames = {
      user: t("you", "你"),
      assistant: t("ai", "AI"),
      system: t("system", "系统"),
    };

    return roleNames[this.message.role] || "?";
  }

  private _handleCopy() {
    if (this.message.type === "text" || this.message.type === "markdown") {
      navigator.clipboard.writeText(this.message.content).then(() => {
        this._showNotification(t("copied", "已复制"), "success");
      });
    }
  }

  private _handleRetry() {
    this.dispatchEvent(
      new CustomEvent("retry", {
        detail: { message: this.message },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleDelete() {
    this.dispatchEvent(
      new CustomEvent("delete", {
        detail: { messageId: this.message.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFileClick(file: FileItem) {
    this.dispatchEvent(
      new CustomEvent("file-click", {
        detail: { file },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleSourceClick(source: SourceItem) {
    this.dispatchEvent(
      new CustomEvent("source-click", {
        detail: { source },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _showNotification(
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) {
    this.dispatchEvent(
      new CustomEvent("notification", {
        detail: { message, type },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderMessageContent() {
    const { content, type, files, sources } = this.message;

    switch (type) {
      case "image":
        return html`<div class="image-content">
          <img
            src="${content}"
            alt="image"
            @click="${() => window.open(content, "_blank")}"
          />
        </div>`;

      case "file":
        return html`
          <div class="text-content">${content}</div>
          ${files && files.length > 0
            ? html`
                <div class="file-list">
                  ${files.map(
                    (file) => html`
                      <div
                        class="file-item"
                        @click="${() => this._handleFileClick(file)}"
                      >
                        <div class="file-icon">📄</div>
                        <div class="file-info">
                          <div class="file-name">${file.name}</div>
                          <div class="file-size">
                            ${this._formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                    `
                  )}
                </div>
              `
            : ""}
        `;

      case "code":
        return html`<pre class="code-content"><code>${content}</code></pre>`;

      case "markdown":
        return html`<div class="markdown-content">
          ${this._parseMarkdown(content)}
        </div>`;

      case "thinking":
        return html`<div class="thinking-content">${content}</div>`;

      case "error":
        return html`<div class="text-content">❌ ${content}</div>`;

      default:
        return html`<div class="text-content">${content}</div>`;
    }
  }

  private _parseMarkdown(content: string) {
    // 简单的 Markdown 解析（实际项目中可以使用更强大的解析器）
    const htmlContent = content
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/`([^`]*)`/gim, "<code>$1</code>")
      .replace(/^\- (.*)$/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      .replace(/\n\n/gim, "</p><p>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>");

    return html`${[htmlContent]}`;
  }

  private _formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  render() {
    const { role, timestamp, thinking, sources } = this.message;
    const isUser = role === "user";
    const showActions =
      !isUser && (this.enableCopy || this.enableRetry || this.enableDelete);

    return html`
      <div class="bubble-container ${isUser ? "user" : ""}">
        ${this.showAvatar
          ? html`
              <div class="avatar ${role}">
                ${this.avatar
                  ? html`<img
                      src="${this.avatar}"
                      alt="avatar"
                      style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"
                    />`
                  : this._getAvatarContent()}
              </div>
            `
          : ""}

        <div class="bubble-content">
          ${this.showTimestamp
            ? html`
                <div class="bubble-header ${isUser ? "user" : ""}">
                  <span class="role-name">
                    ${role === "user"
                      ? t("you", "你")
                      : role === "assistant"
                      ? t("assistant", "助手")
                      : t("system", "系统")}
                  </span>
                  <span class="timestamp"
                    >${this._formatTimestamp(timestamp)}</span
                  >
                </div>
              `
            : ""}

          <div
            class="message-bubble ${isUser ? "user" : ""} ${this.message
              .type === "thinking"
              ? "thinking"
              : ""} ${this.message.type === "error" ? "error" : ""}"
          >
            ${this._renderMessageContent()}
          </div>

          ${thinking
            ? html`
                <div class="thinking-indicator">
                  <div class="thinking-dot"></div>
                  <div class="thinking-dot"></div>
                  <div class="thinking-dot"></div>
                  <span style="margin-left: 8px;"
                    >${t("thinking", "思考中...")}</span
                  >
                </div>
              `
            : ""}
          ${sources && sources.length > 0
            ? html`
                <div class="sources-section">
                  <div class="sources-title">${t("sources", "来源引用")}</div>
                  ${sources.map(
                    (source) => html`
                      <a
                        class="source-item"
                        href="${ifDefined(source.url)}"
                        target="_blank"
                        @click="${(e: Event) => {
                          e.preventDefault();
                          this._handleSourceClick(source);
                        }}"
                      >
                        📎 ${source.title}
                      </a>
                    `
                  )}
                </div>
              `
            : ""}
          ${showActions
            ? html`
                <div class="actions bubble-footer ${isUser ? "user" : ""}">
                  ${this.enableCopy &&
                  (this.message.type === "text" ||
                    this.message.type === "markdown")
                    ? html`
                        <button
                          class="action-button"
                          @click="${this._handleCopy}"
                          title="${t("copy", "复制")}"
                        >
                          📋
                        </button>
                      `
                    : ""}
                  ${this.enableRetry && !isUser && this.message.type === "error"
                    ? html`
                        <button
                          class="action-button"
                          @click="${this._handleRetry}"
                          title="${t("retry", "重试")}"
                        >
                          🔄
                        </button>
                      `
                    : ""}
                  ${this.enableDelete
                    ? html`
                        <button
                          class="action-button"
                          @click="${this._handleDelete}"
                          title="${t("delete", "删除")}"
                        >
                          🗑️
                        </button>
                      `
                    : ""}
                </div>
              `
            : ""}
        </div>
      </div>
    `;
  }
}

// 声明 LitElement 自定义元素
declare global {
  interface HTMLElementTagNameMap {
    "x-bubble": XBubble;
  }
}
