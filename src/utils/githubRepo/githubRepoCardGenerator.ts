// 仓库数据类型定义
export interface RepositoryData {
  name: string;
  nameWithOwner: string;
  description?: string;
  primaryLanguage?: {
    name: string;
    color: string;
  };
  isArchived: boolean;
  isTemplate: boolean;
  starCount: number;
  forkCount: number;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

// 卡片配置选项
export interface RepoCardOptions {
  hideBorder?: boolean;
  titleColor?: string;
  iconColor?: string;
  textColor?: string;
  bgColor?: string;
  showOwner?: boolean;
  showAvatar?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  borderRadius?: number;
  borderColor?: string;
  locale?: string;
  descriptionLines?: number;
  width?: string;
  maxWidth?: string;
}

// 国际化翻译映射
const translations = {
  en: {
    archived: 'Archived',
    template: 'Template',
    updated: 'Updated',
  },
  zh: {
    archived: '已归档',
    template: '模板',
    updated: '更新于',
  },
};

// 工具函数：数字格式化（1.2k, 3.4k等）
const kFormatter = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 工具函数：文本换行处理
const wrapText = (text: string, maxLength: number, maxLines: number): string[] => {
  if (!text) return [];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const potentialLine = `${currentLine} ${word}`;
    
    if (potentialLine.length <= maxLength && lines.length < maxLines) {
      currentLine = potentialLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
      
      // 达到最大行数时截断
      if (lines.length >= maxLines - 1) {
        currentLine += '...';
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
};

// 工具函数：值范围限制
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// 工具函数：获取卡片颜色配置
const getColors = (options: RepoCardOptions) => {
  // 基础主题颜色
  const themes = {
    light: {
      bg: '#ffffff',
      title: '#0366d6',
      text: '#586069',
      icon: '#6a737d',
      border: '#e1e4e8',
    },
    dark: {
      bg: '#2d3748',
      title: '#61dafb',
      text: '#e2e8f0',
      icon: '#cbd5e0',
      border: '#4a5568',
    },
  };

  // 自动检测主题（这里简化处理，实际项目中可根据系统主题检测）
  const theme = options.theme === 'auto' ? 'light' : options.theme || 'light';
  const baseColors = themes[theme];

  // 合并用户自定义颜色
  return {
    bg: options.bgColor || baseColors.bg,
    title: options.titleColor || baseColors.title,
    text: options.textColor || baseColors.text,
    icon: options.iconColor || baseColors.icon,
    border: options.borderColor || baseColors.border,
  };
};

// 星星图标SVG
const getStarIcon = (color: string) => `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="${color}"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    class="inline mr-1"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
`;

// 分支图标SVG
const getForkIcon = (color: string) => `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="${color}"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    class="inline mr-1"
  >
    <path d="M12 18v-6" />
    <path d="M18 15c3 0 3-3 0-3" />
    <path d="M6 15c-3 0-3-3 0-3" />
    <path d="M15 6c0-3-3-3-3-3s-3 3-3 3" />
  </svg>
`;

/**
 * 生成GitHub仓库卡片的HTML字符串
 * @param repo 仓库数据
 * @param options 卡片配置选项
 * @returns 仓库卡片的HTML字符串
 */
export function generateGithubRepoCard(
  repo: RepositoryData,
  options: RepoCardOptions = {}
): string {
  const {
    name,
    nameWithOwner,
    description,
    primaryLanguage,
    isArchived,
    isTemplate,
    starCount,
    forkCount,
    updatedAt,
    owner,
  } = repo;

  // 处理配置选项
  const {
    hideBorder = false,
    showOwner = true,
    showAvatar = true,
    borderRadius = 6,
    descriptionLines = 3,
    locale = 'en',
    width = '100%',
    maxWidth = '400px',
  } = options;

  // 计算卡片高度（基于描述行数动态调整）
  const maxDescriptionLines = clamp(descriptionLines, 1, 5);
  const descLines = wrapText(description || 'No description', 55, maxDescriptionLines);

  // 获取颜色配置
  const colors = getColors(options);

  // 格式化更新时间
  const formattedDate = new Date(updatedAt).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 获取国际化文本
  const t = translations[locale as keyof typeof translations] || translations.en;

  // 构建所有者和仓库标题部分
  const titleContent = showOwner ? nameWithOwner : name;
  
  // 构建描述部分
  const descriptionHtml = descLines.length > 0 
    ? descLines.map((line, index) => `
        <p style="color: ${colors.text}; font-size: 0.875rem; margin: 0; margin-top: ${index > 0 ? '0.25rem' : 0}">
          ${line}
        </p>
      `).join('')
    : '';
  
  // 构建状态徽章部分
  const statusBadges = [];
  if (isArchived) {
    statusBadges.push(`
      <span style="background-color: ${colors.border}33; color: ${colors.text}; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 12px; margin-right: 0.5rem;">
        ${t.archived}
      </span>
    `);
  }
  if (isTemplate) {
    statusBadges.push(`
      <span style="background-color: ${colors.border}33; color: ${colors.text}; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 12px; margin-right: 0.5rem;">
        ${t.template}
      </span>
    `);
  }
  const statusBadgesHtml = statusBadges.length > 0 
    ? `<div style="margin-bottom: 0.75rem;">${statusBadges.join('')}</div>`
    : '';
  
  // 构建统计信息部分
  const statsItems = [];
  
  // 星标数
  statsItems.push(`
    <div style="color: ${colors.text}; font-size: 0.875rem; display: flex; align-items: center;">
      ${getStarIcon(colors.icon)}
      <span>${kFormatter(starCount)}</span>
    </div>
  `);
  
  // 分支数
  statsItems.push(`
    <div style="color: ${colors.text}; font-size: 0.875rem; display: flex; align-items: center;">
      ${getForkIcon(colors.icon)}
      <span>${kFormatter(forkCount)}</span>
    </div>
  `);
  
  // 主要语言
  if (primaryLanguage) {
    statsItems.push(`
      <div style="color: ${colors.text}; font-size: 0.875rem; display: flex; align-items: center;">
        <span style="width: 0.75rem; height: 0.75rem; border-radius: 50%; background-color: ${primaryLanguage.color}; margin-right: 0.25rem; display: inline-block;"></span>
        <span>${primaryLanguage.name}</span>
      </div>
    `);
  }
  
  // 更新时间
  statsItems.push(`
    <div style="color: ${colors.text}; font-size: 0.875rem; margin-left: auto;">
      ${t.updated} ${formattedDate}
    </div>
  `);
  
  const statsHtml = `
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
      ${statsItems.join('')}
    </div>
  `;

  // 构建头像部分
  const avatarHtml = showAvatar ? `
    <img 
      src="${owner.avatarUrl}" 
      alt="${owner.login} avatar"
      style="width: 24px; height: 24px; border-radius: 50%; margin-right: 0.75rem;"
    >
  ` : '';

  // 构建完整卡片HTML
  return `
    <div
      style="
        background-color: ${colors.bg};
        border: ${hideBorder ? 'none' : `1px solid ${colors.border}`};
        border-radius: ${borderRadius}px;
        width: ${width};
        max-width: ${maxWidth};
        padding: 1.25rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      "
    >
      <!-- 仓库标题和头像 -->
      <div style="margin-bottom: 0.75rem; display: flex; align-items: center;">
        ${avatarHtml}
        <h3 style="color: ${colors.title}; font-size: 1.1rem; font-weight: 600; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${titleContent}
        </h3>
      </div>

      <!-- 仓库描述 -->
      ${descriptionHtml ? `<div style="margin-bottom: 0.75rem;">${descriptionHtml}</div>` : ''}

      <!-- 状态徽章 -->
      ${statusBadgesHtml}

      <!-- 统计信息 -->
      ${statsHtml}
    </div>
  `;
}

export default generateGithubRepoCard;
    