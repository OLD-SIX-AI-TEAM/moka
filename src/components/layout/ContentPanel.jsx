/** @jsxImportSource react */
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { Dots } from "../common/Icons";
import { LLM_PROVIDERS } from "../../services/llm";
import { useLanguage } from "../../hooks/useLanguage";

export const ContentPanel = forwardRef(function ContentPanel({
  mode,
  setMode,
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
  mobileActive,
}, ref) {
  const { t } = useLanguage();
  const textareaRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 获取显示的 provider 名称
  const getProviderName = () => {
    const provider = llmConfig?.provider || "aliyun";
    // 使用翻译键
    const key = provider === "aliyun" ? "aliyunProviderName" : provider;
    return t(key) || LLM_PROVIDERS[provider]?.name || "阿里云百炼";
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
  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUsage(data);
        }
      }
    } catch (e) {
      // 静默处理
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    refreshUsage: fetchUsage,
  }));

  return (
    <div className={`content-panel ${mobileActive ? 'mobile-active' : ''}`}>
      {/* 移动端单页/多页切换 */}
      <div className="panel-section mobile-mode-section">
        <h3 className="section-title">{t('pageMode') || '页面模式'}</h3>
        <div className="mobile-mode-switcher-inline">
          <button
            className={`mobile-mode-btn-inline ${mode === 'single' ? 'active' : ''}`}
            onClick={() => !loading && setMode('single')}
            disabled={loading}
          >
            <span className="mobile-mode-icon">📄</span>
            <span>{t('singleMode')}</span>
          </button>
          <button
            className={`mobile-mode-btn-inline ${mode === 'split' ? 'active' : ''}`}
            onClick={() => !loading && setMode('split')}
            disabled={loading}
          >
            <span className="mobile-mode-icon">📑</span>
            <span>{t('multiMode')}</span>
          </button>
        </div>
      </div>

      {/* 平台选择 - 仅在分页模式下显示 */}
      {mode === "split" && (
        <div className="panel-section">
          <h3 className="section-title">{t('platform')}</h3>
          <div className="platform-cards">
            <button
              className={`platform-card ${platform === "xhs" ? "active" : ""}`}
              onClick={() => setPlatform("xhs")}
            >
              <span className="platform-emoji">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <div className="platform-info">
                <span className="platform-name">{t('xiaohongshu')}</span>
                <span className="platform-desc">{t('xiaohongshuDesc')}</span>
              </div>
            </button>
            
            <button
              className={`platform-card ${platform === "wechat" ? "active" : ""}`}
              onClick={() => setPlatform("wechat")}
            >
              <span className="platform-emoji">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <div className="platform-info">
                <span className="platform-name">{t('wechat')}</span>
                <span className="platform-desc">{t('wechatDesc')}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 文案输入 */}
      <div className="panel-section content-section">
        <h3 className="section-title">{t('content')}</h3>
        <textarea
          ref={textareaRef}
          className="content-input-large"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "single"
            ? t('contentPlaceholderSingle')
            : t('contentPlaceholderMulti')
          }
          rows={6}
          autoFocus
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
              <span>{t('generating')}</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>{mode === "single" ? t('generateLayout') : t('generateCards')}</span>
            </>
          )}
        </button>
        
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* LLM配置 */}
      <div className="panel-section llm-section">
        <div className="llm-config-header">
          <h3 className="section-title">{t('aiConfig')}</h3>
          <button
            className="llm-config-btn"
            onClick={onOpenLLMConfig}
            title={t('edit')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>{t('edit')}</span>
          </button>
        </div>
        
        {/* 免费体验提示 - 仅当没有配置自己的 API Key 时显示 */}
        {!llmConfig?.hasEncryptedKey && (
          <>
            <div style={{
              background: 'var(--theme-gradient)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span style={{
                  fontSize: '13px',
                  color: '#fff',
                  fontWeight: 500,
                }}>
                  {t('freeTrial')}
                </span>
              </div>
              <span style={{
                fontSize: '12px',
                color: '#fff',
                fontWeight: 600,
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                {usage.dailyRemaining}/{usage.dailyMax} {t('leftToday')}
              </span>
            </div>
            
            {/* 建议配置自己的 API Key */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm) var(--space-md)',
              marginBottom: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              border: '1px solid var(--border-light)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                flex: 1,
              }}>
                {t('configureApiKey')}
              </span>
              <button
                onClick={onOpenLLMConfig}
                style={{
                  fontSize: '11px',
                  color: 'var(--theme-primary)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--theme-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {t('configure')}
              </button>
            </div>
          </>
        )}
        
        {/* 已配置 API Key 的提示 */}
        {llmConfig?.hasEncryptedKey && (
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm) var(--space-md)',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            border: '1px solid #22c55e',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span style={{
              fontSize: '12px',
              color: '#22c55e',
              fontWeight: 500,
            }}>
              {t('apiKeyConfigured')}
            </span>
          </div>
        )}
        
        <div className="llm-config-info">
          <div className="llm-info-item">
            <span className="llm-info-label">{t('provider')}</span>
            <span className="llm-info-value">{getProviderName()}</span>
          </div>
          <div className="llm-info-item">
            <span className="llm-info-label">{t('baseUrl')}</span>
            <span className="llm-info-value llm-info-value-url" title={getBaseUrl()}>{getBaseUrl()}</span>
          </div>
          <div className="llm-info-item">
            <span className="llm-info-label">{t('model')}</span>
            <span className="llm-info-value">{getModel()}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
