# Vue2 + Element UI 后台管理系统

> 基于 Vue 2.7 + Element UI 2.15 + Vite 7 的企业级后台管理模板。
> 内置完整的工程规约、自动化工具链，开箱即用。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 2.7 |
| UI 组件库 | Element UI 2.15 |
| 路由 | Vue Router 3.x (hash) |
| 状态管理 | Vuex 3.x |
| HTTP 请求 | Axios |
| 构建工具 | Vite 7.x |
| CSS 预编译 | SCSS |
| 代码检查 | ESLint 8 + Prettier 3 |
| Git Hooks | Husky 9 + lint-staged |

## 功能特性

- **后台管理布局** — 左侧菜单 + 顶部页头 + 右侧内容区
- **自定义级联选择器** — 省市区县四级懒加载，单选钮选中、文字标签展开
- **文件上传** — 单文件自动替换 + 多文件拖拽，图片/PDF/文本预览
- **业务演示页面** — 用户管理 CRUD，地区/资料录入，mock API 分页查询
- **工程规约** — AI 友好型编码规范，ESLint + Prettier 自动检查
- **数据持久化** — 业务数据通过 localStorage 存储，刷新不丢失

## 快速开始

```bash
# 克隆项目
git clone https://github.com/bfbzxdl/vue2-element-app.git
cd vue2-element-app

# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
npm run lint:fix

# 格式化代码
npm run format
```

## 目录结构

```
src/
├── api/                # API 请求层
│   ├── request.js      # Axios 实例（拦截器封装）
│   ├── region.js       # 区域数据 API
│   └── business.js     # 业务演示 API
├── components/         # 公共组件
├── mock/               # Mock 数据层
│   ├── region.js       # 省市区县数据
│   └── business.js     # 业务数据（localStorage 持久化）
├── router/             # 路由配置
│   └── index.js
├── store/              # Vuex 状态管理
│   └── index.js
├── styles/             # 全局样式
│   ├── variables.scss  # SCSS 变量
│   └── global.scss     # 全局重置
├── utils/              # 工具函数
│   ├── file-utils.js   # 文件类型/大小工具
│   └── request.js      # Axios 实例
└── views/              # 页面组件（按菜单层级组织）
    ├── home/
    ├── about/
    └── demo/
        ├── cascader/   # 级联选择器演示
        └── upload/     # 文件上传演示
```

## 工程规约

详见 [CODING_STANDARDS.md](./CODING_STANDARDS.md)，包含：

- 命名规范（PascalCase / camelCase / kebab-case）
- Vue 组件编码规范（必要规则 + 强烈推荐）
- 项目结构规范
- 代码风格与质量要求
- ESLint + Prettier 配置
- Git 提交规范

## NPM Scripts

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | ESLint 自动修复 |
| `npm run format` | Prettier 格式化 |

## 浏览器支持

- Chrome ≥ 80
- Firefox ≥ 80
- Edge ≥ 80
- Safari ≥ 14

## License

MIT
