import fs from "node:fs";
import path from "node:path";

const MEDIA_DIR = path.join(process.cwd(), "public", "media");

const VIDEO_EXTS = [".mp4", ".webm", ".mov"] as const;
const IMAGE_EXTS = [".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif"] as const;

export type MediaKind = "video" | "image";

export interface ResolvedMedia {
  kind: MediaKind;
  src: string;
  ext: string;
}

export function resolveMedia(slug: string): ResolvedMedia | null {
  for (const ext of VIDEO_EXTS) {
    if (fs.existsSync(path.join(MEDIA_DIR, `${slug}${ext}`))) {
      return { kind: "video", src: `/media/${slug}${ext}`, ext };
    }
  }
  for (const ext of IMAGE_EXTS) {
    if (fs.existsSync(path.join(MEDIA_DIR, `${slug}${ext}`))) {
      return { kind: "image", src: `/media/${slug}${ext}`, ext };
    }
  }
  return null;
}
