// 资源加载管理器
export class ResourceLoader {
  private static instance: ResourceLoader;
  private progressCallback: ((visible: boolean) => void) | null = null;
  
  private constructor() {}
  
  // 单例模式
  static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }
  
  // 注册进度条回调
  registerProgressCallback(callback: (visible: boolean) => void) {
    this.progressCallback = callback;
  }
  
  // 加载单个资源
  async loadResource<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      // 显示进度条
      this.showProgress();
      
      // 加载资源
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`加载资源失败: ${response.statusText}`);
      }
      
      // 根据Content-Type判断返回类型
      const contentType = response.headers.get('content-type');
      let data: T;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = (await response.text()) as unknown as T;
      } else {
        data = (await response.arrayBuffer()) as unknown as T;
      }
      
      return data;
    } catch (error) {
      console.error('资源加载错误:', error);
      throw error;
    } finally {
      // 隐藏进度条
      this.hideProgress();
    }
  }
  
  // 批量加载资源
  async loadResources<T extends Record<string, string>>(
    resources: T, 
    options?: RequestInit
  ): Promise<{[K in keyof T]: any}> {
    try {
      this.showProgress();
      
      const entries = Object.entries(resources);
      const results = await Promise.all(
        entries.map(async ([key, url]) => {
          const response = await fetch(url, options);
          
          if (!response.ok) {
            throw new Error(`加载资源 ${key} 失败: ${response.statusText}`);
          }
          
          const contentType = response.headers.get('content-type');
          let data;
          
          if (contentType?.includes('application/json')) {
            data = await response.json();
          } else if (contentType?.includes('text/')) {
            data = await response.text();
          } else {
            data = await response.arrayBuffer();
          }
          
          return { key, data };
        })
      );
      
      return results.reduce((acc, { key, data }) => {
        acc[key as keyof T] = data;
        return acc;
      }, {} as {[K in keyof T]: any});
    } catch (error) {
      console.error('批量资源加载错误:', error);
      throw error;
    } finally {
      this.hideProgress();
    }
  }
  
  // 显示进度条
  private showProgress() {
    if (this.progressCallback) {
      this.progressCallback(true);
    }
  }
  
  // 隐藏进度条
  private hideProgress() {
    if (this.progressCallback) {
      this.progressCallback(false);
    }
  }
}
