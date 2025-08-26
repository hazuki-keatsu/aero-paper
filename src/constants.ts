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
    cover: "https://www.lyrical-nonsense.com/wp-content/uploads/2023/07/LONGMAN-spiral.jpg",
    src: "/LONGMAN%20-%20spiral.mp3"
  },
  // 来源于网易云的音频链接
  {
    id: 2,
    title: "Dye the sky. -25 colors-",
    artist: "シャイニーカラーズ",
    cover: "http://p2.music.126.net/tM1S4-q5Tt2cYUs0LTrcrw==/109951170278147013.jpg",
    src: "https://m704.music.126.net/20250826095413/cef8b1d8891b4653ce7715c4d0d30603/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/57137894027/f71c/6f5b/1f9f/9c8b8c9613c3bf97d3d0133b6f73f2c7.m4a"
  }
] as const;
