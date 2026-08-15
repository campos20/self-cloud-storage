export type FileKind = "image" | "pdf" | "video" | "audio" | "text" | "other";

const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"]);
const VIDEO_EXT = new Set(["mp4", "webm", "mov", "m4v", "ogv"]);
const AUDIO_EXT = new Set(["mp3", "wav", "ogg", "m4a", "flac"]);
const TEXT_EXT = new Set([
  "txt", "md", "markdown", "json", "csv", "log", "yml", "yaml", "xml",
  "ts", "tsx", "js", "jsx", "py", "sh", "env", "toml", "ini",
]);

export function getFileKind(name: string): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXT.has(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (VIDEO_EXT.has(ext)) return "video";
  if (AUDIO_EXT.has(ext)) return "audio";
  if (TEXT_EXT.has(ext)) return "text";
  return "other";
}

export const FILE_KIND_ICON: Record<FileKind, string> = {
  image: "🖼️",
  pdf: "📄",
  video: "🎞️",
  audio: "🎵",
  text: "📝",
  other: "📦",
};
