/**
 * 计算阅读时间
 * @param wordCount 字数/词数
 * @param wordsPerMinute 每分钟阅读速度，默认为250（适用于中英文混合内容）
 * @returns 返回格式化的阅读时间字符串
 */
export function calculateReadingTime(
  wordCount: number,
  wordsPerMinute: number = 250
): string {
  if (wordCount <= 0) {
    return "0 分钟";
  }

  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  if (minutes < 1) {
    return "不到 1 分钟";
  } else if (minutes === 1) {
    return "1 分钟";
  } else if (minutes < 60) {
    return `${minutes} 分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return hours === 1 ? "1 小时" : `${hours} 小时`;
    } else {
      return `${hours} 小时 ${remainingMinutes} 分钟`;
    }
  }
}