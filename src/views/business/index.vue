<template>
  <div class="business-page">
    <el-card shadow="hover">
      <template slot="header"><span><i class="el-icon-user"></i> 用户管理</span></template>

      <!-- ===== 搜索栏 ===== -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.keyword" placeholder="请输入用户名" clearable style="width:170px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="全部" clearable style="width:120px">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width:120px">
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <div style="width:170px">
            <RegionSelector ref="searchRegion" @change="handleSearchRegionChange" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>

      <!-- ===== 表格 ===== -->
      <el-table :data="userList" stripe border style="width:100%" v-loading="loading">
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="name" label="用户名" min-width="100" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column label="地区" min-width="160">
          <template slot-scope="{ row }">
            <span v-if="row.regionLabels && row.regionLabels.length > 0">{{ row.regionLabels.join(" / ") }}</span>
            <span v-else style="color:#c0c4cc">-</span>
          </template>
        </el-table-column>
        <el-table-column label="资料" width="140" align="center">
          <template slot-scope="{ row }">
            <el-tag v-if="row.profile" type="info" size="small" closable style="cursor:pointer" @click="handlePreviewProfile(row)" @close="handleRemoveProfile(row)">
              {{ row.profile }}
            </el-tag>
            <span v-else style="color:#c0c4cc">-</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="100" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'" size="small">{{ roleMap[row.role] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template slot-scope="{ row }">
            <el-switch v-model="row.status" active-value="active" inactive-value="inactive" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="110" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" style="color:#f56c6c" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- ===== 分页 ===== -->
      <div class="pagination-wrap">
        <el-pagination :current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next, jumper" @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- ===== 新增/编辑弹窗 ===== -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px" :close-on-click-modal="false" @close="handleDialogClose">
      <el-form ref="userForm" :model="userForm" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="地区">
          <RegionSelector ref="dialogRegion" @change="handleDialogRegionChange" />
          <div v-if="dialogRegionLabels.length > 0" style="margin-top:4px;font-size:12px;color:#909399">当前: {{ dialogRegionLabels.join(' / ') }}</div>
        </el-form-item>
        <el-form-item label="资料">
          <SingleFileUpload ref="profileUpload" accept=".pdf,.doc,.docx,.png,.jpg" @preview="handleSingleFilePreview" />
          <div style="margin-top:6px;font-size:13px;color:#909399">
          <template v-if="dialogProfile">当前: {{ dialogProfile }}</template>
          <template v-else>未选择文件</template>
          <el-button type="text" size="mini" icon="el-icon-view" @click="handlePreviewDialogProfile" style="margin-left:4px">预览</el-button>
        </div>
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
    <FilePreviewDialog ref="previewDialog" />
  </div>
</template>

<script>
import RegionSelector from "@/views/demo/cascader/RegionSelector"
import SingleFileUpload from "@/views/demo/upload/SingleFileUpload"
import FilePreviewDialog from "@/views/demo/upload/FilePreviewDialog"
import { fetchUserList, createUser, saveUser, deleteUser } from "@/api/business"

