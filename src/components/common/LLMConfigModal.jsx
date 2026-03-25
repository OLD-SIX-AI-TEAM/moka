import { useState, useEffect } from "react";
import { LLM_PROVIDERS } from "../../services/llm";
import { useLanguage } from "../../hooks/useLanguage";

/**
 * LLM配置弹窗组件
 * 用于在没有配置时弹出让用户输入LLM信息
 */
export function LLMConfigModal({ isOpen, onClose, onSave, onDelete, initialConfig, hasConfig }) {
  const { t } = useLanguage();
  const [config, setConfig] = useState({
    provider: "aliyun",
    baseUrl: "",
    apiKey: "",
    model: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 当弹窗打开时，从 initialConfig 加载配置
  useEffect(() => {
    if (isOpen) {
      const provider = initialConfig?.provider || "aliyun";
      const providerConfig = LLM_PROVIDERS[provider];
      setConfig({
        provider: provider,
        baseUrl: initialConfig?.baseUrl || providerConfig?.defaultBaseUrl || "",
        // 如果有配置但 apiKey 为空（加密存储），显示占位符
        apiKey: initialConfig?.apiKey || (hasConfig ? "••••••••••••••••" : ""),
        model: initialConfig?.model || providerConfig?.defaultModel || "",
      });
    }
  }, [isOpen, initialConfig, hasConfig]);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleProviderChange = (provider) => {
    const providerConfig = LLM_PROVIDERS[provider];
    setConfig((prev) => ({
      ...prev,
      provider,
      baseUrl: providerConfig?.defaultBaseUrl || "",
      model: providerConfig?.defaultModel || "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!config.apiKey.trim()) {
      newErrors.apiKey = t('apiKeyRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSaving(true);
      try {
        await onSave({
          provider: config.provider,
          baseUrl: config.baseUrl.trim() || undefined,
          apiKey: config.apiKey.trim(),
          model: config.model.trim() || undefined,
        });
        onClose();
      } catch (error) {
        console.error('保存配置失败:', error);
        setErrors({ apiKey: t('saveFailed') });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('删除配置失败:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentProvider = LLM_PROVIDERS[config.provider];

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="llm-config-modal-content"
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "28px",
          width: "100%",
          maxWidth: "420px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "slideIn 0.2s ease-out",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#333" }}>
            🔧 {t('llmConfigTitle')}
          </h2>
          {/* <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#666", lineHeight: 1.5 }}>
            {t('llmConfigSubtitle')}
          </p> */}
        </div>

        <form onSubmit={handleSubmit}>
          {/* 提供商选择 */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#555",
                marginBottom: "6px",
              }}
            >
              {t('providerType')}
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {Object.entries(LLM_PROVIDERS).map(([key, provider]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleProviderChange(key)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: `2px solid ${config.provider === key ? "#4a7c59" : "#e0e0e0"}`,
                    backgroundColor: config.provider === key ? "#f0f7f2" : "#fff",
                    color: config.provider === key ? "#4a7c59" : "#666",
                    fontSize: "13px",
                    fontWeight: config.provider === key ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          {/* Base URL */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#555",
                marginBottom: "6px",
              }}
            >
              {t('baseUrlLabel')}
              <span style={{ fontWeight: 400, color: "#999", marginLeft: "4px" }}>
                ({t('baseUrlOptional')}: {currentProvider.defaultBaseUrl})
              </span>
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => handleChange("baseUrl", e.target.value)}
              placeholder={`${currentProvider.defaultBaseUrl}`}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* API Key */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#555",
                marginBottom: "6px",
              }}
            >
              {t('apiKey')} <span style={{ color: "var(--theme-primary)" }}>*</span>
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder={t('apiKeyPlaceholder')}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${errors.apiKey ? "#e05a4b" : "#e0e0e0"}`,
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.apiKey && (
              <span style={{ fontSize: "11px", color: "#e05a4b", marginTop: "4px", display: "block" }}>
                {errors.apiKey}
              </span>
            )}
            {config.provider === 'aliyun' && (
              <div style={{ marginTop: "8px", fontSize: "12px" }}>
                <span style={{ color: "#666" }}>{t('noApiKey')}</span>
                <a
                  href="https://bailian.console.aliyun.com/cn-beijing?tab=model#/api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#4a7c59",
                    textDecoration: "none",
                    fontWeight: 600,
                    marginLeft: "4px",
                  }}
                >
                  {t('goToProvider')}
                </a>
              </div>
            )}
          </div>

          {/* Model */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#555",
                marginBottom: "6px",
              }}
            >
              {t('modelLabel')}
              <span style={{ fontWeight: 400, color: "#999", marginLeft: "4px" }}>
                ({t('modelOptional')}: {currentProvider.defaultModel})
              </span>
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => handleChange("model", e.target.value)}
              placeholder={`${currentProvider.defaultModel}`}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* 按钮 */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                color: "#666",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#4a7c59",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? t('saving') : t('save')}
            </button>
          </div>

          {/* 删除配置按钮 - 仅在有配置时显示 */}
          {hasConfig && (
            <div style={{ marginTop: "16px", borderTop: "1px solid #e0e0e0", paddingTop: "16px" }}>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #e05a4b",
                    backgroundColor: "#fff",
                    color: "#e05a4b",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  🗑️ {t('delete')}
                </button>
              ) : (
                <div style={{
                  backgroundColor: "#fff5f5",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #ffcdd2",
                }}>
                  <p style={{
                    margin: "0 0 12px 0",
                    fontSize: "13px",
                    color: "#c62828",
                    textAlign: "center",
                  }}>
                    {t('deleteConfirm')}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#fff",
                        color: "#666",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#e05a4b",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        opacity: isDeleting ? 0.7 : 1,
                      }}
                    >
                      {isDeleting ? t('deleting') : t('confirmDelete')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
