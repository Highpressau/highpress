"use client";

import { useEffect, useState } from "react";
import {
  TwitterEmbed,
  InstagramEmbed,
  YouTubeEmbed,
  TikTokEmbed,
} from "react-social-media-embed";

type SocialEmbedProps = {
  platform: string;
  url: string;
};

export default function SocialEmbed({ platform, url }: SocialEmbedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[320px] w-full max-w-[550px] items-center justify-center border border-black/10 bg-white text-xs font-black uppercase tracking-[0.2em] text-black/40">
        Loading embed...
      </div>
    );
  }

  if (platform === "twitter" || platform === "x") {
    return <TwitterEmbed url={url} width={550} />;
  }

  if (platform === "instagram") {
    return <InstagramEmbed url={url} width={550} />;
  }

  if (platform === "youtube") {
    return <YouTubeEmbed url={url} width={550} />;
  }

  if (platform === "tiktok") {
    return <TikTokEmbed url={url} width={325} />;
  }

  return null;
}