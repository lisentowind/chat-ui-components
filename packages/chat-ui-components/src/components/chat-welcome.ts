import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { t } from "../providers/chat-provider";

/**
 * ChatWelcome - 欢迎页面组件
 * 提供聊天开始时的欢迎界面，包含标题、描述、建议等
 */
@customElement("chat-welcome")
export class ChatWelcome extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      padding: 40px 20px;
      animation: fadeInUp 0.5s ease-out;
      min-height: 400px;
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

    .welcome-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--chat-primary, #007bff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: white;
      margin: 0 auto 24px;
      box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%,
      20%,
      50%,
      80%,
      100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    .title {
      font-size: 28px;
      font-weight: 600;
      color: var(--chat-text-primary, #333333);
      margin-bottom: 12px;
      line-height: 1.3;
    }

    .subtitle {
      font-size: 16px;
      color: var(--chat-text-secondary, #666666);
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .feature {
      padding: 16px;
      background: var(--chat-container-bg, #ffffff);
      border: 1px solid var(--chat-border, #e0e0e0);
      border-radius: 12px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .feature:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--chat-primary, #007bff);
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 8px;
      display: block;
    }

    .feature-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--chat-text-primary, #333333);
      margin-bottom: 4px;
    }

    .feature-description {
      font-size: 12px;
      color: var(--chat-text-secondary, #666666);
      line-height: 1.4;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      margin-bottom: 24px;
    }

    .suggestion-chip {
      padding: 8px 16px;
      background: var(--chat-container-bg, #ffffff);
      border: 1px solid var(--chat-border, #e0e0e0);
      border-radius: 20px;
      font-size: 14px;
      color: var(--chat-text-primary, #333333);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .suggestion-chip:hover {
      background: var(--chat-primary, #007bff);
      border-color: var(--chat-primary, #007bff);
      color: white;
      transform: translateY(-1px);
    }

    .suggestion-chip:active {
      transform: translateY(0);
    }

    .suggestion-icon {
      font-size: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .action-button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .action-button.primary {
      background: var(--chat-primary, #007bff);
      color: white;
    }

    .action-button.primary:hover {
      background: var(--chat-primary-hover, #0056b3);
      transform: translateY(-1px);
    }

    .action-button.secondary {
      background: transparent;
      color: var(--chat-text-primary, #333333);
      border: 1px solid var(--chat-border, #e0e0e0);
    }

    .action-button.secondary:hover {
      background: var(--chat-container-bg, #ffffff);
      border-color: var(--chat-primary, #007bff);
      color: var(--chat-primary, #007bff);
    }

    .stats {
      display: flex;
      gap: 32px;
      justify-content: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--chat-divider, #e0e0e0);
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 600;
      color: var(--chat-primary, #007bff);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--chat-text-secondary, #666666);
    }

    /* 响应式设计 */
    @media (max-width: 640px) {
      :host {
        padding: 24px 16px;
      }

      .avatar {
        width: 60px;
        height: 60px;
        font-size: 30px;
        margin-bottom: 20px;
      }

      .title {
        font-size: 24px;
      }

      .subtitle {
        font-size: 14px;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .suggestions {
        gap: 8px;
      }

      .suggestion-chip {
        padding: 6px 12px;
        font-size: 13px;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .action-button {
        width: 100%;
        max-width: 200px;
      }

      .stats {
        flex-direction: column;
        gap: 16px;
      }
    }
  `;

  @property({ type: String })
  title = "";

  @property({ type: String })
  subtitle = "";

  @property({ type: String })
  avatar = "";

  @property({ type: Array })
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    action?: string;
  }>;

  @property({ type: Array })
  suggestions?: Array<{
    text: string;
    icon?: string;
    action?: string;
  }>;

  @property({ type: Array })
  actions?: Array<{
    text: string;
    icon?: string;
    type?: "primary" | "secondary";
    action?: string;
  }>;

  @property({ type: Array })
  stats?: Array<{
    number: string;
    label: string;
  }>;

  @property({ type: Boolean })
  showStats = false;

  connectedCallback() {
    super.connectedCallback();

    // 如果没有设置属性，使用默认值
    if (!this.title) {
      this.title = t("welcome_title", "欢迎使用 AI 助手");
    }
    if (!this.subtitle) {
      this.subtitle = t(
        "welcome_subtitle",
        "我可以帮助您解答问题、提供信息和建议"
      );
    }
  }

  private _handleFeatureClick(feature: any) {
    this.dispatchEvent(
      new CustomEvent("feature-click", {
        detail: { feature },
        bubbles: true,
        composed: true,
      })
    );

    if (feature.action) {
      this._handleAction(feature.action);
    }
  }

  private _handleSuggestionClick(suggestion: any) {
    this.dispatchEvent(
      new CustomEvent("suggestion-click", {
        detail: { suggestion },
        bubbles: true,
        composed: true,
      })
    );

    if (suggestion.action) {
      this._handleAction(suggestion.action);
    }
  }

  private _handleActionClick(action: any) {
    this.dispatchEvent(
      new CustomEvent("action-click", {
        detail: { action },
        bubbles: true,
        composed: true,
      })
    );

    if (action.action) {
      this._handleAction(action.action);
    }
  }

  private _handleAction(action: string) {
    // 可以在这里处理特殊动作，比如发送消息、打开链接等
    this.dispatchEvent(
      new CustomEvent("action", {
        detail: { action },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const defaultFeatures = [
      {
        icon: "💬",
        title: t("feature_chat", "智能对话"),
        description: t("feature_chat_desc", "自然流畅的对话体验"),
      },
      {
        icon: "🧠",
        title: t("feature_thinking", "深度思考"),
        description: t("feature_thinking_desc", "展示AI的思考过程"),
      },
      {
        icon: "📎",
        title: t("feature_files", "文件支持"),
        description: t("feature_files_desc", "支持多种文件格式"),
      },
      {
        icon: "🎨",
        title: t("feature_themes", "主题定制"),
        description: t("feature_themes_desc", "个性化的界面主题"),
      },
    ];

    const defaultSuggestions = [
      { text: t("suggestion_hello", "你好，介绍一下自己"), icon: "👋" },
      { text: t("suggestion_help", "我需要帮助"), icon: "💡" },
      { text: t("suggestion_weather", "今天天气怎么样"), icon: "☀️" },
      { text: t("suggestion_code", "写一段代码"), icon: "💻" },
    ];

    const defaultActions = [
      {
        text: t("action_start", "开始对话"),
        icon: "✨",
        type: "primary" as const,
        action: "start-chat",
      },
      {
        text: t("action_learn", "了解更多"),
        icon: "📖",
        type: "secondary" as const,
        action: "learn-more",
      },
    ];

    const defaultStats = [
      { number: "24/7", label: t("stat_availability", "全天候服务") },
      { number: "100K+", label: t("stat_users", "用户信赖") },
      { number: "99.9%", label: t("stat_uptime", "服务可用性") },
    ];

    return html`
      <div class="welcome-container">
        <!-- 头像 -->
        ${this.avatar
          ? html`
              <div class="avatar">
                <img
                  src="${this.avatar}"
                  alt="avatar"
                  style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"
                />
              </div>
            `
          : html` <div class="avatar">🤖</div> `}

        <!-- 标题和副标题 -->
        <h1 class="title">${this.title}</h1>
        <p class="subtitle">${this.subtitle}</p>

        <!-- 功能特性 -->
        ${this.features && this.features.length > 0
          ? html`
              <div class="features">
                ${this.features.map(
                  (feature) => html`
                    <div
                      class="feature"
                      @click="${() => this._handleFeatureClick(feature)}"
                    >
                      <span class="feature-icon">${feature.icon}</span>
                      <div class="feature-title">${feature.title}</div>
                      <div class="feature-description">
                        ${feature.description}
                      </div>
                    </div>
                  `
                )}
              </div>
            `
          : html`
              <div class="features">
                ${defaultFeatures.map(
                  (feature) => html`
                    <div
                      class="feature"
                      @click="${() => this._handleFeatureClick(feature)}"
                    >
                      <span class="feature-icon">${feature.icon}</span>
                      <div class="feature-title">${feature.title}</div>
                      <div class="feature-description">
                        ${feature.description}
                      </div>
                    </div>
                  `
                )}
              </div>
            `}

        <!-- 建议词 -->
        ${this.suggestions && this.suggestions.length > 0
          ? html`
              <div class="suggestions">
                ${this.suggestions.map(
                  (suggestion) => html`
                    <div
                      class="suggestion-chip"
                      @click="${() => this._handleSuggestionClick(suggestion)}"
                    >
                      ${suggestion.icon
                        ? html`<span class="suggestion-icon"
                            >${suggestion.icon}</span
                          >`
                        : ""}
                      ${suggestion.text}
                    </div>
                  `
                )}
              </div>
            `
          : html`
              <div class="suggestions">
                ${defaultSuggestions.map(
                  (suggestion) => html`
                    <div
                      class="suggestion-chip"
                      @click="${() => this._handleSuggestionClick(suggestion)}"
                    >
                      <span class="suggestion-icon">${suggestion.icon}</span>
                      ${suggestion.text}
                    </div>
                  `
                )}
              </div>
            `}

        <!-- 操作按钮 -->
        ${this.actions && this.actions.length > 0
          ? html`
              <div class="action-buttons">
                ${this.actions.map(
                  (action) => html`
                    <div
                      class="action-button ${action.type === "primary"
                        ? "primary"
                        : "secondary"}"
                      @click="${() => this._handleActionClick(action)}"
                    >
                      ${action.icon ? html`<span>${action.icon}</span>` : ""}
                      ${action.text}
                    </div>
                  `
                )}
              </div>
            `
          : html`
              <div class="action-buttons">
                ${defaultActions.map(
                  (action) => html`
                    <div
                      class="action-button ${action.type === "primary"
                        ? "primary"
                        : "secondary"}"
                      @click="${() => this._handleActionClick(action)}"
                    >
                      <span>${action.icon}</span>
                      ${action.text}
                    </div>
                  `
                )}
              </div>
            `}

        <!-- 统计信息 -->
        ${this.showStats
          ? html`
              <div class="stats">
                ${(this.stats || defaultStats).map(
                  (stat) => html`
                    <div class="stat">
                      <div class="stat-number">${stat.number}</div>
                      <div class="stat-label">${stat.label}</div>
                    </div>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }
}

// 声明 LitElement 自定义元素
declare global {
  interface HTMLElementTagNameMap {
    "chat-welcome": ChatWelcome;
  }
}
