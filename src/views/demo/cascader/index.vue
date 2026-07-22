<template>
  <div class="demo-page">
    <el-card class="demo-card" shadow="hover">
      <template slot="header"><span><i class="el-icon-s-unfold"></i> 级联选择器</span></template>
      <el-form label-width="100px" class="demo-form">
        <el-form-item label="选择地址">
          <RegionSelector v-model="regionValue" @change="handleRegionChange" />
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader
            v-model="selectedCategory"
            :options="categoryOptions"
            :props="{ multiple: true, checkStrictly: true, label: 'name', value: 'id' }"
            clearable collapse-tags collapse-tags-tooltip
            placeholder="请选择商品分类（可多选）" style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="选中结果">
          <el-input :value="resultText" type="textarea" :rows="2" readonly placeholder="选择后这里会显示结果" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import RegionSelector from "./RegionSelector"

export default {
  name: "DemoCascader",
  components: { RegionSelector },
  data() {
    return {
      regionValue: [],
      addressPathLabels: [],
      selectedCategory: [],
      categoryOptions: [
        { id: "c1", name: "电子产品", children: [
          { id: "c1-1", name: "手机通讯", children: [
            { id: "c1-1-1", name: "智能手机" }, { id: "c1-1-2", name: "功能手机" }, { id: "c1-1-3", name: "手机配件" },
          ]},
          { id: "c1-2", name: "电脑办公", children: [
            { id: "c1-2-1", name: "笔记本" }, { id: "c1-2-2", name: "台式机" }, { id: "c1-2-3", name: "显示器" },
          ]},
        ]},
        { id: "c2", name: "服装鞋帽", children: [
          { id: "c2-1", name: "男装", children: [
            { id: "c2-1-1", name: "上衣" }, { id: "c2-1-2", name: "裤装" }, { id: "c2-1-3", name: "外套" },
          ]},
          { id: "c2-2", name: "女装", children: [
            { id: "c2-2-1", name: "连衣裙" }, { id: "c2-2-2", name: "半身裙" }, { id: "c2-2-3", name: "针织衫" },
          ]},
        ]},
        { id: "c3", name: "食品生鲜", children: [
          { id: "c3-1", name: "水果", children: [
            { id: "c3-1-1", name: "苹果" }, { id: "c3-1-2", name: "香蕉" }, { id: "c3-1-3", name: "葡萄" },
          ]},
          { id: "c3-2", name: "蔬菜", children: [
            { id: "c3-2-1", name: "叶菜类" }, { id: "c3-2-2", name: "根茎类" },
          ]},
        ]},
      ],
    }
  },
  computed: {
    resultText() {
      const parts = []
      if (this.regionValue.length) {
        parts.push("地址: " + this.addressPathLabels.join(" / "))
      }
      if (this.selectedCategory.length) {
        const labels = this.selectedCategory.map((v) => this.findLabel(this.categoryOptions, v))
        parts.push("分类: " + labels.join("、"))
      }
      return parts.length ? parts.join("\n") : ""
    },
  },
  methods: {
    findLabel(options, path) {
      if (!Array.isArray(path)) return ""
      const labels = []; let current = options
      for (const id of path) {
        const node = current.find((n) => n.id === id)
        if (!node) break
        labels.push(node.name); current = node.children || []
      }
      return labels.join(" / ")
    },
    handleRegionChange(data) { this.addressPathLabels = data ? data.labels : [] },
    handleSubmit() {
      if (this.regionValue.length || this.selectedCategory.length) {
        this.$message.success("提交成功！选中结果如上所示。")
      } else { this.$message.warning("请先选择地址或分类。") }
    },
    handleReset() { this.regionValue = []; this.addressPathLabels = []; this.selectedCategory = [] },
  },
}
</script>

<style scoped>
.demo-page { max-width: 960px; margin: 0 auto; }
.demo-card { margin-bottom: 24px; }
.demo-form { max-width: 640px; }
</style>