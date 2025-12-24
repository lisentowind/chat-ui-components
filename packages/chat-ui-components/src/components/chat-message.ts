import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("chat-message")
export class ChatMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 8px 0;
    }

    .message {
      padding: 12px 16px;
      border-radius: 8px;
      max-width: 70%;
    }

    .message.user {
      background: var(--chat-user-msg-bg);
      color: var(--chat-user-msg-text);
      margin-left: auto;
      text-align: right;
    }

    .message.assistant {
      background: var(--chat-assistant-msg-bg);
      color: var(--chat-assistant-msg-text);
    }

    .sender {
      font-size: 0.85em;
      font-weight: bold;
      margin-bottom: 4px;
      opacity: 0.9;
    }

    .content {
      line-height: 1.5;
      word-wrap: break-word;
    }
  `;

  @property({ type: String })
  sender: "user" | "assistant" = "user";

  @property({ type: String })
  content = "";

  render() {
    return html`
      <div class="message ${this.sender}">
        <div class="sender">${this.sender === "user" ? "你" : "AI"}</div>
        <div class="content">${this.content}</div>
      </div>
    `;
  }
}
