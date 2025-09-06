import { getCollection } from "astro:content";
import postFilter from "./postFilter";
import { getPath } from "./getPath";

export interface BlogStats {
  totalPosts: number;
  totalWords: number;
  totalCharacters: number;
  averageWordsPerPost: number;
  yearlyStats: {
    year: number;
    posts: number;
    words: number;
  }[];
  monthlyStats: {
    year: number;
    month: number;
    monthName: string;
    posts: number;
    words: number;
  }[];
  tagStats: {
    tag: string;
    count: number;
    percentage: number;
  }[];
  longestPost: {
    title: string;
    id: string;
    path: string;
    words: number;
  } | null;
  shortestPost: {
    title: string;
    id: string;
    path: string;
    words: number;
  } | null;
  firstPost: {
    title: string;
    id: string;
    path: string;
    date: Date;
  } | null;
  latestPost: {
    title: string;
    id: string;
    path: string;
    date: Date;
  } | null;
}

// 计算中文和英文字数
export function countWords(text: string): number {
  // 移除 Markdown 语法
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除内联代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/#+ /g, '') // 移除标题标记
    .replace(/[*_]{1,2}(.*?)[*_]{1,2}/g, '$1') // 移除粗体和斜体标记
    .replace(/^> /gm, '') // 移除引用标记
    .replace(/^- /gm, '') // 移除列表标记
    .replace(/^\d+\. /gm, '') // 移除有序列表标记
    .replace(/\n+/g, ' ') // 替换换行为空格
    .replace(/\s+/g, ' ') // 合并多个空格
    .trim();

  // 分别计算中文字符和英文单词
  const chineseChars = (cleanText.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fff]/g, ' ') // 移除中文字符
    .split(/\s+/)
    .filter(word => word.length > 0 && /[a-zA-Z]/.test(word)).length;

  return chineseChars + englishWords;
}

// 计算字符数（不包括空格）
function countCharacters(text: string): number {
  return text.replace(/\s/g, '').length;
}

// 获取月份名称
function getMonthName(month: number): string {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return months[month - 1];
}

export async function getBlogStats(): Promise<BlogStats> {
  const allPosts = await getCollection("blog");
  const posts = allPosts.filter(postFilter);

  if (posts.length === 0) {
    return {
      totalPosts: 0,
      totalWords: 0,
      totalCharacters: 0,
      averageWordsPerPost: 0,
      yearlyStats: [],
      monthlyStats: [],
      tagStats: [],
      longestPost: null,
      shortestPost: null,
      firstPost: null,
      latestPost: null,
    };
  }

  // 计算基本统计
  let totalWords = 0;
  let totalCharacters = 0;
  const yearlyMap = new Map<number, { posts: number; words: number }>();
  const monthlyMap = new Map<string, { year: number; month: number; posts: number; words: number }>();
  const tagMap = new Map<string, number>();
  
  let longestPost: { title: string; id: string; path: string; words: number } | null = null;
  let shortestPost: { title: string; id: string; path: string; words: number } | null = null;

  // 按时间排序获取第一篇和最新的文章
  const sortedPosts = posts.sort((a, b) => 
    new Date(a.data.pubDatetime).getTime() - new Date(b.data.pubDatetime).getTime()
  );

  const firstPost = sortedPosts[0] ? {
    title: sortedPosts[0].data.title,
    id: sortedPosts[0].id,
    path: getPath(sortedPosts[0].id, sortedPosts[0].filePath),
    date: new Date(sortedPosts[0].data.pubDatetime)
  } : null;

  const latestPost = sortedPosts[sortedPosts.length - 1] ? {
    title: sortedPosts[sortedPosts.length - 1].data.title,
    id: sortedPosts[sortedPosts.length - 1].id,
    path: getPath(sortedPosts[sortedPosts.length - 1].id, sortedPosts[sortedPosts.length - 1].filePath),
    date: new Date(sortedPosts[sortedPosts.length - 1].data.pubDatetime)
  } : null;

  for (const post of posts) {
    const content = post.body || '';
    const words = countWords(content);
    const characters = countCharacters(content);
    
    totalWords += words;
    totalCharacters += characters;

    // 更新最长和最短文章
    if (!longestPost || words > longestPost.words) {
      longestPost = { 
        title: post.data.title, 
        id: post.id, 
        path: getPath(post.id, post.filePath),
        words 
      };
    }
    if (!shortestPost || words < shortestPost.words) {
      shortestPost = { 
        title: post.data.title, 
        id: post.id, 
        path: getPath(post.id, post.filePath),
        words 
      };
    }

    // 年度统计
    const year = new Date(post.data.pubDatetime).getFullYear();
    const yearlyStats = yearlyMap.get(year) || { posts: 0, words: 0 };
    yearlyStats.posts += 1;
    yearlyStats.words += words;
    yearlyMap.set(year, yearlyStats);

    // 月度统计
    const month = new Date(post.data.pubDatetime).getMonth() + 1;
    const monthKey = `${year}-${month}`;
    const monthlyStats = monthlyMap.get(monthKey) || { year, month, posts: 0, words: 0 };
    monthlyStats.posts += 1;
    monthlyStats.words += words;
    monthlyMap.set(monthKey, monthlyStats);

    // 标签统计
    post.data.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  }

  // 转换为数组并排序
  const yearlyStats = Array.from(yearlyMap.entries())
    .map(([year, stats]) => ({ year, ...stats }))
    .sort((a, b) => b.year - a.year);

  const monthlyStats = Array.from(monthlyMap.entries())
    .map(([, stats]) => ({ ...stats, monthName: getMonthName(stats.month) }))
    .sort((a, b) => b.year - a.year || b.month - a.month);

  const totalTagCount = Array.from(tagMap.values()).reduce((sum, count) => sum + count, 0);
  const tagStats = Array.from(tagMap.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / totalTagCount) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 只显示前10个标签

  return {
    totalPosts: posts.length,
    totalWords,
    totalCharacters,
    averageWordsPerPost: Math.round(totalWords / posts.length),
    yearlyStats,
    monthlyStats,
    tagStats,
    longestPost,
    shortestPost,
    firstPost,
    latestPost,
  };
}
