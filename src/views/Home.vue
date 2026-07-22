<template>
  <div class="home-page">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="hover">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>欢迎使用 Vue2 + Element UI</h2>
          <p>这是一个基于 Vue 2.7 + Element UI 的纯前端工程模板，配有 Vite 构建工具和 Vue Router 路由。</p>
          <el-button type="primary" size="medium" @click="showToast">
            <i class="el-icon-chat-dot-round"></i>
            点我试试
          </el-button>
        </div>
        <div class="welcome-icon">
          <i class="el-icon-s-platform"></i>
        </div>
      </div>
    </el-card>

    <!-- 功能卡片列表 -->
    <el-row :gutter="20" class="card-row">
      <el-col :xs="24" :sm="12" :md="8" v-for="item in features" :key="item.title">
        <el-card class="feature-card" shadow="hover">
          <div class="feature-content">
            <el-tag :type="item.color" effect="dark" class="feature-tag">
              <i :class="item.icon"></i>
            </el-tag>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表格示例 -->
    <el-card class="table-card" shadow="hover">
      <template slot="header">
        <span><i class="el-icon-s-data"></i> 数据表格示例</span>
      </template>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #e6a23c" @click="handleView(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      features: [
        { title: 'Vue 2.7', desc: 'Composition API 兼容，Options API 成熟稳定，生态丰富。', icon: 'el-icon-vuejs', color: 'success' },
        { title: 'Element UI', desc: '桌面端组件库，表单、表格、弹窗、导航一应俱全。', icon: 'el-icon-s-grid', color: 'primary' },
        { title: 'Vite 构建', desc: '极速 HMR，秒级冷启动，构建体验丝般顺滑。', icon: 'el-icon-s-marketing', color: 'warning' },
      ],
      tableData: [
        { date: '2026-07-01', name: '张三', city: '北京', status: '启用' },
        { date: '2026-07-02', name: '李四', city: '上海', status: '启用' },
        { date: '2026-07-03', name: '王五', city: '广州', status: '停用' },
        { date: '2026-07-04', name: '赵六', city: '深圳', status: '启用' },
      ],
    }
  },
  methods: {
    showToast() {
      this.$message.success('Hello! Vue2 + Element UI 运行正常 🎉')
    },
    handleEdit(row) {
      this.$message.info(`编辑: ${row.name}`)
    },
    handleView(row) {
      this.$message.info(`查看: ${row.name}`)
    },
  },
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 24px;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-text h2 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #303133;
}

.welcome-text p {
  margin: 0 0 16px;
  color: #909399;
  line-height: 1.6;
}

.welcome-icon i {
  font-size: 72px;
  color: #409eff;
  opacity: 0.3;
}

.card-row {
  margin-bottom: 24px;
}

.feature-card {
  margin-bottom: 16px;
}

.feature-content {
  text-align: center;
  padding: 8px 0;
}

.feature-content h3 {
  margin: 12px 0 6px;
  font-size: 16px;
  color: #303133;
}

.feature-content p {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.feature-tag i {
  font-size: 20px;
}

.table-card {
  margin-bottom: 24px;
}
</style>
