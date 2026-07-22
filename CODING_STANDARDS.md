---
title: 前端工程规约
version: 1.0.0
updated: 2026-07-23
stack: vue2@2.7 | element-ui@2.15 | vue-router@3 | vuex@3 | axios | vite@7 | scss
alias: "@ -> src/"
package_manager: npm
---

# 前端工程规约

> 适用于 Codex / Copilot / Cursor 等 AI 编码助手的结构化规约。
> 所有规则均为 **强制性**，新增代码须逐条遵守。

---

## 1. 技术栈标识

```yaml
framework: Vue 2.7
ui_library: Element UI 2.15
router: Vue Router 3.x (hash mode)
state: Vuex 3.x
http: Axios
build: Vite 7.x
css: SCSS (dart-sass)
lang: JavaScript (ES6+)
alias: "@ -> src/"
```

---

## 2. 项目目录

```
src/
├── api/               # Axios 请求层，按业务分模块
├── assets/            # 静态资源
├── components/        # 公共组件（跨页面复用）
├── mock/              # Mock 数据
├── router/            # 路由配置
│   └── index.js
├── store/             # Vuex 状态管理
│   └── index.js
├── styles/            # 全局样式
│   ├── variables.scss
│   └── global.scss
├── utils/             # 工具函数
│   └── request.js     # Axios 实例
└── views/             # 页面级组件，按菜单层级组织
    ├── home/
    │   └── index.vue
    ├── about/
    │   └── index.vue
    └── demo/
        ├── cascader/
        │   ├── index.vue
        │   └── RegionSelector.vue
        └── upload/
            ├── index.vue
            ├── SingleFileUpload.vue
            ├── MultiFileUpload.vue
            └── FilePreviewDialog.vue
```

---

## 3. 命名规则

### 3.1 项目与目录命名

| 类型 | 风格 | 示例 | 备注 |
|------|------|------|------|
| 项目名 | kebab-case | `my-vue2-app` | 全部小写，单词间用短横线 |
| 目录名 | kebab-case | `user-profile/` | 有复数结构时使用复数 |
| 组件目录 | kebab-case | `business/` | `components` 下的子目录 |

### 3.2 Vue 组件命名

组件名**必须**为多单词 PascalCase。

| 规则 | 示例 | 说明 |
|------|------|------|
| 通用组件 | `UserProfile.vue` | 多单词，避免与 HTML 元素冲突 |
| 基础组件 | `BaseButton.vue` | 纯展示类组件，`Base` 前缀 |
| 单例组件 | `TheHeader.vue` | 项目中仅使用一次的组件 |
| 耦合子组件 | 父 `TodoList` → 子 `TodoListItem` | 以父组件名为前缀 |
| 页面入口 | `index.vue` | 路由对应的页面组件统一命名 |

### 3.3 其他文件命名

| 文件类型 | 风格 | 示例 |
|----------|------|------|
| JavaScript 模块 | kebab-case | `file-utils.js`、`request.js` |
| 类文件（JS） | PascalCase | `UserModel.js` |
| Vuex 模块 | kebab-case | `user-store.js` |
| 路由配置 | kebab-case | `order-routes.js` |
| SCSS / CSS | kebab-case | `variables.scss`、`global.scss` |
| 图片/图标 | snake_case | `error_icon.png` |

### 3.4 标识符命名

| 标识符 | 规则 | 正确示例 | 错误示例 |
|--------|------|----------|----------|
| 变量 | camelCase | `userList`、`tableData` | `user_list` |
| 常量 | UPPER_SNAKE | `MAX_FILE_SIZE` | `maxFileSize` |
| 组件 name | PascalCase | `name: "RegionSelector"` | `name: "region"` |
| prop | camelCase | `fileList` | — |
| 事件名 | kebab-case | `@change="handleChange"` | `@onChange` |
| 方法 | camelCase | `fetchData()` | `fetch_data()` |
| CSS 类 | BEM | `block__el--mod` | `block-el-mod` |
| Mutation | UPPER_SNAKE | `SET_USER_LIST` | `setUserList` |

