<template>
  <div id="app-wrapper">
    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          <i class="el-icon-s-platform"></i>
          <span class="header-title">Vue2 + Element UI</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="header-menu"
        >
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            首页
          </el-menu-item>
          <el-menu-item index="/about">
            <i class="el-icon-info"></i>
            关于
          </el-menu-item>
          <el-menu-item index="/demo">
            <i class="el-icon-s-tools"></i>
            演示
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    activeMenu() {
      return this.$route.path
    },
  },
}
</script>

<style scoped>
#app-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  height: 60px !important;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.header-menu {
  border-bottom: none !important;
}

.app-main {
  flex: 1;
  background: #f0f2f5;
  padding: 24px;
  overflow-y: auto;
}
</style>
