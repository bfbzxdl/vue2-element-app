<template>
  <div class="demo-page">
    <!-- 级联选择器 -->
    <el-card class="demo-card" shadow="hover">
      <template slot="header">
        <span><i class="el-icon-s-unfold"></i> 级联选择器</span>
      </template>

      <el-form label-width="100px" class="demo-form">
      <el-form-item label="选择地址">
        <RegionSelector
          v-model="regionValue"
          @change="handleRegionChange"
        />
      </el-form-item>

        <el-form-item label="选择分类">
          <el-cascader
            v-model="selectedCategory"
            :options="categoryOptions"
            :props="{ multiple: true, checkStrictly: true, label: 'name', value: 'id' }"
            clearable
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择商品分类（可多选）"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="选中结果">
          <el-input
            :value="resultText"
            type="textarea"
            :rows="2"
            readonly
            placeholder="选择后这里会显示结果"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 上传组件 -->
    <el-card class="demo-card" shadow="hover">
      <template slot="header">
        <span><i class="el-icon-upload2"></i> 文件上传（支持预览）</span>
      </template>

      <el-form label-width="100px" class="demo-form">
        <!-- 单文件上传 -->
        <el-form-item label="单文件上传">
          <el-upload
            ref="singleUpload"
            action="/api/upload"
            :http-request="handleLocalUpload"
            :before-upload="beforeUpload"
            :on-change="handleSingleChange"
            :on-remove="handleSingleRemove"
            :file-list="singleFileList"
            accept="image/*,.pdf,.doc,.docx,.pptx,.txt"
            list-type="text"
            :on-preview="handleSinglePreview"
          >
            <el-button size="small" type="primary">
              <i class="el-icon-upload"></i> 选择文件
            </el-button>
            <div slot="tip" class="el-upload__tip">
              支持图片 / PDF / Word / PPT / 文本，不超过 10MB
            </div>
            <!-- 自定义文件列表项：增加预览按钮 -->
            <template slot="file" slot-scope="{ file }">
              <div class="custom-file-item">
                <i :class="getFileIcon(file.name)" class="file-icon" />
                <span class="custom-file-name" :title="file.name">{{ file.name }}</span>
                <span class="custom-file-size">{{ formatSizeByRaw(file) }}</span>
                <span class="custom-file-actions">
                  <el-button type="text" size="mini" icon="el-icon-view" @click="handleSinglePreview(file)">
                    预览
                  </el-button>
                  <el-button type="text" size="mini" icon="el-icon-delete" style="color:#f56c6c" @click="removeSingleFile(file)">
                    移除
                  </el-button>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-divider />

        <!-- 多文件上传 -->
        <el-form-item label="多文件上传">
          <el-upload
            ref="multiUpload"
            drag
            action="/api/upload"
            :http-request="handleLocalUpload"
            :before-upload="beforeUpload"
            :on-change="handleMultiChange"
            :on-remove="handleMultiRemove"
            accept="image/*,.pdf,.doc,.docx,.pptx,.txt"
            :file-list="multiFileList"
            multiple
            list-type="text"
            :on-preview="handleMultiPreview"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              支持图片 / PDF / Word / PPT / 文本，单个不超过 10MB
            </div>
            <!-- 自定义文件列表项：增加预览按钮 -->
            <template slot="file" slot-scope="{ file }">
              <div class="custom-file-item">
                <i :class="getFileIcon(file.name)" class="file-icon" />
                <span class="custom-file-name" :title="file.name">{{ file.name }}</span>
                <span class="custom-file-size">{{ formatSizeByRaw(file) }}</span>
                <span class="custom-file-actions">
                  <el-button type="text" size="mini" icon="el-icon-view" @click="handleMultiPreview(file)">
                    预览
                  </el-button>
                  <el-button type="text" size="mini" icon="el-icon-delete" style="color:#f56c6c" @click="removeMultiFile(file)">
                    移除
                  </el-button>
                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-divider />

        <el-form-item label="操作日志">
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in uploadLogs"
              :key="index"
              :timestamp="log.time"
              :color="log.type === 'success' ? '#67c23a' : '#f56c6c'"
            >
              {{ log.message }}
            </el-timeline-item>
            <el-empty v-if="uploadLogs.length === 0" description="暂无操作记录" :image-size="60" />
          </el-timeline>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览弹窗 -->
    <el-dialog
      :title="previewTitle"
      :visible.sync="previewVisible"
      :width="previewDialogWidth"
      :close-on-click-modal="false"
      top="5vh"
      destroy-on-close
    >
      <div class="preview-body">
        <img
          v-if="previewType === 'image'"
          :src="previewUrl"
          class="preview-image"
          alt="preview"
        />
        <iframe
          v-else-if="previewType === 'pdf'"
          :src="previewUrl"
          class="preview-iframe"
          frameborder="0"
        />
        <iframe
          v-else-if="previewType === 'office'"
          :src="previewOfficeUrl"
          class="preview-iframe"
          frameborder="0"
        />
        <pre v-else-if="previewType === 'text'" class="preview-text">{{ previewTextContent }}</pre>
        <el-result v-else icon="warning" title="该类型暂不支持在线预览" sub-title="请下载后查看">
          <template slot="extra">
            <el-button type="primary" size="medium" @click="downloadFile">下载文件</el-button>
          </template>
        </el-result>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RegionSelector from '../components/RegionSelector.vue'

