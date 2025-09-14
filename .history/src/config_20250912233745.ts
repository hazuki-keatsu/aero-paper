export const SITE = {
  website: "https://tothestars.wang/", // replace this with your deployed domain
  author: "To the stars",
  profile: "",
  desc: "忧蓝",
  title: "Hazuki Keatsu",
  ogImage: "aeropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "编辑页面",
    url: "https://github.com/hazuki-keatsu/hazuki-blog/edit/main/",
  },
  dynamicOgImage: true,
  musicPlayer: {
    enabled: true, // 是否启用音乐播放器
    autoShow: false, // 是否自动展开播放器
    defaultVolume: 50, // 默认音量 (0-100)
    showInPages: ["all"] as string[], // 在哪些页面显示: "all" | "home" | "posts" | ["home", "posts", "about"] 等
  },
  sideTableOfContents: true,
  githubRepoCardDataFetchCacheTime: 3600,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh_CN", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
};
