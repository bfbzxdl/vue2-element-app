<template>
  <div id="app-wrapper">
    <!-- 顶部公共页头，撑满窗口宽度 -->
    <el-header class="app-header" height="56px">
      <div class="header-left">
        <i class="el-icon-s-platform"></i>
        <span class="header-brand">管理后台</span>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="header-user">
            <i class="el-icon-user-solid"></i>
            <span>管理员</span>
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="app-body">
      <!-- 左侧菜单 -->
      <el-aside width="220px" class="app-aside">
       <el-menu
         :default-active="activeMenu"
          @select="handleMenuSelect"
         class="aside-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
         <el-menu-item index="/">
           <i class="el-icon-s-home"></i>
           <span slot="title">首页</span>
         </el-menu-item>
         <el-menu-item index="/business">
           <i class="el-icon-s-data"></i>
           <span slot="title">业务演示</span>
         </el-menu-item>
         <el-menu-item index="/about">
           <i class="el-icon-info"></i>
           <span slot="title">关于</span>
         </el-menu-item>
          <el-submenu index="/demo">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>演示</span>
            </template>
            <el-menu-item index="/demo/cascader">
              <i class="el-icon-s-unfold"></i>
              <span slot="title">级联选择器</span>
            </el-menu-item>
            <el-menu-item index="/demo/upload">
              <i class="el-icon-upload2"></i>
              <span slot="title">文件上传</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区 -->
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
 methods: {
    handleMenuSelect(index) {
      if (this.$route.path !== index) {
        this.$router.push(index)
      }
    },
   handleCommand(command) {
      if (command === "logout") {
        this.$message.success("已退出登录（演示）")
      }
    },
  },
}
</script>

<style scoped lang="scss">
#app-wrapper {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 顶部页头 ──── 100% 窗口宽度 */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid $border-color;
  padding: 0 20px;
  height: 56px !important;
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 22px;
    color: $primary-color;
  }
}

.header-brand {
  font-size: 17px;
  font-weight: 600;
  color: $text-primary;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: $text-regular;
  font-size: 14px;

  &:hover {
    color: $primary-color;
  }
}

/* 主体区域 ──── 侧栏 + 内容 */
.app-body {
  flex: 1;
  overflow: hidden;
}

.app-aside {
  background-color: $sidebar-bg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.aside-menu {
  border-right: none !important;
  flex: 1;
}

.app-main {
  background: $content-bg;
  padding: 20px;
  overflow-y: auto;
}
</style>