### 3.5 导入顺序

```
1. 外部包（vue / axios / element-ui 等）
2. @/ 内部模块
3. 同级相对路径（仅无法使用 @ 时）
```

```javascript
// ✅ 标准
import Vue from "vue"
import RegionSelector from "@/views/demo/cascader/RegionSelector"
import request from "@/utils/request"

// ❌ 禁止
import RegionSelector from "../components/RegionSelector.vue"
```
# 4. Vue 组件

### 4.1 选项声明顺序（强制执行）

```
1. name
2. components
3. props
4. data
5. computed
6. watch
7. 生命周期钩子 (mounted → beforeDestroy)
8. methods
```

```javascript
// ✅ 标准结构
export default {
  name: "DemoUpload",
  components: { ChildComp },
  props: { value: { type: Array, default: () => [] } },
  data() { return { count: 0 } },
  computed: { fullName() { return this.first + " " + this.last } },
  watch: { value: { immediate: true, handler() {} } },
  mounted() {},
  beforeDestroy() {},
  methods: { handleClick() {} },
}
```

### 4.2 模板规则

| 规则          | 说明                              | 示例                            |
|---------------|-----------------------------------|---------------------------------|
| 缩进          | 2 空格                            | —                               |
| 事件绑定      | 使用 `@` 缩写                     | `@click` (非 `v-on:click`)      |
| 属性绑定      | 使用 `:` 缩写                     | `:value` (非 `v-bind:value`)    |
| v-for 必须 :key | `:key` 唯一标识                  | `v-for="item in list" :key="item.id"` |
| v-if / v-for  | 禁止同时用在同一元素               | 用 `template` 包装一层          |
| slot-scope    | 使用 `slot-scope="{ row }"`        | Vue 2 语法，禁止用 `#default`   |

### 4.3 样式

```html
<!-- ✅ 必须使用 scoped -->
<style scoped lang="scss">
.card { color: $primary-color; }
</style>

<!-- ❌ 禁止缺少 scoped -->
<style>
.card { color: blue; }
</style>
```

---

## 5. Vuex

### 5.1 模块结构

```javascript
// ✅ 标准 module
export default {
  namespaced: true,
  state: {},
  mutations: {
    SET_DATA(state, payload) { state.data = payload },
  },
  actions: {
    async fetchData({ commit }) {
      commit("SET_DATA", await api.fetch())
    },
  },
}
```

### 5.2 约束

| 字段       | 格式           | 必须 | 示例                   |
|------------|----------------|------|------------------------|
| Module     | namespaced     | yes  | `namespaced: true`     |
| Mutation   | UPPER_SNAKE    | yes  | `SET_USER_LIST`        |
| Action     | camelCase      | yes  | `fetchUserList`        |
| State      | camelCase      | yes  | `userList`             |

---

## 6. API / Axios

### 6.1 实例配置

```javascript
// utils/request.js — 标准模板
import axios from "axios"
import { Message } from "element-ui"

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
})

service.interceptors.response.use(
  (res) => res.data,
  (err) => {
    Message.error(err.message || "请求失败")
    return Promise.reject(err)
  }
)

export default service
```

### 6.2 API 模块规范

```javascript
// api/region.js — 标准模板
import request from "@/utils/request"

export function getProvinces() {
  return request({ url: "/region/provinces", method: "get" })
}
```

| 规则                   | 约束                             |
|------------------------|----------------------------------|
| 每个函数单一职责        | 一个 `get` / `post` 一个函数     |
| 路径格式               | `kebab-case`（中横线小写）       |
| 统一通过 `request` 实例 | 禁止直接使用 `axios`             |
| 函数注释（可选）       | `/** 获取省份列表 */`            |

---

## 7. 导入规范

### 7.1 路径别名

```
// ✅ 使用 @ 别名
import RegionSelector from "@/components/RegionSelector.vue"
import request from "@/utils/request"

// ❌ 禁止相对路径
import RegionSelector from "../components/RegionSelector.vue"
```

