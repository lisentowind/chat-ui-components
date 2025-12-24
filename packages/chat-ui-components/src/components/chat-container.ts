import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Emitter } from "mitt";
import type { Message, ChatEvents } from "../types";
import { createEventBus } from "../event-bus";
import "./chat-message";
import "./chat-input";

@customElement("chat-container")
export class ChatContainer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--chat-container-bg);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid var(--chat-border);
    }

    .header {
      padding: 16px;
      background: var(--chat-header-bg);
      color: var(--chat-text-on-primary);
      font-size: 18px;
      font-weight: bold;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      background: var(--chat-background);
    }

    .messages::-webkit-scrollbar {
      width: 6px;
    }

    .messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .messages::-webkit-scrollbar-thumb {
      background: var(--chat-input-border);
      border-radius: 3px;
    }

    .messages::-webkit-scrollbar-thumb:hover {
      background: var(--chat-text-secondary);
    }

    .footer {
      border-top: 1px solid var(--chat-divider);
    }
  `;

  @property({ type: Array })
  messages: Message[] = [];

  @property({ type: String })
  title = "聊天";

  // 事件总线
  public eventBus: Emitter<ChatEvents> = createEventBus();

  connectedCallback() {
    super.connectedCallback();
    // 监听 mitt 事件总线的事件
    this.eventBus.on("send-message", this._handleMessageSent.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // 清理事件监听
    this.eventBus.all.clear();
  }

  private _handleMessageSent(data: { message: string }) {
    // 向外部触发 mitt 事件
    this.eventBus.emit("message-sent", data);

    // 也通过原生 CustomEvent 向上传递,保持向后兼容性
    this.dispatchEvent(
      new CustomEvent("message-sent", {
        detail: data,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="header">${this.title}</div>
      <div class="messages">
        ${this.messages.map(
          (msg) => html`
            <chat-message .sender=${msg.sender} .content=${msg.content}>
            </chat-message>
          `
        )}
      </div>
      <div class="footer">
        <chat-input .eventBus=${this.eventBus}></chat-input>
      </div>
    `;
  }
}
