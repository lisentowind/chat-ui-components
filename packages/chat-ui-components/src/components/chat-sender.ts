import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import type { Message, FileItem } from "../types/x";
import { getChatProvider, t } from "../providers/chat-provider";

/**
 * ChatSender - 升级版发送框组件
 * 支持多行输入、文件上传、语音输入、快捷指令等功能
 */
@customElement("chat-sender")
export class ChatSender extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--chat-input-border, #cccccc);
      border-radius: 12px;
      background: var(--chat-input-bg, #ffffff);
      transition: all 0.2s ease;
      min-height: 60px;
    }

    :host(:focus-within) {
      border-color: var(--chat-input-border-focus, #007bff);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    }

    .sender-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
    }

    .input-area {
      display: flex;
      gap: 8px;
      align-items: flex-end;
      min-height: 44px;
    }

    .input-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .textarea {
      width: 100%;
      min-height: 44px;
      max-height: 120px;
      padding: 10px 12px;
      border: none;
      outline: none;
      background: transparent;
      resize: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.5;
      color: var(--chat-input-text, #333333);
      placeholder: var(--chat-input-placeholder, #999999);
    }

    .textarea::placeholder {
      color: var(--chat-input-placeholder, #999999);
    }

    .char-count {
      position: absolute;
      bottom: 4px;
      right: 12px;
      font-size: 12px;
      color: var(--chat-text-secondary, #666666);
      pointer-events: none;
    }

    .char-count.warning {
      color: #f59e0b;
    }

    .char-count.error {
      color: #ef4444;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .action-button {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--chat-text-secondary, #666666);
      transition: all 0.2s ease;
      font-size: 16px;
    }

    .action-button:hover {
      background: var(--chat-background, #f8f9fa);
      color: var(--chat-primary, #007bff);
    }

    .action-button:active {
      transform: scale(0.95);
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-button:disabled:hover {
      background: transparent;
      color: var(--chat-text-secondary, #666666);
    }

    .send-button {
      background: var(--chat-primary, #007bff);
      color: white;
      padding: 0 16px;
      width: auto;
      min-width: 60px;
      border-radius: 8px;
      font-weight: 500;
    }

    .send-button:hover {
      background: var(--chat-primary-hover, #0056b3);
      color: white;
    }

    .send-button:disabled {
      background: var(--chat-button-disabled-bg, #cccccc);
      color: var(--chat-button-disabled-text, #888888);
    }

    .attachment-area {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: var(--chat-container-bg, #ffffff);
      border: 1px solid var(--chat-border, #e0e0e0);
      border-radius: 6px;
      font-size: 12px;
      color: var(--chat-text-primary, #333333);
    }

    .file-icon {
      font-size: 16px;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .file-name {
      font-weight: 500;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      color: var(--chat-text-secondary, #666666);
    }

    .file-remove {
      margin-left: 8px;
      background: none;
      border: none;
      color: var(--chat-text-secondary, #666666);
      cursor: pointer;
      padding: 2px;
      border-radius: 2px;
      transition: all 0.2s ease;
    }

    .file-remove:hover {
      background: rgba(255, 0, 0, 0.1);
      color: #ef4444;
    }

    .suggestions-area {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .suggestion-chip {
      padding: 4px 8px;
      background: var(--chat-container-bg, #ffffff);
      border: 1px solid var(--chat-border, #e0e0e0);
      border-radius: 16px;
      font-size: 12px;
      color: var(--chat-text-primary, #333333);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .suggestion-chip:hover {
      background: var(--chat-primary, #007bff);
      border-color: var(--chat-primary, #007bff);
      color: white;
    }

    .voice-recording {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      margin-top: 8px;
    }

    .voice-indicator {
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.2);
      }
    }

    .voice-text {
      color: #991b1b;
      font-size: 14px;
    }

    /* 响应式设计 */
    @media (max-width: 640px) {
      .sender-container {
        padding: 8px;
      }

      .action-buttons {
        gap: 4px;
      }

      .action-button {
        width: 28px;
        height: 28px;
        font-size: 14px;
      }

      .send-button {
        padding: 0 12px;
        min-width: 50px;
      }

      .file-name {
        max-width: 100px;
      }
    }
  `;

  @property({ type: String })
  placeholder = "";

  @property({ type: Number })
  maxLength = 4000;

  @property({ type: Boolean })
  enableAttachments = true;

  @property({ type: Boolean })
  enableVoice = false;

  @property({ type: Array })
  suggestions?: string[];

  @property({ type: Boolean })
  disabled = false;

  @state()
  private _value = "";

  @state()
  private _files: FileItem[] = [];

  @state()
  private _isRecording = false;

  @state()
  private _isComposing = false;

  @query("textarea")
  private _textarea!: HTMLTextAreaElement;

  private _mediaRecorder?: MediaRecorder;
  private _audioChunks: Blob[] = [];

  connectedCallback() {
    super.connectedCallback();
    const provider = getChatProvider();
    if (provider) {
      const config = provider.getConfig();
      this.maxLength = config.sender?.maxLength ?? 4000;
      this.enableAttachments = config.sender?.enableAttachments ?? true;
      this.enableVoice = config.sender?.enableVoice ?? false;
      this.placeholder = config.sender?.placeholder ?? "";
    }
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this._value = target.value;

    // 自动调整高度
    this._adjustTextareaHeight();

    // 触发输入事件
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this._value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !this._isComposing) {
      e.preventDefault();
      this._handleSend();
    }
  }

  private _handleCompositionStart() {
    this._isComposing = true;
  }

  private _handleCompositionEnd() {
    this._isComposing = false;
  }

  private _handleSend() {
    if (!this._canSend()) return;

    const message: Partial<Message> = {
      role: "user",
      content: this._value.trim(),
      type: "text",
      timestamp: Date.now(),
    };

    if (this._files.length > 0) {
      message.files = [...this._files];
      message.type = "file";
    }

    // 触发发送事件
    this.dispatchEvent(
      new CustomEvent("send", {
        detail: { message },
        bubbles: true,
        composed: true,
      })
    );

    // 清空输入
    this._value = "";
    this._files = [];
    this._textarea.value = "";
    this._adjustTextareaHeight();
  }

  private _handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    this._addFiles(files);
    target.value = ""; // 清空文件输入
  }

  private _handleDrop(e: DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    this._addFiles(files);
  }

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "copy";
  }

  private _addFiles(files: File[]) {
    const newFiles: FileItem[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      status: "completed",
    }));

    this._files = [...this._files, ...newFiles];

    // 触发文件添加事件
    this.dispatchEvent(
      new CustomEvent("files-add", {
        detail: { files: newFiles },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _removeFile(fileId: string) {
    this._files = this._files.filter((file) => file.id !== fileId);
  }

  private _handleVoiceToggle() {
    if (this._isRecording) {
      this._stopRecording();
    } else {
      this._startRecording();
    }
  }

  private async _startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._mediaRecorder = new MediaRecorder(stream);
      this._audioChunks = [];

      this._mediaRecorder.ondataavailable = (e) => {
        this._audioChunks.push(e.data);
      };

      this._mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this._audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // 触发语音录制完成事件
        this.dispatchEvent(
          new CustomEvent("voice-recorded", {
            detail: { audioUrl, audioBlob },
            bubbles: true,
            composed: true,
          })
        );

        stream.getTracks().forEach((track) => track.stop());
      };

      this._mediaRecorder.start();
      this._isRecording = true;
    } catch (error) {
      console.error("语音录制失败:", error);
      this._showNotification(
        t("voice_permission_denied", "语音权限被拒绝"),
        "error"
      );
    }
  }

  private _stopRecording() {
    if (this._mediaRecorder && this._isRecording) {
      this._mediaRecorder.stop();
      this._isRecording = false;
    }
  }

  private _handleSuggestionClick(suggestion: string) {
    this._value = suggestion;
    this._textarea.value = suggestion;
    this._textarea.focus();
    this._adjustTextareaHeight();

    // 触发建议选择事件
    this.dispatchEvent(
      new CustomEvent("suggestion-select", {
        detail: { suggestion },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _adjustTextareaHeight() {
    this._textarea.style.height = "auto";
    this._textarea.style.height = `${Math.min(
      this._textarea.scrollHeight,
      120
    )}px`;
  }

  private _canSend(): boolean {
    const hasContent = this._value.trim().length > 0;
    const hasFiles = this._files.length > 0;
    const withinLimit = this._value.length <= this.maxLength;
    return (
      !this.disabled &&
      !this._isRecording &&
      (hasContent || hasFiles) &&
      withinLimit
    );
  }

  private _getCharCountClass(): string {
    const count = this._value.length;
    if (count > this.maxLength) return "error";
    if (count > this.maxLength * 0.9) return "warning";
    return "";
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

  render() {
    const charCount = this._value.length;
    const canSend = this._canSend();
    const charCountClass = this._getCharCountClass();

    return html`
      <div class="sender-container">
        <!-- 文件区域 -->
        ${this._files.length > 0
          ? html`
              <div class="attachment-area">
                ${this._files.map(
                  (file) => html`
                    <div class="file-item">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">
                          ${this._formatFileSize(file.size)}
                        </div>
                      </div>
                      <button
                        class="file-remove"
                        @click="${() => this._removeFile(file.id)}"
                      >
                        ✕
                      </button>
                    </div>
                  `
                )}
              </div>
            `
          : ""}

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-wrapper">
            <textarea
              class="textarea"
              .value="${this._value}"
              placeholder="${this.placeholder ||
              t("input_placeholder", "请输入消息...")}"
              maxlength="${this.maxLength}"
              ?disabled="${this.disabled || this._isRecording}"
              @input="${this._handleInput}"
              @keydown="${this._handleKeyDown}"
              @compositionstart="${this._handleCompositionStart}"
              @compositionend="${this._handleCompositionEnd}"
            ></textarea>
            ${this.maxLength
              ? html`
                  <span class="char-count ${charCountClass}">
                    ${charCount}/${this.maxLength}
                  </span>
                `
              : ""}
          </div>

          <div class="action-buttons">
            <!-- 附件按钮 -->
            ${this.enableAttachments && !this._isRecording
              ? html`
                  <button
                    class="action-button"
                    @click="${() =>
                      this._textarea.nextElementSibling
                        ?.querySelector("input")
                        ?.click()}"
                    title="${t("attach_file", "附件")}"
                    ?disabled="${this.disabled}"
                  >
                    📎
                  </button>
                  <input
                    type="file"
                    multiple
                    style="display: none;"
                    @change="${this._handleFileSelect}"
                  />
                `
              : ""}

            <!-- 语音按钮 -->
            ${this.enableVoice
              ? html`
                  <button
                    class="action-button ${this._isRecording
                      ? "recording"
                      : ""}"
                    @click="${this._handleVoiceToggle}"
                    title="${this._isRecording
                      ? t("stop_recording", "停止录音")
                      : t("start_recording", "开始录音")}"
                    ?disabled="${this.disabled}"
                  >
                    ${this._isRecording ? "⏹️" : "🎤"}
                  </button>
                `
              : ""}

            <!-- 发送按钮 -->
            <button
              class="action-button send-button"
              @click="${this._handleSend}"
              ?disabled="${!canSend}"
              title="${t("send", "发送")}"
            >
              ${this._isRecording ? "⏹️" : t("send", "发送")}
            </button>
          </div>
        </div>

        <!-- 语音录制状态 -->
        ${this._isRecording
          ? html`
              <div class="voice-recording">
                <div class="voice-indicator"></div>
                <span class="voice-text">${t("recording", "正在录音...")}</span>
              </div>
            `
          : ""}

        <!-- 建议词 -->
        ${this.suggestions && this.suggestions.length > 0
          ? html`
              <div class="suggestions-area">
                ${this.suggestions.map(
                  (suggestion) => html`
                    <div
                      class="suggestion-chip"
                      @click="${() => this._handleSuggestionClick(suggestion)}"
                    >
                      ${suggestion}
                    </div>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }

  private _formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
}

// 声明 LitElement 自定义元素
declare global {
  interface HTMLElementTagNameMap {
    "chat-sender": ChatSender;
  }
}
