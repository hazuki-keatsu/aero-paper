export interface FriendLink {
  name: string;
  url: string;
  avatar?: string;
  description?: string;
  tags?: string[];
  createdAt?: string; // 预留：加入时间
  priority?: number;  // 预留：排序权重
}

export const friends: FriendLink[] = [
  {
    name: "Astro 官方",
    url: "https://astro.build/",
    avatar: "https://astro.build/favicon.svg",
    description: "轻量快速的现代静态站点框架。",
    tags: ["framework"],
    priority: 10,
  },
  {
    name: "To the stars",
    url: "https://tothestars.wang/",
    avatar: "https://tothestars.wang/assets/profile_picture.jpg",
    description: "你伫立于液态的鲜花中央，为我们的重逢而微笑。",
    tags: ["friend"],
    priority: 0,
  }
];

export function getSortedFriends(list: FriendLink[] = friends) {
  return [...list].sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.name.localeCompare(b.name, 'zh-CN'));
}
