<template>
  <el-upload
    ref="upload" drag action="/api/upload" :http-request="handleLocalUpload"
    :before-upload="beforeUpload" :on-change="handleChange"
    :on-remove="handleRemove" :file-list="fileList" :accept="accept"
    multiple list-type="text"
  >
    <i class="el-icon-upload" />
    <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
    <div slot="tip" class="el-upload__tip">支持图片 / PDF / Word / PPT / 文本，单个不超过 10MB</div>
    <template slot="file" slot-scope="{ file }">
      <div class="custom-file-item">
        <i :class="getFileIcon(file.name)" class="file-icon" />
        <span class="custom-file-name" :title="file.name">{{ file.name }}</span>
        <span class="custom-file-size">{{ formatSize(file.size) }}</span>
        <span class="custom-file-actions">
          <el-button type="text" size="mini" icon="el-icon-view" @click="handlePreview(file)">预览</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" style="color:#f56c6c" @click="removeFile(file)">移除</el-button>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script>
import { getFileIcon, formatSize, checkFileSize } from "@/utils/file-utils"

export default {
  name: "MultiFileUpload",
  props: { accept: { type: String, default: "image/*,.pdf,.doc,.docx,.pptx,.txt" } },
  data() { return { fileList: [] } },
  methods: {
    getFileIcon, formatSize,

    handleLocalUpload({ onSuccess }) { onSuccess({ code: 0 }) },

    beforeUpload(file) {
      if (!checkFileSize(file, 10)) { this.$message.error("文件大小不能超过 10MB！"); return false }
      return true
    },

    handleChange(file, fileList) {
      this.fileList = fileList
      this.$emit("log", "success", "已添加文件: " + file.name)
    },

    handleRemove(file) {
      this.fileList = this.fileList.filter(f => f.uid !== file.uid)
      this.$emit("log", "success", "已移除文件: " + file.name)
    },

    handlePreview(file) { this.$emit("preview", file) },

    removeFile(file) {
      const upload = this.$refs.upload
      if (upload) upload.uploadFiles = upload.uploadFiles.filter(f => f.uid !== file.uid)
      this.fileList = this.fileList.filter(f => f.uid !== file.uid)
      this.$emit("log", "success", "已移除文件: " + file.name)
    },
  },
}
</script>

<style scoped>
.custom-file-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 4px; }
.file-icon { font-size: 18px; color: #409eff; flex-shrink: 0; }
.custom-file-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; color: #303133; }
.custom-file-size { flex-shrink: 0; font-size: 12px; color: #909399; margin-right: 8px; }
.custom-file-actions { flex-shrink: 0; display: flex; gap: 2px; opacity: 0.7; transition: opacity 0.2s; }
.custom-file-item:hover .custom-file-actions { opacity: 1; }
</style>
