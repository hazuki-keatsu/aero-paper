1. 拆分与延迟加载全局 JS
评估 ClientRouter 是否必须：如果主要是为了保留音乐播放器，其实可以把播放器改成 client:idle 或点击后再动态导入，而不是全站 SPA。去掉 <ClientRouter /> 可以立刻省掉 ~15 kB JS 和跨页过渡时的卡顿。
播放器改懒加载：
在 Layout.astro 里使用条件渲染：当用户点击最小化按钮时再 import() 播放器逻辑，初始只渲染一个轻量提示。
示例（概念）：
MusicPlayerShell 内部在用户展开时 await import('../utils/musicPlayer')。
或者把 MusicPlayer 改成纯客户端组件（<MusicPlayer client:idle />），Astro 会自动拆包并在浏览器空闲时初始化。
目录组件客户端化：目录仅在文章详情页出现，可改为 <AdaptiveTableOfContents client:visible />，让其 JS 只在用户真正查看正文时执行。另外可在 frontmatter 中 set:html 注入预生成 toc，这样滚动监听只负责高亮。
2. 重写滚动更新逻辑
目录激活逻辑：使用 IntersectionObserver 跟踪标题进入视口，避免循环 getBoundingClientRect()。
位置调整：adjustTocPosition() 可用 requestAnimationFrame 节流；或在 ResizeObserver 触发时才计算，滚动时不再反复访问布局。
回顶按钮：已利用 requestAnimationFrame，但可以将 window.screen.height 改为 window.innerHeight，避免强制读取屏幕信息，还能把 document.addEventListener("scroll", handler, { passive: true }) 声明为被动监听。
3. 减轻背景与全局样式压力
取消移动端模糊：给 @media (max-width: 768px) 下的 body::before / ::after 设置透明纯色背景，不再做 blur 与 backdrop-filter。
根据 prefers-reduced-motion / prefers-reduced-transparency 切换到低开销样式，保留桌面体验。
限制全局 transition：把 transition: background-color 从 * 移到需要的组件类，减少样式变动带来的重排。
4. 按页面拆包与懒加载第三方
统计页的 Chart.js 可换成 client:only="react" 或 client:load 的独立组件，在其他页面不加载 stats bundle。
Pagefind UI 可以改为点击搜索按钮时再动态引入（Pagefind 官方有懒加载示例）。
对音乐封面、文章封面使用 <Image> 或 loading="lazy"，确保首屏图像不阻塞布局。
5. 清理构建警告 & SSR 逻辑
多个页面静态化时访问 Astro.request.headers，应改用 Astro.request 可用的替代方案（例如通过 Astro.request.url 或构建期配置），避免客户端兜底逻辑。
在 astro.config.ts 中开启 output: "static" 已经默认生效，确认不需要动态 headers 后删除相关调用，可以让生成阶段更纯粹。
6. 建立性能基线
将 pnpm build 后的 _astro/*.js 体积记录下来，设定预算（例如主入口 < 60 kB gzip）。可以在 package.json 里添加 bundlesize 或 @astrojs/check 的性能断言。
使用 Chrome Performance / Lighthouse 在模拟中低端设备（如 Moto G Power）下录制滚动瀑布，确认上述改动是否降低 Long Task。
验证与落地建议
逐条改动时跑 pnpm build + pnpm preview，用 DevTools 的 “Coverage” 和 “Performance” 面板观察 JS 执行时间。
对目录和播放器脚本，可在浏览器 Performance 中查看 updateActiveHeading、loadTrack 等函数是否仍频繁触发。
如果需要继续保留跨页过渡体验，可尝试保留 astro:transitions 但对特定页面禁用或降低动画复杂度（<meta name="astro-view-transitions-enabled" content="false">）。
quality gates