### 7.2 导入顺序

```
1. 外部包（vue / axios / element-ui 等）
2. @/ 内部模块
3. 同级相对路径（仅在无法使用 @ 时）

// ✅ 标准
import Vue from "vue"
import axios from "axios"
import RegionSelector from "@/components/RegionSelector.vue"
```

---

## 8. SCSS

### 8.1 当前可用变量

```scss
$primary-color: #409eff;
$sidebar-bg: #304156;
$content-bg: #f0f2f5;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$border-color: #ebeef5;
$border-light: #e4e7ed;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;
$sidebar-width: 220px;
$header-height: 60px;
$font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
```

### 8.2 SCSS 书写规则

| 规则                    | 说明                              |
|-------------------------|-----------------------------------|
| 变量引用                | 使用 `$` 引用，禁止硬编码颜色值     |
| 注释                    | 使用 `//` 行注释                  |
| 嵌套深度               | 不超过 4 层                        |
| `!important`            | 禁止使用                          |
| 布局                   | 优先 flexbox                      |
| 组件样式               | 必须 `scoped`                     |
| 全局变量               | 通过 Vite `additionalData` 自动注入|

---

## 9. Git

### 9.1 分支

| 分支       | 用途                | 基线     |
|------------|---------------------|----------|
| `main`     | 生产稳定            | —        |
| `dev`      | 日常开发            | main     |
| `feat/*`   | 新功能              | dev      |
| `fix/*`    | 修复                | dev      |
| `refactor/*` | 重构              | dev      |

### 9.2 提交格式

```
<type>(<scope>): <subject>

# type: feat | fix | refactor | style | docs | chore | perf
# scope: 组件名/模块名（可选）
# subject: 中文，20字以内
```

```bash
# ✅ 示例
git commit -m "feat(region): 添加四级懒加载级联选择器"
git commit -m "fix(upload): 修复文件预览弹窗关闭后 URL 未释放"
git commit -m "refactor: 提取公共 Axios 实例到 utils/request.js"

# ❌ 禁止
git commit -m "update"
git commit -m "fix bug"
git commit -m "改了一些东西"
```

---

## 10. 快速规则摘要

### 10.1 必须做

```
✅ 组件文件 = PascalCase.vue, name 与文件名一致
✅ 变量 = camelCase, 常量 = UPPER_SNAKE
✅ vue 文件使用 scoped + lang="scss"
✅ v-for 必须带 :key
✅ 导入优先使用 @/ 别名
✅ Vuex module 必须 namespaced: true
✅ Mutation 名全大写 + 下划线
✅ API 模块通过 request 实例发送
✅ 颜色/间距/字号通过 SCSS 变量引用
```

### 10.2 禁止做

```
❌ 组件 name 使用 kebab-case
❌ v-if 和 v-for 在同一元素
❌ 使用 !important
❌ 直接使用 axios（必须通过 request 实例）
❌ 硬编码颜色值（5a8ff2 / #303133 等→使用 $变量）
❌ 提交信息使用非规范格式
❌ 相对路径导入（使用 @/ 替代）
```

---

## 11. AI 上下文示例

当 AI 需要生成新文件时，遵循以下模板：

```javascript
// 📁 src/api/user.js
import request from "@/utils/request"

export function getUserList(params) {
  return request({ url: "/user/list", method: "get", params })
}
```

```vue
<!-- 📁 src/views/UserList.vue -->
<template>
  <div class="user-list">
    <el-table :data="users" stripe>
      <el-table-column prop="name" label="姓名" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "UserList",
  data() { return { users: [] } },
  mounted() { this.fetchData() },
  methods: {
    async fetchData() {
      // 通过 @/api 模块调用
    },
  },
}
</script>

<style scoped lang="scss">
.user-list { padding: 20px; }
</style>
```

---

> **版本:** 1.0.0 | **最后更新:** 2026-07-23
> **适用 AI:** Codex / Copilot / Cursor
> **优先级:** 本文件规则优先级高于所有通用编码规范
