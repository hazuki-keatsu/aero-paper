import { readFileSync } from "fs";
import { join } from "path";

/**
 * 从 CSS 内容中提取 CSS 变量
 * @param cssContent CSS 内容
 * @returns 包含 CSS 变量的对象
 */
export function extractCssVariables(cssContent: string): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // 匹配 CSS 变量定义，例如: --background: #fdfdfd;
  const variableRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match;
  
  while ((match = variableRegex.exec(cssContent)) !== null) {
    const variableName = match[1];
    const variableValue = match[2].trim();
    variables[variableName] = variableValue;
  }
  
  return variables;
}

/**
 * 从亮色模式CSS内容中提取CSS变量
 * @param cssContent CSS内容
 * @returns 包含亮色模式CSS变量的对象
 */
export function extractLightCssVariables(cssContent: string): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // 提取亮色模式下的CSS变量
  // 匹配 :root 或 html[data-theme="light"] 下的变量定义
  const lightThemeRegex = /(?::root|html\[data-theme="light"\])\s*{([^}]+)}/g;
  let match;
  
  while ((match = lightThemeRegex.exec(cssContent)) !== null) {
    const lightThemeContent = match[1];
    // 匹配CSS变量定义
    const variableRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
    let varMatch;
    
    while ((varMatch = variableRegex.exec(lightThemeContent)) !== null) {
      const variableName = varMatch[1];
      const variableValue = varMatch[2].trim();
      variables[variableName] = variableValue;
    }
  }
  
  return variables;
}

/**
 * 从 global.css 文件中提取 CSS 变量
 * @returns 包含所有 CSS 变量的对象
 */
export function getGlobalCssVariables(): Record<string, string> {
  try {
    // 读取 global.css 文件
    const globalCssPath = join(process.cwd(), "src", "styles", "global.css");
    const cssContent = readFileSync(globalCssPath, "utf-8");
    
    // 只提取亮色模式下的CSS变量
    return extractLightCssVariables(cssContent);
  } catch (error) {
    console.error("读取 global.css 文件时出错:", error);
    return {};
  }
}

/**
 * 获取主题色变量
 * @returns 主题色对象
 */
export function getThemeColors() {
  const variables = getGlobalCssVariables();
  
  return {
    background: variables.background || "#fdfdfd",
    foreground: variables.foreground || "#282728",
    accent: variables.accent || "#006cac",
    muted: variables.muted || "#e6e6e6",
    border: variables.border || "#ece9e9",
    highlightText: variables["highlight-text"] || "#ff6b6b",
    secondaryHighlight: variables["secondary-highlight"] || "#4ecdc4",
  };
}

export default getGlobalCssVariables;