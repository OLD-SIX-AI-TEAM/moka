import { useState } from "react";
import { LLM_PROVIDERS } from "../../services/llm";

/**
 * LLM配置弹窗组件
 * 用于在没有配置时弹出让用户输入LLM信息
 */
export function LLMConfigModal({ isOpen, onClose, onSave, initialConfig }) {
  const [config, setConfig] = useState(() => ({
    provider: initialConfig?.provider || "openai",
    baseUrl: initialConfig?.baseUrl || "",
    apiKey: initialConfig?.apiKey || "",
    model: initialConfig?.model || "",
  }));
  const [errors, setErrors] = useState({});



  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleProviderChange = (provider) => {
    setConfig((prev) => ({
      ...prev,
      provider,
      baseUrl: "",
      model: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!config.apiKey.trim()) {
      newErrors.apiKey = "请输入API Key";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        provider: config.provider,
        baseUrl: config.baseUrl.trim() || undefined,
        apiKey: config.apiKey.trim(),
        model: config.model.trim() || undefined,
      });
      onClose();
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
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "28px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "slideIn 0.2s ease-out",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#333" }}>
            🔧 配置 LLM
          </h2>
          <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#666", lineHeight: 1.5 }}>
            未检测到LLM配置，请填写以下信息以继续使用AI生成功能
          </p>
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
              提供商
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
                  {provider.name}
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
              Base URL
              <span style={{ fontWeight: 400, color: "#999", marginLeft: "4px" }}>
                (可选，默认: {currentProvider.defaultBaseUrl})
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
              API Key <span style={{ color: "#e05a4b" }}>*</span>
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder="请输入您的API Key"
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
              模型
              <span style={{ fontWeight: 400, color: "#999", marginLeft: "4px" }}>
                (可选，默认: {currentProvider.defaultModel})
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
              取消
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#4a7c59",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              保存配置
            </button>
          </div>
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
