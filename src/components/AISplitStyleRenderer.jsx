import { EditableText } from './common/EditableText';
import { EditableEmoji } from './common/EditableEmoji';

export function AISplitStyleRenderer({ slides, styleConfig, editors, slideIdx, emojiEditor }) {
  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[slideIdx];
  const editor = editors ? editors[slideIdx] : null;

  // 渲染装饰元素
  const renderDecorations = () => {
    if (!styleConfig.decorations || styleConfig.decorations.length === 0) return null;

    return styleConfig.decorations.map((dec, index) => {
      // 检查装饰是否应用于当前幻灯片
      if (dec.slide && dec.slide !== 'all' && dec.slide !== currentSlide.type) {
        return null;
      }

      const positionStyles = {
        'top-left': { top: 0, left: 0 },
        'top-right': { top: 0, right: 0 },
        'bottom-left': { bottom: 0, left: 0 },
        'bottom-right': { bottom: 0, right: 0 },
        'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
        'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
        'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      };

      const getBorderRadius = () => {
        if (dec.type === 'circle') return '50%';
        if (dec.type === 'blob') return dec.style?.borderRadius || '60% 40% 30% 70% / 60% 30% 70% 40%';
        return dec.style?.borderRadius;
      };

      // Pattern 类型特殊处理
      if (dec.type === 'pattern') {
        const patternType = dec.style?.patternType || 'dots';
        let patternStyle = {};
        
        if (patternType === 'dots') {
          patternStyle = {
            backgroundImage: `radial-gradient(circle, ${dec.style?.color || '#000'} 1px, transparent 1px)`,
            backgroundSize: dec.style?.size || '20px 20px',
          };
        } else if (patternType === 'grid') {
          patternStyle = {
            backgroundImage: `
              linear-gradient(to right, ${dec.style?.color || '#000'} 1px, transparent 1px),
              linear-gradient(to bottom, ${dec.style?.color || '#000'} 1px, transparent 1px)
            `,
            backgroundSize: dec.style?.size || '40px 40px',
          };
        } else if (patternType === 'noise') {
          patternStyle = {
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          };
        }
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              ...positionStyles[dec.position || 'top-right'],
              ...dec.style,
              ...patternStyle,
            }}
          />
        );
      }

      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            ...positionStyles[dec.position || 'top-right'],
            ...dec.style,
            borderRadius: getBorderRadius(),
          }}
        />
      );
    });
  };

  const containerStyle = {
    padding: '32px',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    width: '420px',
    height: '560px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxSizing: 'border-box',
  };

  // 封面页
  if (currentSlide.type === 'cover') {
    const coverStyle = styleConfig.cover || {};
    return (
      <div style={{ ...containerStyle, background: coverStyle.background || '#667eea' }}>
        {renderDecorations()}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          {currentSlide.emoji && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EditableEmoji
                emoji={currentSlide.emoji}
                onEmojiChange={emojiEditor?.onEmojiChange}
                style={emojiEditor?.style || { 
                  fontSize: coverStyle.emoji?.fontSize || '48px', 
                  marginBottom: coverStyle.emoji?.marginBottom || '16px' 
                }}
                onStyleChange={emojiEditor?.onStyleChange}
                align="center"
              />
            </div>
          )}
          <EditableText
            v={currentSlide.title}
            on={editor?.title}
            style={{
              fontSize: coverStyle.title?.fontSize || '28px',
              fontWeight: coverStyle.title?.fontWeight || 700,
              color: coverStyle.title?.color || '#ffffff',
              marginBottom: coverStyle.title?.marginBottom || '12px',
              lineHeight: 1.3,
            }}
            block
          />
          <EditableText
            v={currentSlide.subtitle}
            on={editor?.subtitle}
            style={{
              fontSize: coverStyle.subtitle?.fontSize || '14px',
              color: coverStyle.subtitle?.color || 'rgba(255,255,255,0.9)',
              lineHeight: 1.5,
            }}
            block
          />
        </div>
      </div>
    );
  }

  // 内容页
  if (currentSlide.type === 'content') {
    const contentStyle = styleConfig.content || {};
    return (
      <div style={{ ...containerStyle, background: contentStyle.background || '#ffffff', justifyContent: 'flex-start', paddingTop: '40px' }}>
        {renderDecorations()}
        <div style={{ zIndex: 1 }}>
          <EditableText
            v={currentSlide.heading}
            on={editor?.heading}
            style={{
              fontSize: contentStyle.heading?.fontSize || '20px',
              fontWeight: contentStyle.heading?.fontWeight || 600,
              color: contentStyle.heading?.color || '#1a1a1a',
              marginBottom: contentStyle.heading?.marginBottom || '12px',
            }}
            block
          />
          <EditableText
            v={currentSlide.text}
            on={editor?.text}
            style={{
              fontSize: contentStyle.text?.fontSize || '15px',
              color: contentStyle.text?.color || '#333333',
              lineHeight: contentStyle.text?.lineHeight || 1.8,
              marginBottom: contentStyle.text?.marginBottom || '16px',
            }}
            block
          />
          {currentSlide.extra && (
            <EditableText
              v={currentSlide.extra}
              on={editor?.extra}
              style={{
                fontSize: contentStyle.extra?.fontSize || '13px',
                color: contentStyle.extra?.color || '#666666',
                fontStyle: contentStyle.extra?.fontStyle || 'italic',
                borderTop: '1px solid #eee',
                paddingTop: '12px',
              }}
              block
            />
          )}
        </div>
      </div>
    );
  }

  // 结尾页
  if (currentSlide.type === 'end') {
    const endStyle = styleConfig.end || {};
    const tagsStyle = endStyle.tags || {};
    return (
      <div style={{ ...containerStyle, background: endStyle.background || '#f8f9fa' }}>
        {renderDecorations()}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <EditableText
            v={currentSlide.cta}
            on={editor?.cta}
            style={{
              fontSize: endStyle.cta?.fontSize || '22px',
              fontWeight: endStyle.cta?.fontWeight || 700,
              color: endStyle.cta?.color || '#1a1a1a',
              marginBottom: endStyle.cta?.marginBottom || '8px',
            }}
            block
          />
          <EditableText
            v={currentSlide.sub}
            on={editor?.sub}
            style={{
              fontSize: endStyle.sub?.fontSize || '14px',
              color: endStyle.sub?.color || '#666666',
              marginBottom: endStyle.sub?.marginBottom || '20px',
            }}
            block
          />
          {currentSlide.tags && currentSlide.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: tagsStyle.margin || '4px' }}>
              {currentSlide.tags.map((tag, index) => (
                <EditableText
                  key={index}
                  v={`#${tag}`}
                  on={editor?.tag?.(index)}
                  style={{
                    fontSize: tagsStyle.fontSize || '12px',
                    color: tagsStyle.color || '#495057',
                    background: tagsStyle.background || '#e9ecef',
                    padding: tagsStyle.padding || '6px 12px',
                    borderRadius: tagsStyle.borderRadius || '16px',
                    fontWeight: 500,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default AISplitStyleRenderer;
