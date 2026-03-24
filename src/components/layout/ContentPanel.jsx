/** @jsxImportSource react */
import { Dots } from "../common/Icons";

export function ContentPanel({
  mode,
  platform,
  setPlatform,
  input,
  setInput,
  loading,
  error,
  onGenerate,
  palette,
  llmConfig,
  onOpenLLMConfig,
}) {
  return (
    <div className="content-panel">
      {/* 平台选择 - 仅在分页模式下显示 */}
      {mode === "split" && (
        <div className="panel-section">
          <h3 className="section-title">📱 发布平台</h3>
          <div className="platform-cards">
            <button
              className={`platform-card ${platform === "xhs" ? "active" : ""}`}
              onClick={() => setPlatform("xhs")}
            >
              <span className="platform-emoji">📕</span>
              <div className="platform-info">
                <span className="platform-name">小红书</span>
                <span className="platform-desc">情绪化 · 口语风</span>
              </div>
            </button>
            
            <button
              className={`platform-card ${platform === "wechat" ? "active" : ""}`}
              onClick={() => setPlatform("wechat")}
            >
              <span className="platform-emoji">💬</span>
              <div className="platform-info">
                <span className="platform-name">微信推文</span>
                <span className="platform-desc">专业 · 权威感</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 文案输入 */}
      <div className="panel-section content-section">
        <h3 className="section-title">✍️ 文案内容</h3>
        <textarea
          className="content-input-large"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "single" 
            ? "输入文案，AI将为你生成精美的整页排版..."
            : "输入文案，AI将为你生成多张分页卡片..."
          }
          rows={6}
        />
      </div>

      {/* 生成按钮 */}
      <div className="panel-section action-section">
        <button
          className={`generate-btn-large ${loading || !input.trim() ? "disabled" : ""}`}
          onClick={onGenerate}
          disabled={loading || !input.trim()}
          style={{ "--theme-color": palette.a }}
        >
          {loading ? (
            <>
              <Dots />
              <span>AI生成中...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>{mode === "single" ? "生成排版" : "生成卡片"}</span>
            </>
          )}
        </button>
        
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* LLM配置 */}
      <div className="panel-section llm-section">
        <div className="llm-config-header">
          <h3 className="section-title">🤖 AI模型配置</h3>
          <button
            className="llm-config-btn"
            onClick={onOpenLLMConfig}
            title="修改LLM配置"
          >
            ⚙️ 修改
          </button>
        </div>
        <div className="llm-config-info">
          <div className="llm-info-item">
            <span className="llm-info-label">提供商类型</span>
            <span className="llm-info-value">
              {llmConfig?.provider === 'openai' ? 'OpenAI' : 
               llmConfig?.provider === 'aliyun' ? '阿里云百炼' : 'Anthropic'}
            </span>
          </div>
          <div className="llm-info-item">
            <span className="llm-info-label">基础URL</span>
            <span className="llm-info-value llm-info-value-url" title={llmConfig?.baseUrl}>{llmConfig?.baseUrl || '未知'}</span>
          </div>
          <div className="llm-info-item">
            <span className="llm-info-label">模型</span>
            <span className="llm-info-value">{llmConfig?.model || '默认'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
