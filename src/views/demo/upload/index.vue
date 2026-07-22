<template>
  <div class="demo-page">
    <el-card class="demo-card" shadow="hover">
      <template slot="header"><span><i class="el-icon-upload2"></i> 文件上传（支持预览）</span></template>
      <el-form label-width="100px" class="demo-form">
        <el-form-item label="单文件上传">
          <SingleFileUpload @preview="handlePreview" @log="addLog" />
        </el-form-item>
        <el-divider />
        <el-form-item label="多文件上传">
          <MultiFileUpload @preview="handlePreview" @log="addLog" />
        </el-form-item>
        <el-divider />
        <el-form-item label="操作日志">
          <el-timeline>
            <el-timeline-item v-for="(log, idx) in uploadLogs" :key="idx" :timestamp="log.time" :color="log.type === 'success' ? '#67c23a' : '#f56c6c'">
              {{ log.message }}
            </el-timeline-item>
            <el-empty v-if="uploadLogs.length === 0" description="暂无操作记录" :image-size="60" />
          </el-timeline>
        </el-form-item>
      </el-form>
    </el-card>
    <FilePreviewDialog ref="previewDialog" />
  </div>
</template>

<script>
import SingleFileUpload from "./SingleFileUpload"
import MultiFileUpload from "./MultiFileUpload"
import FilePreviewDialog from "./FilePreviewDialog"

export default {
  name: "DemoUpload",
  components: { SingleFileUpload, MultiFileUpload, FilePreviewDialog },
  data() { return { uploadLogs: [] } },
  methods: {
    addLog(type, message) {
      this.uploadLogs.unshift({ type, time: new Date().toLocaleTimeString(), message })
    },
    handlePreview(file) {
      this.$refs.previewDialog.open(file)
    },
  },
}
</script>

<style scoped>
.demo-page { max-width: 960px; margin: 0 auto; }
.demo-card { margin-bottom: 24px; }
.demo-form { max-width: 640px; }
</style>
