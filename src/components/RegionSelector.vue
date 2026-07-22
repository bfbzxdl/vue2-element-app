<template>
  <div class="region-selector" ref="regionSelector">
    <el-input
      :value="displayText"
      placeholder="请选择省/市/区/街道"
      readonly
      suffix-icon="el-icon-arrow-down"
      @click.native="togglePanel"
      clearable
      @clear="clearSelection"
    />
    <div v-show="panelVisible" class="region-panel" @click.stop>
      <div v-if="breadcrumbs.length > 1" class="region-breadcrumb">
        <span
          v-for="(crumb, idx) in breadcrumbs"
          :key="idx"
          class="crumb-item"
          :class="{ active: idx === breadcrumbs.length - 1 }"
          @click="goTo(idx)"
        >
          {{ crumb.label }}
          <i v-if="idx < breadcrumbs.length - 1" class="el-icon-arrow-right" />
        </span>
      </div>
      <div class="region-items">
        <div v-if="loading" class="region-loading">
          <i class="el-icon-loading" /> 加载中...
        </div>
        <div
          v-for="item in currentItems"
          :key="item.value"
          class="region-item"
          :class="{ selected: isSelected(item) }"
        >
          <span class="region-item-label" @click="selectItem(item)">
            {{ item.label }}
          </span>
          <span
            v-if="!item.leaf"
            class="region-item-expand"
            title="展开下级"
            @click.stop="expandItem(item)"
          >
            <i class="el-icon-arrow-right" />
          </span>
        </div>
        <div v-if="!loading && currentItems.length === 0" class="region-empty">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchProvinces, fetchCities, fetchDistricts, fetchTowns, hasDistricts, hasTowns } from '../mock/region.js'

export default {
  name: 'RegionSelector',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      panelVisible: false,
      selected: [],           // [{ value, label }, ...] selected path
      breadcrumbs: [],        // [{ value, label }, ...]
      currentItems: [],       // items for current level
      loading: false,
    }
  },
  computed: {
    displayText() {
      if (this.selected.length === 0) return ''
      const last = this.selected[this.selected.length - 1]
      return last ? last.label : ''
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          // External value change - not implemented for now
        }
      },
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    async loadItems(parentValue, level) {
      this.loading = true
      try {
        let items = []
        if (level === 0) {
          items = await fetchProvinces()
        } else if (level === 1) {
          items = await fetchCities(parentValue)
        } else if (level === 2) {
          items = await fetchDistricts(parentValue)
        } else if (level === 3) {
          items = await fetchTowns(parentValue)
        }
        return items.map(item => ({
          value: item.value,
          label: item.label,
          leaf: (level === 0 && !hasDistricts(item.value))
                || (level === 1 && !hasTowns(item.value))
                || level >= 2,
        }))
      } finally {
        this.loading = false
      }
    },

    async togglePanel() {
      if (this.panelVisible) {
        this.panelVisible = false
        return
      }
      this.panelVisible = true
      if (this.currentItems.length === 0) {
        const items = await this.loadItems(null, 0)
        this.currentItems = items
        this.breadcrumbs = [{ value: '', label: '请选择省份' }]
      }
    },

   selectItem(item) {
      if (this.breadcrumbs.length === 0) return
     const curLevel = this.breadcrumbs.length - 1
      // Keep only breadcrumbs up to current level
      this.breadcrumbs = this.breadcrumbs.slice(0, curLevel + 1)
      // Update last breadcrumb to selected item
      this.breadcrumbs[curLevel] = { value: item.value, label: item.label }
      // Update selected path
      this.selected = this.selected.slice(0, curLevel)
      this.selected.push({ value: item.value, label: item.label })
      // Emit change
      this.emitChange()
      // Close panel
      this.panelVisible = false
    },

   async expandItem(item) {
      if (this.breadcrumbs.length === 0) return
     const curLevel = this.breadcrumbs.length - 1
      // Update breadcrumb to show the selected parent
      this.breadcrumbs[curLevel] = { value: item.value, label: item.label }
      // Add next level placeholder
      const nextLevel = curLevel + 1
      if (nextLevel > 3) return
      const items = await this.loadItems(item.value, nextLevel)
      this.breadcrumbs.push({ value: '', label: '' })
      this.currentItems = items
    },

   goTo(idx) {
      if (this.breadcrumbs.length === 0) return
     if (idx >= this.breadcrumbs.length - 1) return
      // Go back to idx level and re-load
      this.breadcrumbs = this.breadcrumbs.slice(0, idx + 1)
      this.breadcrumbs.push({ value: '', label: '' })
      // Reload items for this level
      const parentValue = idx === 0 ? null : this.breadcrumbs[idx - 1].value
      this.loadItems(parentValue, idx).then(items => {
        this.currentItems = items
      })
      // Truncate selected
      this.selected = this.selected.slice(0, idx + 1)
      this.emitChange()
    },

   isSelected(item) {
     const curLevel = this.breadcrumbs.length - 2
      if (curLevel < 0 || curLevel >= this.selected.length || !this.selected[curLevel]) return false
      return this.selected[curLevel].value === item.value
   },

    clearSelection() {
      this.panelVisible = false
      this.selected = []
      this.breadcrumbs = []
      this.currentItems = []
      this.emitChange()
    },

    handleOutsideClick(e) {
      if (this.$refs.regionSelector && !this.$refs.regionSelector.contains(e.target)) {
        this.panelVisible = false
      }
    },

    emitChange() {
      this.$emit('input', this.selected.map(s => s.value))
      this.$emit('change', {
        values: this.selected.map(s => s.value),
        labels: this.selected.map(s => s.label),
      })
    },
  },
}
</script>

<style scoped>
.region-selector {
  position: relative;
  width: 100%;
}

.region-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 2000;
}

.region-breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
  font-size: 13px;
  flex-wrap: wrap;
}

.crumb-item {
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
}
.crumb-item:hover { color: #409eff; }
.crumb-item.active { color: #409eff; font-weight: 600; }
.crumb-item i { color: #c0c4cc; margin: 0 2px; font-size: 12px; }

.region-items { padding: 4px 0; }

.region-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.region-item:hover { background: #f5f7fa; }
.region-item.selected .region-item-label {
  color: #409eff;
  font-weight: 600;
}

.region-item-label {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.region-item-expand {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s;
  color: #c0c4cc;
  cursor: pointer;
}
.region-item-expand:hover {
  background: #e8f4ff;
  color: #409eff;
}

.region-loading,
.region-empty {
  padding: 24px;
  text-align: center;
  color: #909399;
  font-size: 13px;
}
</style>
