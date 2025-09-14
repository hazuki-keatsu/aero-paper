import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconBilibili from "@/assets/icons/IconBilibili.svg";
import IconDiscord from "@/assets/icons/IconDiscord.svg";
import IconSteam from "@/assets/icons/IconSteam.svg";
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
    href: "https://github.com/09Nick3",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/289913127",
    linkTitle: `${SITE.title} on Bilibili`,
    icon: IconBilibili,
  },

  {
    name: "Discord",
    href: "https://discord.com/users/09nick3",
    linkTitle: `${SITE.title} on Discord`,
    icon: IconDiscord,
  },

  {
    name: "Steam",
    href: "https://steamcommunity.com/id/w-tothestars/",
    linkTitle: `${SITE.title} on Steam`,
    icon: IconSteam,
  },

  {
    name: "Douban",
    href: "https://steamcommunity.com/id/w-tothestars/",
    linkTitle: `${SITE.title} on Steam`,
    icon: IconSteam,
  },

  {
    name: "Mail",
    href: "mailto:tothestars0703@icloud.com",
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
    title: "Light Dance",
    artist: "小濑村晶",
    cover: "/Light Dance.jpg",
    src: "/Light Dance.mp3"
  },
  // {
  //   id: 2,
  //   title: "Dye the sky.",
  //   artist: "Shiny Colors",
  //   cover: "/Dye%20the%20sky.jpg",
  //   src: "/Dye%20the%20sky.m4a"
  // },
] as const;
