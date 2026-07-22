---
title: 前端工程规约
version: 1.0.0
tags: [vue2, element-ui, eslint, prettier, husky]
rules:
  - priority: P1 必要
  - priority: P2 强烈推荐
---

# Vue2 项目开发通用规范（AI 友好型）

> **指令**: 本规范适用于所有 Vue2 单文件组件（`.vue`）的开发。AI 在生成或修改代码时，**必须**严格遵守以下所有规则。规则优先级：**必要 (P1)** > **强烈推荐 (P2)**。

---

## 1. 命名规范

### 1.1 项目与目录

| 标识 | 规则 |
|------|------|
| **项目名** | 全部小写，kebab-case。如 `mall-management-system` |
| **目录名** | 全部小写，kebab-case。复数用复数形式。如 `components`、`utils`、`user-profile` |

### 1.2 Vue 组件文件

| 规则 | 说明 |
|------|------|
| **文件名** | MUST `PascalCase` 或 `kebab-case`，推荐 `PascalCase`。如 `UserProfile.vue` |
| **基础组件前缀** | 以 `Base`、`App`、`V` 为前缀。如 `BaseButton.vue` |
| **耦合子组件前缀** | 以父组件名为前缀。如 `TodoList.vue` → 子 `TodoListItem.vue` |
| **页面入口** | 路由对应页面统一命名 `index.vue` |

### 1.3 JavaScript 与变量

| 标识 | 规则 | 示例 |
|------|------|------|
| **变量 / 函数** | camelCase | `getUserInfo`、`userList` |
| **常量** | UPPER_SNAKE_CASE | `MAX_SIZE`、`API_BASE_URL` |
| **组件 `name`** | PascalCase，与文件名一致 | `UserProfile` |

### 1.4 CSS 类名

CSS 类名使用 `kebab-case`。如 `.user-card`、`.btn-primary`。

---

## 2. Vue 组件编码规范

### 2.1 必要规则（P1）— 必须遵守

#### 2.1.1 组件名为多个单词

**规则**: 组件 `name` MUST 由多个单词组成，避免与 HTML 元素冲突。

✅ **正确**:
```javascript
export default {
  name: 'TodoItem'
}
```

❌ **错误**:
```javascript
export default {
  name: 'Todo'
}
```

---

#### 2.1.2 组件 `data` 必须为函数

**规则**: 组件 `data` MUST 是一个返回对象的函数。

✅ **正确**:
```javascript
export default {
  data() {
    return { count: 0 }
  }
}
```

❌ **错误**:
```javascript
export default {
  data: { count: 0 }
}
```

---

#### 2.1.3 Prop 定义尽量详细

**规则**: Prop MUST 使用对象语法，至少指定 `type`。

✅ **推荐**:
```javascript
props: {
  status: {
    type: String,
    required: true,
    validator: (value) => ['success', 'warning'].includes(value)
  },
  title: {
    type: String,
    default: '默认标题'
  }
}
```

❌ **避免**:
```javascript
props: ['status', 'title']
```

---

#### 2.1.4 `v-for` 必须设置 `key`

**规则**: `v-for` MUST 绑定 `:key`，值为唯一稳定 ID。

✅ **正确**:
```vue
<li v-for="item in items" :key="item.id">{{ item.text }}</li>
```

---

#### 2.1.5 避免 `v-if` 与 `v-for` 同时使用

**规则**: MUST NOT 在同一元素上同时使用 `v-if` 和 `v-for`。

✅ **解决方案**: 使用计算属性先过滤。

```vue
<template>
  <li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>
</template>

<script>
export default {
  computed: {
    activeUsers() {
      return this.users.filter(u => u.isActive)
    }
  }
}
</script>
```

---

#### 2.1.6 组件样式设置作用域

**规则**: 组件样式 MUST 添加 `scoped` 属性。

✅ **正确**:
```vue
<style scoped>
.button { background: blue; }
</style>
```

---

### 2.2 强烈推荐规则（P2）— 提升可读性

#### 2.2.1 模板中的组件名大小写

**规则**: 单文件组件模板中，组件名 SHOULD 使用 `PascalCase`。

✅ `<UserProfile />`　　❌ `<user-profile />`

#### 2.2.2 自闭合组件

**规则**: 无内容组件 SHOULD 使用自闭合标签。

✅ `<UserProfile />`　　❌ `<UserProfile></UserProfile>`

---

## 3. 项目结构

推荐按业务模块组织，将相关功能聚合。

```
src/
├── api/                # API 请求封装
├── assets/             # 静态资源
├── components/         # 公共组件
│   ├── base/           # 基础组件
│   └── business/       # 业务组件
├── config/             # 配置文件
├── constants/          # 常量定义
├── directives/         # 自定义指令
├── filters/            # 全局过滤器
├── mixins/             # 全局混入
├── router/             # 路由配置
│   └── index.js
├── store/              # Vuex 状态管理
│   └── index.js
├── utils/              # 工具函数
├── views/              # 页面级组件（按模块划分）
│   └── user/
│       ├── UserList.vue
│       └── UserDetail.vue
├── App.vue
└── main.js
```

---

## 4. 代码风格与质量

### 4.1 缩进与格式

| 项目 | 规则 |
|------|------|
| **缩进** | 2 个空格 |
| **分号** | 语句结尾 MUST 使用 `;` |
| **引号** | 统一使用单引号 `'` |
| **编码** | UTF-8 |

### 4.2 注释规范

| 场景 | 要求 |
|------|------|
| **公共组件 / 函数** | MUST 编写清晰注释，说明用途、参数和返回值 |
| **复杂业务逻辑** | MUST 添加注释解释目的 |
| **待办事项** | 使用 `// TODO: 描述` 格式 |

### 4.3 工具链配置

#### ESLint

MUST 使用 `eslint-plugin-vue`，推荐 `plugin:vue/recommended`。

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/require-default-prop': 'error',
    'vue/attribute-hyphenation': 'error'
  }
}
```

#### Prettier

建议配合 Prettier 统一格式化代码。

---

## 5. 状态管理（Vuex）

| 规则 | 说明 |
|------|------|
| **模块化** | 复杂应用 MUST 按业务模块拆分 `store/modules/` |
| **严格模式** | 开发环境开启 `strict: true`，禁止直接修改 `state` |

---

## 6. 路由（Vue Router）

| 规则 | 说明 |
|------|------|
| **模块化** | 路由配置建议按业务拆分 |
| **命名** | 路由 `name` 使用 PascalCase |

---

## 7. 禁止事项（负面清单）

| 禁止行为 | 原因 | 替代方案 |
|----------|------|----------|
| 组件名为单个单词 | 与 HTML 元素冲突 | 使用多单词名称 |
| `v-for` 不设置 `key` | 渲染性能问题和状态错乱 | 绑定 `:key` 为唯一 ID |
| `v-if` 与 `v-for` 同时使用 | `v-for` 优先级更高，性能浪费 | 使用计算属性过滤 |
| 直接修改 `props` | 单向数据流被破坏 | 通过 `$emit` 触发父组件事件 |
| 滥用 `Mixins` | 命名冲突和隐式依赖 | 优先使用工具函数或组合式 API |

---
