import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Emitter } from 'mitt';
import type { ChatEvents } from '../types';

@customElement('chat-input')
export class ChatInput extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .input-container {
      display: flex;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid var(--chat-divider, #e0e0e0);
      background-color: var(--chat-input-bg, #ffffff);
    }

    input {
      flex: 1;
      padding: 10px 16px;
      border: 1px solid var(--chat-input-border, #cccccc);
      border-radius: 20px;
      font-size: 14px;
      outline: none;
      background-color: var(--chat-input-bg, #ffffff);
      color: var(--chat-input-text, #333333);
    }

    input::placeholder {
      color: var(--chat-input-placeholder, #999999);
    }

    input:focus {
      border-color: var(--chat-input-border-focus, #007bff);
    }

    button {
      padding: 10px 24px;
      background-color: var(--chat-primary, #007bff);
      color: var(--chat-text-on-primary, #ffffff);
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    button:hover:not(:disabled) {
      background-color: var(--chat-primary-hover, #0056b3);
    }

    button:disabled {
      background-color: var(--chat-button-disabled-bg, #cccccc);
      color: var(--chat-button-disabled-text, #888888);
      cursor: not-allowed;
    }
  `;

  @property({ type: String })
  placeholder = '输入消息...';

  @property({ attribute: false })
  eventBus?: Emitter<ChatEvents>;

  @state()
  private _value = '';

  private _handleInput(e: Event) {
    this._value = (e.target as HTMLInputElement).value;
  }

  private _handleSend() {
    if (this._value.trim()) {
      // 使用 mitt 事件总线触发事件
      if (this.eventBus) {
        this.eventBus.emit('send-message', { message: this._value });
      }
      this._value = '';
    }
  }

  private _handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._handleSend();
    }
  }

  render() {
    return html`
      <div class="input-container">
        <input
          type="text"
          .value=${this._value}
          @input=${this._handleInput}
          @keypress=${this._handleKeyPress}
          placeholder=${this.placeholder}
        />
        <button @click=${this._handleSend} ?disabled=${!this._value.trim()}>
          发送
        </button>
      </div>
    `;
  }
}
