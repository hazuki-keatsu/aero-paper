import type { RepositoryData } from './githubRepoCardGenerator';

/**
 * 通过GitHub用户名和仓库名获取仓库信息
 * @param username GitHub用户名
 * @param repoName 仓库名称
 * @param token 可选的GitHub访问令牌（用于提高API速率限制）
 * @returns 符合RepositoryData接口的仓库信息
 * @throws 当请求失败或仓库不存在时抛出错误
 */
export async function fetchGithubRepoData(
    username: string,
    repoName: string,
    token?: string
): Promise<RepositoryData> {
    // GitHub API端点
    const apiUrl = `https://api.github.com/repos/${username}/${repoName}`;

    // 请求头配置
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub Repo Card Generator' // GitHub API要求设置User-Agent
    };

    // 如果提供了访问令牌，添加到请求头
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    try {
        // 动态导入配置
        const { SITE } = await import('../../config');
        
        // 发送请求
        const response = await fetch(apiUrl, { 
            headers, 
            cache: "force-cache",
            // @ts-ignore
            next: { revalidate: SITE.githubRepoCardDataFetchCacheTime } 
        });

        // 处理错误状态码
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`仓库不存在: ${username}/${repoName}`);
            }
            if (response.status === 403) {
                throw new Error('API速率限制已达上限。考虑使用GitHub访问令牌提高限制。');
            }
            throw new Error(`请求失败: HTTP状态码 ${response.status}`);
        }

        // 解析响应数据
        const data = await response.json();

        // 转换为RepositoryData格式
        return {
            name: data.name,
            nameWithOwner: data.full_name,
            description: data.description,
            primaryLanguage: data.language
                ? {
                    name: data.language,
                    // GitHub API不直接返回语言颜色，这里使用一个简单的映射表
                    // 实际应用中可以使用更完整的语言颜色映射库
                    color: getLanguageColor(data.language)
                }
                : undefined,
            isArchived: data.archived,
            isTemplate: data.is_template,
            starCount: data.stargazers_count,
            forkCount: data.forks_count,
            updatedAt: data.updated_at,
            owner: {
                login: data.owner.login,
                avatarUrl: data.owner.avatar_url
            }
        };
    } catch (error) {
        throw new Error(`获取仓库信息失败: ${(error as Error).message}`);
    }
}

/**
 * 简单的编程语言颜色映射（可扩展）
 * 更完整的映射可参考: https://github.com/ozh/github-colors
 */
function getLanguageColor(language: string): string {
    const colorMap: Record<string, string> = {
        JavaScript: '#f1e05a',
        TypeScript: '#3178c6',
        Python: '#3572A5',
        Java: '#b07219',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        C: '#555555',
        'C++': '#f34b7d',
        CSharp: '#178600',
        PHP: '#4F5D95',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Vue: '#41b883',
        React: '#61dafb',
        Dart: '#00B4AB',
        Swift: '#ffac45',
        Kotlin: '#f18e33',
    };

    return colorMap[language] || '#cccccc';
}

export default fetchGithubRepoData;
