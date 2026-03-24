import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 渲染单页卡片HTML
 */
function renderSinglePage(data, width) {
  const { styleConfig, content } = data;
  
  // 生成区块HTML
  const sectionsHtml = content.sections.map((section, index) => {
    const sectionStyle = styleConfig.sections?.[index] || styleConfig.sections?.[0] || {};
    const headingStyle = sectionStyle.heading || {};
    const textStyle = sectionStyle.text || {};
    
    return `
      <div class="section" style="
        background: ${sectionStyle.background || 'transparent'};
        border-left: ${sectionStyle.borderLeft || 'none'};
        border-radius: ${sectionStyle.borderRadius || '8px'};
        padding: ${sectionStyle.padding || '12px 16px'};
        margin-bottom: ${sectionStyle.marginBottom || '12px'};
      ">
        <div class="section-heading" style="
          font-size: ${headingStyle.fontSize || '16px'};
          color: ${headingStyle.color || '#333'};
          font-weight: ${headingStyle.fontWeight || '600'};
          margin-bottom: ${headingStyle.marginBottom || '8px'};
        ">
          ${headingStyle.before || ''} ${section.heading}
        </div>
        <div class="section-text" style="
          font-size: ${textStyle.fontSize || '14px'};
          color: ${textStyle.color || '#555'};
          line-height: ${textStyle.lineHeight || '1.7'};
        ">
          ${section.text}
        </div>
      </div>
    `;
  }).join('');

  // 生成标签HTML
  const tagsHtml = content.tags.map(tag => `
    <span class="tag" style="
      background: ${styleConfig.tags?.background || '#e9ecef'};
      color: ${styleConfig.tags?.color || '#495057'};
      font-size: ${styleConfig.tags?.fontSize || '12px'};
      padding: ${styleConfig.tags?.padding || '6px 12px'};
      border-radius: ${styleConfig.tags?.borderRadius || '16px'};
      margin: ${styleConfig.tags?.margin || '4px'};
      display: inline-block;
    ">${tag}</span>
  `).join('');

  // 生成装饰元素HTML
  const decorationsHtml = (styleConfig.decorations || []).map(dec => {
    const pos = dec.position || 'top-right';
    const posStyles = {
      'top-left': 'top: 0; left: 0;',
      'top-right': 'top: 0; right: 0;',
      'bottom-left': 'bottom: 0; left: 0;',
      'bottom-right': 'bottom: 0; right: 0;',
      'top-center': 'top: 0; left: 50%; transform: translateX(-50%);',
      'bottom-center': 'bottom: 0; left: 50%; transform: translateX(-50%);',
      'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
    };
    
    return `
      <div class="decoration ${dec.type}" style="
        position: absolute;
        ${posStyles[pos] || posStyles['top-right']}
        width: ${dec.style?.width || '100px'};
        height: ${dec.style?.height || '100px'};
        background: ${dec.style?.background || 'rgba(0,0,0,0.1)'};
        opacity: ${dec.style?.opacity || '0.3'};
        filter: ${dec.style?.blur ? `blur(${dec.style.blur})` : 'none'};
        border-radius: ${dec.type === 'circle' ? '50%' : dec.type === 'blob' ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '0'};
        pointer-events: none;
        z-index: 0;
      "></div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .card-container {
      width: ${width}px;
      position: relative;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="card-container" style="
    background: ${styleConfig.container?.background || '#fff'};
    padding: ${styleConfig.container?.padding || '28px'};
    border-radius: ${styleConfig.container?.borderRadius || '12px'};
    box-shadow: ${styleConfig.container?.boxShadow || 'none'};
  ">
    ${decorationsHtml}
    
    <!-- Header -->
    <div class="header" style="position: relative; z-index: 1;">
      <div class="category-row" style="margin-bottom: 12px;">
        <span class="emoji" style="font-size: 24px; margin-right: 8px;">${content.emoji}</span>
        <span class="category" style="
          font-size: 12px;
          color: #666;
          background: rgba(0,0,0,0.05);
          padding: 4px 10px;
          border-radius: 12px;
        ">${content.category}</span>
      </div>
      <h1 style="
        font-size: ${styleConfig.header?.title?.fontSize || '28px'};
        font-weight: ${styleConfig.header?.title?.fontWeight || '700'};
        color: ${styleConfig.header?.title?.color || '#1a1a1a'};
        margin-bottom: ${styleConfig.header?.title?.marginBottom || '12px'};
        line-height: ${styleConfig.header?.title?.lineHeight || '1.3'};
      ">${content.title}</h1>
      <p class="lead" style="
        font-size: ${styleConfig.lead?.fontSize || '14px'};
        color: ${styleConfig.lead?.color || '#666'};
        font-style: ${styleConfig.lead?.fontStyle || 'normal'};
        margin-bottom: ${styleConfig.lead?.marginBottom || '20px'};
        line-height: ${styleConfig.lead?.lineHeight || '1.6'};
      ">${content.lead}</p>
    </div>

    <!-- Sections -->
    <div class="sections" style="position: relative; z-index: 1;">
      ${sectionsHtml}
    </div>

    <!-- Tip -->
    ${content.tip ? `
    <div class="tip" style="
      background: ${styleConfig.tip?.background || '#fff3cd'};
      color: ${styleConfig.tip?.color || '#856404'};
      font-size: ${styleConfig.tip?.fontSize || '13px'};
      padding: ${styleConfig.tip?.padding || '12px 16px'};
      border-radius: ${styleConfig.tip?.borderRadius || '8px'};
      border-left: ${styleConfig.tip?.borderLeft || 'none'};
      margin-top: 16px;
      position: relative;
      z-index: 1;
    ">
      💡 ${content.tip}
    </div>
    ` : ''}

    <!-- Tags -->
    <div class="tags" style="
      margin-top: 20px;
      position: relative;
      z-index: 1;
    ">
      ${tagsHtml}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 渲染分页卡片HTML
 */
function renderSplitPages(data, width) {
  const { styleConfig, slides } = data;
  
  const slidesHtml = slides.map((slide, index) => {
    if (slide.type === 'cover') {
      return `
        <div class="slide cover" style="
          background: ${styleConfig.cover?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          min-height: 400px;
          page-break-after: always;
        ">
          <div class="emoji" style="
            font-size: ${styleConfig.cover?.emoji?.fontSize || '56px'};
            margin-bottom: ${styleConfig.cover?.emoji?.marginBottom || '20px'};
          ">${slide.emoji}</div>
          <h1 style="
            font-size: ${styleConfig.cover?.title?.fontSize || '32px'};
            font-weight: ${styleConfig.cover?.title?.fontWeight || '700'};
            color: ${styleConfig.cover?.title?.color || '#fff'};
            margin-bottom: ${styleConfig.cover?.title?.marginBottom || '12px'};
          ">${slide.title}</h1>
          <p style="
            font-size: ${styleConfig.cover?.subtitle?.fontSize || '16px'};
            color: ${styleConfig.cover?.subtitle?.color || 'rgba(255,255,255,0.8)'};
          ">${slide.subtitle}</p>
        </div>
      `;
    } else if (slide.type === 'content') {
      return `
        <div class="slide content" style="
          background: ${styleConfig.content?.background || '#fff'};
          padding: 32px;
          min-height: 400px;
          page-break-after: always;
        ">
          <h2 style="
            font-size: ${styleConfig.content?.heading?.fontSize || '22px'};
            font-weight: ${styleConfig.content?.heading?.fontWeight || '600'};
            color: ${styleConfig.content?.heading?.color || '#333'};
            margin-bottom: ${styleConfig.content?.heading?.marginBottom || '14px'};
          ">${slide.heading}</h2>
          <p style="
            font-size: ${styleConfig.content?.text?.fontSize || '15px'};
            color: ${styleConfig.content?.text?.color || '#555'};
            line-height: ${styleConfig.content?.text?.lineHeight || '1.8'};
            margin-bottom: ${styleConfig.content?.text?.marginBottom || '16px'};
          ">${slide.text}</p>
          ${slide.extra ? `
          <p style="
            font-size: ${styleConfig.content?.extra?.fontSize || '13px'};
            color: ${styleConfig.content?.extra?.color || '#888'};
            font-style: ${styleConfig.content?.extra?.fontStyle || 'italic'};
          ">${slide.extra}</p>
          ` : ''}
        </div>
      `;
    } else if (slide.type === 'end') {
      const tagsHtml = slide.tags.map(tag => `
        <span style="
          background: ${styleConfig.end?.tags?.background || '#e9ecef'};
          color: ${styleConfig.end?.tags?.color || '#495057'};
          font-size: ${styleConfig.end?.tags?.fontSize || '12px'};
          padding: ${styleConfig.end?.tags?.padding || '6px 12px'};
          border-radius: ${styleConfig.end?.tags?.borderRadius || '16px'};
          margin: ${styleConfig.end?.tags?.margin || '4px'};
          display: inline-block;
        ">${tag}</span>
      `).join('');
      
      return `
        <div class="slide end" style="
          background: ${styleConfig.end?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          min-height: 400px;
        ">
          <h2 style="
            font-size: ${styleConfig.end?.cta?.fontSize || '24px'};
            font-weight: ${styleConfig.end?.cta?.fontWeight || '700'};
            color: ${styleConfig.end?.cta?.color || '#fff'};
            margin-bottom: ${styleConfig.end?.cta?.marginBottom || '10px'};
          ">${slide.cta}</h2>
          <p style="
            font-size: ${styleConfig.end?.sub?.fontSize || '14px'};
            color: ${styleConfig.end?.sub?.color || 'rgba(255,255,255,0.8)'};
            margin-bottom: ${styleConfig.end?.sub?.marginBottom || '24px'};
          ">${slide.sub}</p>
          <div class="tags">${tagsHtml}</div>
        </div>
      `;
    }
    return '';
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .slides-container {
      width: ${width}px;
    }
    .slide {
      width: ${width}px;
    }
  </style>
</head>
<body>
  <div class="slides-container">
    ${slidesHtml}
  </div>
</body>
</html>
  `;
}

/**
 * 使用Puppeteer渲染HTML为图片
 */
export async function renderToImage(data, options = {}) {
  const { 
    mode = 'single', 
    width = 800, 
    quality = 'hd',
    outputPath = './output.png'
  } = options;
  
  const scale = quality === 'ultra' ? 4 : 2;
  const html = mode === 'single' 
    ? renderSinglePage(data, width)
    : renderSplitPages(data, width);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // 等待字体加载
    await page.evaluate(() => document.fonts.ready);
    
    // 获取内容高度
    const bodyHeight = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
    });

    // 设置视口
    await page.setViewport({
      width: parseInt(width),
      height: bodyHeight,
      deviceScaleFactor: scale
    });

    // 截图
    const element = await page.$('.card-container, .slides-container');
    await element.screenshot({
      path: outputPath,
      type: 'png',
      omitBackground: false
    });

    return {
      outputPath,
      width: parseInt(width),
      height: bodyHeight,
      scale
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