const TYPE_ICON_MAP = {
  image: 'el-icon-picture',
  pdf: 'el-icon-document',
  word: 'el-icon-document-copy',
  ppt: 'el-icon-document-copy',
  excel: 'el-icon-document-copy',
  text: 'el-icon-document',
  archive: 'el-icon-folder-opened',
  other: 'el-icon-document',
}

function classifyFile(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  if (['doc', 'docx'].includes(ext)) return 'word'
  if (['ppt', 'pptx'].includes(ext)) return 'ppt'
  if (['xls', 'xlsx'].includes(ext)) return 'excel'
  if (['txt', 'log', 'md', 'json', 'xml', 'yaml', 'yml', 'csv'].includes(ext)) return 'text'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive'
  return 'other'
}

function getFileIcon(name) {
  return TYPE_ICON_MAP[classifyFile(name)] || TYPE_ICON_MAP.other
}

function formatSize(bytes) {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++ }
  return size.toFixed(i > 0 ? 1 : 0) + ' ' + units[i]
}

export default {
  name: 'Demo',
  components: {
    RegionSelector,
  },
  data() {
    return {
      // 级联选择
      regionValue: [],
      addressPathLabels: [],
      selectedCategory: [],
      categoryOptions: [
        {
          id: 'c1', name: '电子产品',
          children: [
            {
              id: 'c1-1', name: '手机通讯',
              children: [
                { id: 'c1-1-1', name: '智能手机' }, { id: 'c1-1-2', name: '功能手机' },
                { id: 'c1-1-3', name: '手机配件' },
              ],
            },
            {
              id: 'c1-2', name: '电脑办公',
              children: [
                { id: 'c1-2-1', name: '笔记本' }, { id: 'c1-2-2', name: '台式机' },
                { id: 'c1-2-3', name: '显示器' },
              ],
            },
            {
              id: 'c1-3', name: '智能穿戴',
              children: [
                { id: 'c1-3-1', name: '智能手表' }, { id: 'c1-3-2', name: '手环' },
              ],
            },
          ],
        },
        {
          id: 'c2', name: '服装鞋帽',
          children: [
            {
              id: 'c2-1', name: '男装',
              children: [
                { id: 'c2-1-1', name: '上衣' }, { id: 'c2-1-2', name: '裤装' },
                { id: 'c2-1-3', name: '外套' },
              ],
            },
            {
              id: 'c2-2', name: '女装',
              children: [
                { id: 'c2-2-1', name: '连衣裙' }, { id: 'c2-2-2', name: '半身裙' },
                { id: 'c2-2-3', name: '针织衫' },
              ],
            },
          ],
        },
        {
          id: 'c3', name: '食品生鲜',
          children: [
            {
              id: 'c3-1', name: '水果',
              children: [
                { id: 'c3-1-1', name: '苹果' }, { id: 'c3-1-2', name: '香蕉' },
                { id: 'c3-1-3', name: '葡萄' },
              ],
            },
            {
              id: 'c3-2', name: '蔬菜',
              children: [
                { id: 'c3-2-1', name: '叶菜类' }, { id: 'c3-2-2', name: '根茎类' },
              ],
            },
          ],
        },
      ],
      // 上传
      singleFileList: [],
      multiFileList: [],
      uploadLogs: [],
      // 预览
      previewVisible: false,
      previewTitle: '',
      previewUrl: '',
      previewOfficeUrl: '',
      previewType: '',
      previewTextContent: '',
      previewRawFile: null,
    }
  },
  computed: {

    resultText() {
      const parts = []
      if (this.selectedAddress.length) {
        parts.push('地址: ' + this.addressPathLabels.join(' / '))
      }
      if (this.selectedCategory.length) {
        const labels = this.selectedCategory.map((v) =>
          this.findLabel(this.categoryOptions, v)
        )
        parts.push('分类: ' + labels.join('、'))
      }
      return parts.length ? parts.join('\n') : ''
    },
    previewDialogWidth() {
      if (this.previewType === 'image') return '70%'
      if (this.previewType === 'pdf' || this.previewType === 'office') return '90%'
      return '60%'
    },
  },
  methods: {
    /* ======== 工具方法 ======== */
    findLabel(options, path) {
      if (!Array.isArray(path)) return ''
      const labels = []
      let current = options
      for (const id of path) {
        const node = current.find((n) => n.id === id)
        if (!node) break
        labels.push(node.name)
        current = node.children || []
      }
      return labels.join(' / ')
    },
    getFileIcon,
    formatSizeByRaw(file) {
      return formatSize(file.size)
    },
    addLog(type, message) {
      const now = new Date().toLocaleTimeString()
      this.uploadLogs.unshift({ type, time: now, message })
    },
    findMetaByUid(list, uid) {
      return list.find((m) => m.uid === uid)
    },

    /* ======== 级联选择 ======== */

    handleRegionChange(data) {
      this.addressPathLabels = data ? data.labels : []
    },

    handleSubmit() {
      if (this.selectedAddress.length || this.selectedCategory.length) {
        this.$message.success('提交成功！选中结果如上所示。')
      } else {
        this.$message.warning('请先选择地址或分类。')
      }
    },
    handleReset() {
      this.regionValue = []
      this.addressPathLabels = []
      this.selectedCategory = []
      this.$message.info('已重置所有选择。')
    },

    /* ======== 上传通用 ======== */
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('文件大小不能超过 10MB！')
        return false
      }
      return true
    },
    handleLocalUpload({ onSuccess }) {
      onSuccess({ code: 0 })
    },

    /* ======== 单文件 ======== */
    handleSingleChange(file, fileList) {
      // 自动覆盖旧文件：只保留最新添加的文件
      const oldFiles = fileList.filter(f => f.uid !== file.uid)
      oldFiles.forEach(f => this.revokeFileUrl(f))
      // 清理 el-upload 内部列表，只保留新文件
      const upload = this.$refs.singleUpload
      if (upload) {
        upload.uploadFiles = [file]
      }
      this.singleFileList = [file]
      this.addLog('success', oldFiles.length > 0 ? `已自动替换为: ${file.name}` : `已添加文件: ${file.name}`)
    },
    handleSingleRemove(file, fileList) {
      this.singleFileList = fileList
      this.addLog('success', `已移除文件: ${file.name}`)
      this.revokeFileUrl(file)
    },
    handleSinglePreview(file) {
      this.openPreviewFromUpload(file)
    },
    removeSingleFile(file) {
      const upload = this.$refs.singleUpload
      if (upload) {
        upload.uploadFiles = upload.uploadFiles.filter((f) => f.uid !== file.uid)
      }
      this.singleFileList = this.singleFileList.filter((f) => f.uid !== file.uid)
      this.revokeFileUrl(file)
      this.addLog('success', `已移除文件: ${file.name}`)
    },

    /* ======== 多文件 ======== */
    handleMultiChange(file, fileList) {
      this.multiFileList = fileList
      this.addLog('success', `已添加文件: ${file.name}`)
    },
    handleMultiRemove(file, fileList) {
      this.multiFileList = fileList
      this.revokeFileUrl(file)
      this.addLog('success', `已移除文件: ${file.name}`)
    },
    handleMultiPreview(file) {
      this.openPreviewFromUpload(file)
    },
    removeMultiFile(file) {
      const upload = this.$refs.multiUpload
      if (upload) {
        upload.uploadFiles = upload.uploadFiles.filter((f) => f.uid !== file.uid)
      }
      this.multiFileList = this.multiFileList.filter((f) => f.uid !== file.uid)
      this.revokeFileUrl(file)
      this.addLog('success', `已移除文件: ${file.name}`)
    },

    /* ======== 文件 URL 管理 ======== */
    objectUrlCache: {},
    getOrCreateObjectUrl(file) {
      const raw = file.raw || file
      if (!raw) return ''
      if (!this.objectUrlCache[file.uid]) {
        this.objectUrlCache[file.uid] = URL.createObjectURL(raw)
      }
      return this.objectUrlCache[file.uid]
    },
    revokeFileUrl(file) {
      if (this.objectUrlCache[file.uid]) {
        URL.revokeObjectURL(this.objectUrlCache[file.uid])
        delete this.objectUrlCache[file.uid]
      }
    },

    /* ======== 预览 ======== */
    openPreviewFromUpload(file) {
      const raw = file.raw || file
      if (!raw) return

      this.previewTitle = '预览: ' + file.name
      this.previewType = classifyFile(file.name)
      this.previewRawFile = raw

      if (this.previewType === 'text') {
        raw.text().then((text) => {
          this.previewTextContent = text
        }).catch(() => {
          this.previewTextContent = '无法读取文件内容'
        })
        this.previewVisible = true
        return
      }

      if (this.previewType === 'image' || this.previewType === 'pdf') {
        this.previewUrl = this.getOrCreateObjectUrl(file)
        if (this.previewType === 'image') {
          // 预加载图片确保渲染
          const img = new Image()
          img.src = this.previewUrl
        }
        this.previewVisible = true
        return
      }

      if (['word', 'ppt', 'excel'].includes(this.previewType)) {
        this.previewOfficeUrl = ''
        this.previewVisible = true
        return
      }

      this.previewVisible = true
    },

    downloadFile() {
      if (this.previewRawFile) {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(this.previewRawFile)
        a.download = this.previewRawFile.name || 'file'
        a.click()
        URL.revokeObjectURL(a.href)
        this.$message.success('正在下载文件...')
      }
      this.previewVisible = false
    },
  },
  beforeDestroy() {
    // 清理所有缓存的 object URL
    Object.values(this.objectUrlCache).forEach((url) => URL.revokeObjectURL(url))
    this.objectUrlCache = {}
  },
}
</script>

<style scoped>
.demo-page {
  max-width: 960px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 24px;
}

.demo-form {
  max-width: 640px;
}

/* 自定义文件列表 */
.custom-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 4px;
}

.file-icon {
  font-size: 18px;
  color: #409eff;
  flex-shrink: 0;
}

.custom-file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #303133;
}

.custom-file-size {
  flex-shrink: 0;
  font-size: 12px;
  color: #909399;
  margin-right: 8px;
}

.custom-file-actions {
  flex-shrink: 0;
  display: flex;
  gap: 2px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.custom-file-item:hover .custom-file-actions {
  opacity: 1;
}

/* 预览弹窗 */
.preview-body {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 4px;
}

.preview-iframe {
  width: 100%;
  height: 75vh;
  border-radius: 4px;
}

.preview-text {
  width: 100%;
  max-height: 70vh;
  overflow: auto;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  margin: 0;
}
</style>
