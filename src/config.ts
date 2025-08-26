export const SITE = {
  website: "http://keatsu.top/", // replace this with your deployed domain
  author: "Hazuki Keatsu",
  profile: "",
  desc: "叶月枫的博客",
  title: "Hazuki Keatsu",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
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
  dir: "ltr", // "rtl" | "auto"
  lang: "zh_CN", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
};
