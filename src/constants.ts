import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconBilibili from "@/assets/icons/IconBilibili.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/hazuki-keatsu",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/392082366",
    linkTitle: `${SITE.title} on Bilibili`,
    icon: IconBilibili,
  },
  {
    name: "X",
    href: "https://x.com/yeyuefeng700",
    linkTitle: `${SITE.title} on X`,
    icon: IconBrandX,
  },
  {
    name: "Mail",
    href: "mailto:yeyuefeng699@outlook.com",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  // {
  //   name: "Telegram",
  //   href: "https://t.me/share/url?url=",
  //   linkTitle: `Share this post via Telegram`,
  //   icon: IconTelegram,
  // },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;

export const SONG_LIST: Song[] = [
  {
    id: 1,
    title: "spiral",
    artist: "LONGMAN",
    cover: "/LONGMAN%20-%20spiral.jpg",
    src: "/LONGMAN%20-%20spiral.mp3"
  },
  // 来源于网易云的音频链接
  {
    id: 2,
    title: "Dye the sky. -25 colors-",
    artist: "シャイニーカラーズ",
    cover: "http://p2.music.126.net/tM1S4-q5Tt2cYUs0LTrcrw==/109951170278147013.jpg",
    src: "https://er-sycdn.kuwo.cn/f2eda961da3391e9449d1f47431a4a83/68ae5fdf/resource/30106/trackmedia/M800003xGgeK3y8O46.mp3"
  }
] as const;
