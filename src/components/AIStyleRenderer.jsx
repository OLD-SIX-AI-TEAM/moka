import { EditableText } from './common/EditableText';
import { EditableEmoji } from './common/EditableEmoji';

export function AIStyleRenderer({ design, editor, emojiEditor }) {
  const { styleConfig, content } = design || {};
  
  // 安全检查：如果 design 或 content 为空，显示加载状态
  if (!design || !content) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        background: '#f5f5f5',
        borderRadius: '12px',
        color: '#999'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
        <div>正在生成AI设计...</div>
      </div>
    );
  }

  // 渲染装饰元素
  const renderDecorations = () => {
    if (!styleConfig.decorations || styleConfig.decorations.length === 0) return null;

    return styleConfig.decorations.map((dec, index) => {
      const positionStyles = {
        'top-left': { top: 0, left: 0 },
        'top-right': { top: 0, right: 0 },
        'bottom-left': { bottom: 0, left: 0 },
        'bottom-right': { bottom: 0, right: 0 },
        'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
        'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
        'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      };

      const baseStyle = {
        position: 'absolute',
        pointerEvents: 'none',
        ...positionStyles[dec.position],
        ...dec.style,
      };

      if (dec.type === 'circle') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              borderRadius: '50%',
            }}
          />
        );
      }

      if (dec.type === 'line') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              height: dec.style.height || '2px',
              width: dec.style.width || '100%',
            }}
          />
        );
      }

      if (dec.type === 'dots') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${dec.style.columns || 3}, 1fr)`,
              gap: dec.style.gap || '4px',
            }}
          >
            {Array.from({ length: (dec.style.columns || 3) * (dec.style.rows || 3) }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: dec.style.dotSize || '4px',
                  height: dec.style.dotSize || '4px',
                  borderRadius: '50%',
                  background: dec.style.color || '#000',
                }}
              />
            ))}
          </div>
        );
      }

      if (dec.type === 'gradient') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              background: dec.style.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
        );
      }

      if (dec.type === 'shape') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              ...dec.style,
            }}
          />
        );
      }

      // Blob - 不规则有机形状
      if (dec.type === 'blob') {
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              ...dec.style,
              borderRadius: dec.style.borderRadius || '60% 40% 30% 70% / 60% 30% 70% 40%',
            }}
          />
        );
      }

      // Pattern - 图案/纹理
      if (dec.type === 'pattern') {
        const patternType = dec.style.patternType || 'dots';
        
        if (patternType === 'dots') {
          return (
            <div
              key={index}
              style={{
                ...baseStyle,
                backgroundImage: `radial-gradient(circle, ${dec.style.color || '#000'} 1px, transparent 1px)`,
                backgroundSize: dec.style.size || '20px 20px',
                opacity: dec.style.opacity || 0.1,
              }}
            />
          );
        }
        
        if (patternType === 'grid') {
          return (
            <div
              key={index}
              style={{
                ...baseStyle,
                backgroundImage: `
                  linear-gradient(to right, ${dec.style.color || '#000'} 1px, transparent 1px),
                  linear-gradient(to bottom, ${dec.style.color || '#000'} 1px, transparent 1px)
                `,
                backgroundSize: dec.style.size || '40px 40px',
                opacity: dec.style.opacity || 0.1,
              }}
            />
          );
        }
        
        if (patternType === 'noise') {
          return (
            <div
              key={index}
              style={{
                ...baseStyle,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                opacity: dec.style.opacity || 0.05,
                mixBlendMode: 'overlay',
              }}
            />
          );
        }
        
        return null;
      }

      return null;
    });
  };

  const containerStyle = {
    ...styleConfig.container,
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      {/* 装饰元素 */}
      {renderDecorations()}

      {/* Header */}
      <div style={{ marginBottom: styleConfig.header?.title?.marginBottom || '16px' }}>
        {/* Category & Emoji */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          {content.emoji && (
            <EditableEmoji
              emoji={content.emoji}
              onEmojiChange={emojiEditor?.onEmojiChange}
              style={emojiEditor?.style || { fontSize: '24px' }}
              onStyleChange={emojiEditor?.onStyleChange}
            />
          )}
          {content.category && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: styleConfig.header?.title?.color || '#333',
                background: `${styleConfig.header?.title?.color || '#333'}15`,
                padding: '4px 10px',
                borderRadius: '12px',
              }}
            >
              {content.category}
            </span>
          )}
        </div>

        {/* Title */}
        <EditableText
          v={content.title}
          on={editor?.title}
          style={{
            fontSize: styleConfig.header?.title?.fontSize || '24px',
            fontWeight: styleConfig.header?.title?.fontWeight || 700,
            color: styleConfig.header?.title?.color || '#1a1a1a',
            lineHeight: 1.3,
            margin: 0,
          }}
          block
        />
      </div>

      {/* Lead */}
      {content.lead && (
        <EditableText
          v={content.lead}
          on={editor?.lead}
          style={{
            fontSize: styleConfig.lead?.fontSize || '14px',
            color: styleConfig.lead?.color || '#666',
            fontStyle: styleConfig.lead?.fontStyle || 'normal',
            lineHeight: 1.6,
            marginBottom: styleConfig.lead?.marginBottom || '20px',
            marginTop: 0,
          }}
          block
        />
      )}

      {/* Sections */}
      <div style={{ marginBottom: '20px' }}>
        {content.sections?.map((section, index) => {
          const sectionStyle = styleConfig.sections?.[index] || styleConfig.sections?.[0] || {};
          
          return (
            <div
              key={index}
              style={{
                marginBottom: sectionStyle.marginBottom || '16px',
                padding: sectionStyle.background ? '16px' : 0,
                background: sectionStyle.background || 'transparent',
                borderLeft: sectionStyle.borderLeft || 'none',
                borderRadius: sectionStyle.background ? '8px' : 0,
              }}
            >
              {/* Section Heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {sectionStyle.heading?.before && (
                  <span style={{ fontSize: sectionStyle.heading?.fontSize || '16px' }}>
                    {sectionStyle.heading.before}
                  </span>
                )}
                <EditableText
                  v={section.heading}
                  on={editor?.secH?.(index)}
                  style={{
                    fontSize: sectionStyle.heading?.fontSize || '16px',
                    fontWeight: sectionStyle.heading?.fontWeight || 600,
                    color: sectionStyle.heading?.color || '#333',
                    margin: 0,
                  }}
                />
              </div>

              {/* Section Text */}
              <EditableText
                v={section.text}
                on={editor?.secT?.(index)}
                style={{
                  fontSize: sectionStyle.text?.fontSize || '14px',
                  color: sectionStyle.text?.color || '#555',
                  lineHeight: sectionStyle.text?.lineHeight || 1.7,
                  margin: 0,
                }}
                block
              />
            </div>
          );
        })}
      </div>

      {/* Tip */}
      {content.tip && (
        <EditableText
          v={content.tip}
          on={editor?.tip}
          style={{
            fontSize: styleConfig.tip?.fontSize || '13px',
            color: styleConfig.tip?.color || '#666',
            background: styleConfig.tip?.background || '#f5f5f5',
            padding: styleConfig.tip?.padding || '12px 16px',
            borderRadius: styleConfig.tip?.borderRadius || '8px',
            marginBottom: '20px',
            fontStyle: 'italic',
          }}
          block
        />
      )}

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: styleConfig.tags?.margin || '8px' }}>
          {content.tags.map((tag, index) => (
            <EditableText
              key={index}
              v={`#${tag}`}
              on={editor?.tag?.(index)}
              style={{
                fontSize: styleConfig.tags?.fontSize || '12px',
                color: styleConfig.tags?.color || '#888',
                background: styleConfig.tags?.background || '#f0f0f0',
                padding: styleConfig.tags?.padding || '6px 12px',
                borderRadius: styleConfig.tags?.borderRadius || '16px',
                fontWeight: 500,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AIStyleRenderer;