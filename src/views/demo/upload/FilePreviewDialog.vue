<template>
  <el-dialog :title="title" :visible.sync="visible" :width="dialogWidth"
    :close-on-click-modal="false" top="5vh" destroy-on-close @closed="handleClosed">
    <div class="preview-body">
      <img v-if="type === 'image'" :src="url" class="preview-image" alt="preview" />
      <iframe v-else-if="type === 'pdf'" :src="url" class="preview-iframe" frameborder="0" />
      <iframe v-else-if="type === 'office'" :src="officeUrl" class="preview-iframe" frameborder="0" />
      <pre v-else-if="type === 'text'" class="preview-text">{{ textContent }}</pre>
      <el-result v-else icon="warning" title="该类型暂不支持在线预览" sub-title="请下载后查看">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="downloadFile">下载文件</el-button>
        </template>
      </el-result>
    </div>
  </el-dialog>
</template>

<script>
import { classifyFile } from "@/utils/file-utils"

export default {
  name: "FilePreviewDialog",
  data() {
    return {
      visible: false,
      title: "", type: "", url: "", officeUrl: "", textContent: "",
      rawFile: null, cacheUrl: null,
    }
  },
  computed: {
    dialogWidth() {
      if (this.type === "image") return "70%"
      if (this.type === "pdf" || this.type === "office") return "90%"
      return "60%"
    },
  },
  methods: {
    open(file) {
      if (this.cacheUrl) { URL.revokeObjectURL(this.cacheUrl); this.cacheUrl = null }
      const raw = file.raw || file
      if (!raw) return
      this.title = "预览: " + file.name
      this.type = classifyFile(file.name)
      this.rawFile = raw

      if (this.type === "text") {
        raw.text().then((text) => { this.textContent = text }).catch(() => { this.textContent = "无法读取文件内容" })
        this.visible = true; return
      }
      if (this.type === "image" || this.type === "pdf") {
        this.cacheUrl = URL.createObjectURL(raw)
        this.url = this.cacheUrl
        this.visible = true; return
      }
      if (["word","ppt","excel"].includes(this.type)) { this.officeUrl = ""; this.visible = true; return }
      this.visible = true
    },
    handleClosed() {
      if (this.cacheUrl) { URL.revokeObjectURL(this.cacheUrl); this.cacheUrl = null }
    },
    downloadFile() {
      if (!this.rawFile) return
      const url = URL.createObjectURL(this.rawFile)
      const a = document.createElement("a")
      a.href = url; a.download = this.rawFile.name || "file"
      a.click(); URL.revokeObjectURL(url)
      this.$message.success("正在下载文件...")
    },
  },
}
</script>

<style scoped>
.preview-body { min-height: 300px; display: flex; align-items: center; justify-content: center; }
.preview-image { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 4px; }
.preview-iframe { width: 100%; height: 75vh; border-radius: 4px; }
.preview-text { width: 100%; max-height: 70vh; overflow: auto; background: #f8f9fa; padding: 16px; border-radius: 4px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-break: break-all; font-family: "Cascadia Code","Fira Code","Consolas",monospace; margin: 0; }
</style>