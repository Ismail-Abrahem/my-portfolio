// components/WebsiteLink.tsx
"use client";

import { useState, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";

export default function WebsiteLink() {
  const [url, setUrl] = useState<string>("https://abrahem.se/"); // fallback

  useEffect(() => {
    // Update with env variable on client
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      setUrl(process.env.NEXT_PUBLIC_SITE_URL);
    }
  }, []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift"
    >
      <FiGlobe size={22} />
    </a>
  );
}
