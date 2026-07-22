<template>
  <div class="business-page">
    <el-card shadow="hover">
      <template slot="header"><span><i class="el-icon-user"></i> 用户管理</span></template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.keyword" placeholder="请输入用户名" clearable style="width:180px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="全部" clearable style="width:130px">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width:130px">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="filteredUsers" stripe border style="width:100%" v-loading="loading">
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="name" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column label="角色" width="120" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'" size="small">
              {{ roleMap[row.role] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.status" active-value="active" inactive-value="inactive"
              @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="120" align="center" />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form ref="userForm" :model="userForm" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色" style="width:100%">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态" style="width:100%">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const mockUsers = [
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "admin", status: "active", createdAt: "2026-01-15" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "user", status: "active", createdAt: "2026-02-20" },
  { id: 3, name: "王五", email: "wangwu@example.com", role: "editor", status: "active", createdAt: "2026-03-10" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "user", status: "inactive", createdAt: "2026-03-22" },
  { id: 5, name: "孙七", email: "sunqi@example.com", role: "admin", status: "active", createdAt: "2026-04-05" },
  { id: 6, name: "周八", email: "zhouba@example.com", role: "editor", status: "active", createdAt: "2026-04-18" },
  { id: 7, name: "吴九", email: "wujiu@example.com", role: "user", status: "active", createdAt: "2026-05-01" },
  { id: 8, name: "郑十", email: "zhengshi@example.com", role: "user", status: "inactive", createdAt: "2026-05-12" },
  { id: 9, name: "陈明", email: "chenming@example.com", role: "editor", status: "active", createdAt: "2026-06-01" },
  { id: 10, name: "林蕴", email: "linlin@example.com", role: "admin", status: "active", createdAt: "2026-06-15" },
  { id: 11, name: "黄强", email: "huangqiang@example.com", role: "user", status: "active", createdAt: "2026-06-20" },
  { id: 12, name: "杨红", email: "yanghong@example.com", role: "user", status: "inactive", createdAt: "2026-07-01" },
];

export default {
  name: "BusinessPage",
  data() {
    return {
      users: JSON.parse(JSON.stringify(mockUsers)),
      searchForm: { keyword: "", role: "", status: "" },
      page: 1, pageSize: 8, loading: false,
      dialogVisible: false, isEdit: false, editingId: null,
      userForm: { name: "", email: "", role: "", status: "" },
      formRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    }
  },
  computed: {
    roleMap() {
      return { admin: "管理员", editor: "编辑", user: "普通用户" }
    },
    filteredUsers() {
      const kw = this.searchForm.keyword?.trim().toLowerCase() || ""
      return this.users.filter((u) => {
        if (kw && !u.name.includes(kw) && !u.email.toLowerCase().includes(kw)) return false
        if (this.searchForm.role && u.role !== this.searchForm.role) return false
        if (this.searchForm.status && u.status !== this.searchForm.status) return false
        return true
      })
    },
    total() { return this.filteredUsers.length },
    pagedUsers() {
      const start = (this.page - 1) * this.pageSize
      return this.filteredUsers.slice(start, start + this.pageSize)
    },
    dialogTitle() { return this.isEdit ? "编辑用户" : "新增用户" },
  },
  watch: {
    filteredUsers() { this.page = 1 },
  },
  methods: {
    handleSearch() {},
    handleReset() { this.searchForm = { keyword: "", role: "", status: "" } },
    handlePageChange(val) { this.page = val },

    handleAdd() {
      this.isEdit = false; this.editingId = null
      this.userForm = { name: "", email: "", role: "", status: "active" }
      this.dialogVisible = true
      this.$nextTick(() => { this.$refs.userForm?.clearValidate() })
    },
    handleEdit(row) {
      this.isEdit = true; this.editingId = row.id
      this.userForm = { name: row.name, email: row.email, role: row.role, status: row.status }
      this.dialogVisible = true
      this.$nextTick(() => { this.$refs.userForm?.clearValidate() })
    },
    handleSave() {
      this.$refs.userForm.validate((valid) => {
        if (!valid) return
        if (this.isEdit) {
          const idx = this.users.findIndex((u) => u.id === this.editingId)
          if (idx >= 0) Object.assign(this.users[idx], { ...this.userForm })
          this.$message.success("修改成功")
        } else {
          this.users.unshift({ id: Date.now(), createdAt: new Date().toISOString().slice(0, 10), ...this.userForm })
          this.$message.success("新增成功")
        }
        this.dialogVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm("确定删除用户 " + row.name + " 吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.users = this.users.filter((u) => u.id !== row.id)
        this.$message.success("已删除")
      }).catch(() => {})
    },
    toggleStatus(row) {
      this.$message.success(row.status === "active" ? "已启用" : "已停用")
    },
  },
}
</script>

<style scoped>
.business-page { max-width: 1200px; margin: 0 auto; }
.search-form { margin-bottom: -10px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
