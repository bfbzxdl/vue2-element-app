export function classifyFile(name) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg","jpeg","png","gif","bmp","webp","svg","ico"].includes(ext)) return "image"
  if (ext === "pdf") return "pdf"
  if (["doc","docx"].includes(ext)) return "word"
  if (["ppt","pptx"].includes(ext)) return "ppt"
  if (["xls","xlsx"].includes(ext)) return "excel"
  if (["txt","log","md","json","xml","yaml","yml","csv"].includes(ext)) return "text"
  if (["zip","rar","7z","tar","gz"].includes(ext)) return "archive"
  return "other"
}

export const TYPE_ICON_MAP = {
  image: "el-icon-picture", pdf: "el-icon-document", word: "el-icon-document-copy",
  ppt: "el-icon-document-copy", excel: "el-icon-document-copy", text: "el-icon-document",
  archive: "el-icon-folder-opened", other: "el-icon-document",
}

export function getFileIcon(name) {
  return TYPE_ICON_MAP[classifyFile(name)] || TYPE_ICON_MAP.other
}

export function formatSize(bytes) {
  if (!bytes) return ""
  const units = ["B","KB","MB","GB"]
  let i = 0; let size = bytes
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++ }
  return size.toFixed(i > 0 ? 1 : 0) + " " + units[i]
}

export function checkFileSize(file, maxMB) {
  return file.size / 1024 / 1024 < (maxMB || 10)
}
