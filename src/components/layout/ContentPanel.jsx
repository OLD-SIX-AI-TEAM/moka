/** @jsxImportSource react */
import { useState, useEffect } from "react";
import { Dots } from "../common/Icons";
import { LLM_PROVIDERS } from "../../services/llm";

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
  // 获取显示的 provider 名称
  const getProviderName = () => {
    const provider = llmConfig?.provider || "aliyun";
    return LLM_PROVIDERS[provider]?.name || "阿里云百炼";
  };

  // 获取显示的 baseUrl
  const getBaseUrl = () => {
    if (llmConfig?.baseUrl) return llmConfig.baseUrl;
    const provider = llmConfig?.provider || "aliyun";
    return LLM_PROVIDERS[provider]?.defaultBaseUrl || "https://dashscope.aliyuncs.com/compatible-mode/v1";
  };

  // 获取显示的 model
  const getModel = () => {
    if (llmConfig?.model) return llmConfig.model;
    const provider = llmConfig?.provider || "aliyun";
    return LLM_PROVIDERS[provider]?.defaultModel || "qwen3.5-plus";
  };

  // 使用次数状态
  const [usage, setUsage] = useState({
    dailyRemaining: 5,
    monthlyRemaining: 50,
    dailyMax: 5,
  });

  // 获取使用次数
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage');
        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        }
      } catch (e) {
        console.error('获取使用次数失败:', e);
      }
    };
    fetchUsage();
  }, []);

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
        
        {/* 免费体验提示 - 仅当没有配置自己的 API Key 时显示 */}
        {!llmConfig?.hasEncryptedKey && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🎁</span>
                <span style={{
                  fontSize: '13px',
                  color: '#fff',
                  fontWeight: 500,
                }}>
                  免费限量体验
                </span>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#fff',
                fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '4px 10px',
                borderRadius: '12px',
              }}>
                今日剩余 {usage.dailyRemaining}/{usage.dailyMax} 次
              </span>
            </div>
            
            {/* 建议配置自己的 API Key */}
            <div style={{
              backgroundColor: '#f0f7f2',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '14px' }}>💡</span>
              <span style={{
                fontSize: '12px',
                color: '#4a7c59',
                flex: 1,
              }}>
                建议配置自己的 API Key，获得无限次使用
              </span>
              <button
                onClick={onOpenLLMConfig}
                style={{
                  fontSize: '12px',
                  color: '#4a7c59',
                  backgroundColor: 'transparent',
                  border: '1px solid #4a7c59',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                去配置
              </button>
            </div>
          </>
        )}
        
        {/* 已配置 API Key 的提示 */}
        {llmConfig?.hasEncryptedKey && (
          <div style={{
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '16px' }}>✅</span>
            <span style={{
              fontSize: '13px',
              color: '#2e7d32',
              fontWeight: 500,
            }}>
              已配置自己的 API Key，无限次使用
            </span>
          </div>
        )}
        
        <div className="llm-config-info">
          <div className="llm-info-item">
            <span className="llm-info-label">提供商类型</span>
            <span className="llm-info-value">{getProviderName()}</span>
          </div>
          <div className="llm-info-item">
            <span className="llm-info-label">基础URL</span>
            <span className="llm-info-value llm-info-value-url" title={getBaseUrl()}>{getBaseUrl()}</span>
          </div>
          <div className="llm-info-item">
            <span className="llm-info-label">模型</span>
            <span className="llm-info-value">{getModel()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
