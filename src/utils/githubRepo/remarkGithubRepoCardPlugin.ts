import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root, Text, Parent } from 'mdast';
import fetchGithubRepoData from './fetchGithubRepoData';
import generateGithubRepoCard from './githubRepoCardGenerator';

// 匹配自定义语法的正则（解析 user、repo、theme 等属性）
const GITHUB_CARD_REGEX = /^::github-card\{([^}]+)\}$/;

// 解析属性字符串（如 'user="a" repo="b"' 转为 { user: 'a', repo: 'b' }）
const parseAttributes = (attrStr: string) => {
  const attrs: Record<string, string> = {};
  // 关键优化：允许属性之间有逗号、空格，且兼容最后一个属性无分隔符的情况
  const regex = /(\w+)="([^"]+)"\s*(?:,|$)/g;
  
  let match;
  // 循环匹配所有属性
  while ((match = regex.exec(attrStr)) !== null) {
    const [, key, value] = match;
    attrs[key] = value;
  }
  
  console.log(attrs);

  return attrs;
};

// remark 插件：替换自定义语法为仓库卡片 HTML
const remarkGithubCard: Plugin<[], Root> = () => {
  console.log("remarkGithubCardPlugin Initial - 插件被调用了！ v2");
  
  return (tree: Root) => {
    console.log("remarkGithubCardPlugin - 处理 AST 树，节点数量:", tree.children.length);
    
    const nodesToReplace: Array<{
      parent: Parent;
      index: number;
      node: Text;
      attrs: Record<string, string>;
    }> = [];    // 遍历 Markdown AST，寻找符合自定义语法的文本节点
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined || typeof node.value !== 'string') return;
      
      const match = node.value.match(GITHUB_CARD_REGEX);
      if (!match) return;
      
      // 解析属性
      const attrs = parseAttributes(match[1]);
      const { user, repo } = attrs;
      
      if (!user || !repo) {
        console.warn('缺少 user 或 repo 属性：', node.value);
        return;
      }

      nodesToReplace.push({
        parent,
        index: index as number,
        node,
        attrs
      });
    });

    // 异步处理所有需要替换的节点
    const promises = nodesToReplace.map(async ({ parent, index, attrs }) => {
      const { user, repo, theme = 'light' } = attrs;
      
      try {
        // 获取仓库数据（自动使用缓存）
        const repoData = await fetchGithubRepoData(user, repo);
        
        // 生成卡片 HTML
        const cardHtml = generateGithubRepoCard(repoData, { 
          theme: theme as 'light' | 'dark' | 'auto' 
        });
        
        // 替换当前文本节点为 HTML 节点（使用 raw 类型确保 HTML 不被转义）
        parent.children[index] = {
          type: 'html',
          value: cardHtml
        };
      } catch (err) {
        console.error(`生成仓库卡片失败（${user}/${repo}）：`, err);
        // 失败时保留原始语法，避免破坏文档
        parent.children[index] = {
          type: 'text',
          value: `[仓库卡片加载失败：${(err as Error).message}]`
        };
      }
    });

    // 等待所有异步操作完成
    return Promise.all(promises).then(() => tree);
  };
};

export default remarkGithubCard;
export { remarkGithubCard };