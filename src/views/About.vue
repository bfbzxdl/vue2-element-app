<template>
  <div class="about-page">
    <el-card shadow="hover">
      <template slot="header">
        <span><i class="el-icon-info"></i> 关于本项目</span>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="框架">Vue 2.7.16</el-descriptions-item>
        <el-descriptions-item label="UI 组件库">Element UI 2.15.14</el-descriptions-item>
        <el-descriptions-item label="路由">Vue Router 3.x</el-descriptions-item>
        <el-descriptions-item label="构建工具">Vite 7.x + @vitejs/plugin-vue2</el-descriptions-item>
        <el-descriptions-item label="语言">JavaScript (ES6+)</el-descriptions-item>
        <el-descriptions-item label="包管理">npm</el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <el-alert
        title="Vue 2 已进入 EOL 阶段，但这个组合在企业级项目中仍有广泛应用。如果你正在做老项目维护或希望平稳迁移，这套栈依然是最稳妥的选择。"
        type="warning"
        show-icon
        :closable="false"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'About',
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