export default {
  name: "BusinessPage",
  components: { RegionSelector, SingleFileUpload, FilePreviewDialog },
  data() {
    return {
      searchForm: { keyword: "", role: "", status: "" },
      searchRegionValues: [],
      searchRegionLabels: [],
      userList: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      dialogVisible: false,
      isEdit: false,
      editingId: null,
      userForm: { name: "", email: "", role: "", status: "" },
      dialogRegionValues: [],
      dialogRegionLabels: [],
      dialogProfile: "",
      profilePreviewFile: null,
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
    roleMap: function() {
      return { admin: "管理员", editor: "编辑", user: "普通用户" }
    },
    dialogTitle: function() {
      return this.isEdit ? "编辑用户" : "新增用户"
    },
  },
  mounted: function() { this.fetchUsers() },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        var res = await fetchUserList({
          keyword: this.searchForm.keyword,
          role: this.searchForm.role,
          status: this.searchForm.status,
          region: this.searchRegionValues,
          page: this.page,
          pageSize: this.pageSize,
        });
        this.userList = res.list;
        this.total = res.total;
      } finally { this.loading = false; }
    },

    handleSearch: function() { this.page = 1; this.fetchUsers(); },

    handleReset: function() {
      this.searchForm = { keyword: "", role: "", status: "" };
      this.searchRegionValues = [];
      this.searchRegionLabels = [];
      this.page = 1;
      if (this.$refs.searchRegion) this.$refs.searchRegion.clearSelection();
      this.fetchUsers();
    },

    handlePageChange: function(val) { this.page = val; this.fetchUsers(); },

    handleSearchRegionChange: function(data) {
      this.searchRegionValues = data ? data.values : [];
      this.searchRegionLabels = data ? data.labels : [];
    },

    handleDialogRegionChange: function(data) {
      this.dialogRegionValues = data ? data.values : [];
      this.dialogRegionLabels = data ? data.labels : [];
    },

    handlePreviewProfile: function(row) {
      var fileRef = this.$refs.profileUpload;
      if (fileRef && fileRef.fileList && fileRef.fileList.length > 0 && fileRef.fileList[0].name === row.profile) {
        this.$refs.previewDialog.open(fileRef.fileList[0]);
      } else {
        this.$message.info("预览仅支持当前传输的文件");
      }
    },

    handlePreviewDialogProfile: function() {
      console.log("[Preview] >>> button clicked");
      var fileRef = this.$refs.profileUpload;
      if (fileRef && fileRef.fileList && fileRef.fileList.length > 0) {
        this.$refs.previewDialog.open(fileRef.fileList[0]);
      } else {
        this.$message.info("请先上传文件");
      }
    },

    createAndPreviewMockFile: function(filename) {
      var content = "Demo file: " + filename;
      var blob = new Blob([content], { type: "text/plain" });
      var file = { name: filename, raw: blob, uid: Date.now() };
      this.profilePreviewFile = file;
      this.$refs.previewDialog.open(file);
    },

    handleRemoveProfile: function(row) {
      row.profile = "";
      saveUser(row.id, { profile: "" });
    },

    handleAdd: function() {
      this.isEdit = false;
      this.editingId = null;
      this.userForm = { name: "", email: "", role: "", status: "active" };
      this.dialogRegionValues = [];
      this.dialogRegionLabels = [];
      this.dialogProfile = "";
      this.profilePreviewFile = null;
      if (this.$refs.profileUpload) {
        this.$refs.profileUpload.fileList = [];
        var up = this.$refs.profileUpload.$refs.upload;
        if (up) up.uploadFiles = [];
      }
      this.dialogVisible = true;
      var self = this;
      this.$nextTick(function() {
        if (self.$refs.userForm) self.$refs.userForm.clearValidate();
        if (self.$refs.dialogRegion) self.$refs.dialogRegion.clearSelection();
      });
    },

    handleEdit: function(row) {
      this.isEdit = true;
      this.editingId = row.id;
      this.userForm = { name: row.name, email: row.email, role: row.role, status: row.status };
      this.dialogRegionValues = row.region || [];
      this.dialogRegionLabels = row.regionLabels || [];
      this.dialogProfile = row.profile || "";
      this.profilePreviewFile = null;
      if (this.$refs.profileUpload) {
        this.$refs.profileUpload.fileList = [];
        var up = this.$refs.profileUpload.$refs.upload;
        if (up) up.uploadFiles = [];
      }
      this.dialogVisible = true;
      var self = this;
      this.$nextTick(function() {
        if (self.$refs.userForm) self.$refs.userForm.clearValidate();
        if (self.$refs.dialogRegion) self.$refs.dialogRegion.clearSelection();
      });
    },

    async handleSave() {
      var self = this;
      var valid = await new Promise(function(resolve) { self.$refs.userForm.validate(resolve); });
      if (!valid) return;

      var uploadRef = this.$refs.profileUpload;
      var uploadFiles = uploadRef ? uploadRef.fileList : [];
      var profile = uploadFiles.length > 0 ? uploadFiles[0].name : this.dialogProfile;
      this.profilePreviewFile = uploadFiles.length > 0 ? uploadFiles[0] : null;
      var userData = {
        name: this.userForm.name,
        email: this.userForm.email,
        role: this.userForm.role,
        status: this.userForm.status,
        region: this.dialogRegionValues,
        regionLabels: this.dialogRegionLabels,
        profile: profile,
      };

      if (this.isEdit) {
        await saveUser(this.editingId, userData);
        this.$message.success("修改成功");
      } else {
        userData.id = Date.now();
        userData.createdAt = new Date().toISOString().slice(0, 10);
        await createUser(userData);
        this.$message.success("新增成功");
      }
      this.dialogVisible = false;
      this.fetchUsers();
    },

    async handleDelete(row) {
      try {
        var self = this;
        await new Promise(function(resolve, reject) {
          self.$confirm("确定删除用户 " + row.name + " 吗？", "提示", { type: "warning" })
            .then(resolve).catch(reject);
        });
        await deleteUser(row.id);
        this.$message.success("已删除");
        this.fetchUsers();
      } catch (_) { /* user cancelled */ }
    },

    handleSingleFilePreview: function(file) {
      this.$refs.previewDialog.open(file);
    },

    handleDialogClose: function() {
      this.profilePreviewFile = null;
      var uploadRef = this.$refs.profileUpload;
      if (uploadRef) {
        uploadRef.fileList = [];
        var up = uploadRef.$refs.upload;
        if (up) up.uploadFiles = [];
      }
    },

    toggleStatus: function(row) {
      this.$message.success(row.status === "active" ? "已启用" : "已停用");
    },
  },
}
</script>

<style scoped>
.business-page { max-width: 1200px; margin: 0 auto; }
.search-form { margin-bottom: -10px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>