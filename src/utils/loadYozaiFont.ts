import { readFile } from "fs/promises";
import { join } from "path";

/**
 * 加载本地 Yozai 字体文件供 Satori 使用
 * @returns 字体数据数组
 */
export default async function loadYozaiFont() {
  // 获取字体文件路径
  const fontPath = join(
    process.cwd(),
    "src",
    "assets",
    "fonts",
    "Yozai-Regular.ttf"
  );

  try {
    // 读取字体文件
    const fontData = await readFile(fontPath);
    
    // 返回 Satori 所需的字体格式
    return [
      {
        name: "Yozai",
        data: fontData,
        weight: 400,
        style: "normal",
      },
      {
        name: "Yozai",
        data: fontData,
        weight: 700,
        style: "bold",
      },
    ];
  } catch (error) {
    console.error("Failed to load Yozai font:", error);
    throw error;
  }
}