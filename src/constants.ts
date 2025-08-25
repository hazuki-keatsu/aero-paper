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
] as const;
