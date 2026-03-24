/** @jsxImportSource react */
import { PALETTES } from "../../constants";

export function Header({ palette }) {
  return (
    <header className="app-header">
      <h1 className="app-title">小红书排版生成器</h1>
      <p className="app-subtitle">
        智能排版 · 一键生成 · <span style={{ color: palette.a }}>点击文字可直接编辑</span>
      </p>
    </header>
  );
}
