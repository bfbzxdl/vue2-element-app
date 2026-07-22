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
      <div class="panel-body">
        <div v-for="(panel, pIdx) in panels" :key="pIdx" class="panel-column">
          <div v-for="item in panel" :key="item.value" class="region-item">
            <span
              class="region-item-radio"
              @click.stop="selectItem(item, pIdx)"
            >
              <span
                class="radio-dot"
                :class="{ checked: isItemSelected(item, pIdx) }"
              />
            </span>
            <span
              class="region-item-label"
              @click="
                item.leaf ? selectItem(item, pIdx) : expandItem(item, pIdx)
              "
            >
              {{ item.label }}
            </span>
            <span
              v-if="!item.leaf"
              class="region-item-expand"
              @click.stop="expandItem(item, pIdx)"
            >
              <i class="el-icon-arrow-right" />
            </span>
          </div>
        </div>
        <div v-if="loading" class="panel-loading">
          <i class="el-icon-loading" /> 加载中...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchProvinces,
  fetchCities,
  fetchDistricts,
  fetchTowns,
  hasCities,
  hasDistricts,
  hasTowns,
} from '@/mock/region.js';
export default {
  name: "RegionSelector",
  props: { value: { type: Array, default: () => [] } },
  data() {
    return { panelVisible: false, selected: [], panels: [], loading: false };
  },
  computed: {
    displayText() {
      if (this.selected.length === 0) return "";
      const last = this.selected[this.selected.length - 1];
      return last ? last.label : "";
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  methods: {
    async loadItems(parentValue, level) {
      this.loading = true;
      try {
        let items = [];
        if (level === 0) items = await fetchProvinces();
        else if (level === 1) items = await fetchCities(parentValue);
        else if (level === 2) items = await fetchDistricts(parentValue);
        else if (level === 3) items = await fetchTowns(parentValue);
        return items.map((item) => ({
          value: item.value,
          label: item.label,
          leaf:
            (level === 0 && !hasCities(item.value)) ||
            (level === 1 && !hasDistricts(item.value)) ||
            (level === 2 && !hasTowns(item.value)) ||
            level >= 3,
        }));
      } finally {
        this.loading = false;
      }
    },
    async togglePanel() {
      if (this.panelVisible) {
        this.panelVisible = false;
        return;
      }
      this.panelVisible = true;
      if (this.panels.length === 0) {
        const items = await this.loadItems(null, 0);
        this.panels = [items];
      }
    },
    selectItem(item, level) {
      this.selected = this.selected.slice(0, level);
      this.selected.push({ value: item.value, label: item.label });
      this.emitChange();
      this.panelVisible = false;
    },
    async expandItem(item, level) {
      const nextLevel = level + 1;
      if (nextLevel > 3) return;
      this.panels = this.panels.slice(0, level + 1);
      const items = await this.loadItems(item.value, nextLevel);
      this.panels.push(items);
    },
    isItemSelected(item, level) {
      if (level >= this.selected.length) return false;
      return this.selected[level] && this.selected[level].value === item.value;
    },
    clearSelection() {
      this.panelVisible = false;
      this.selected = [];
      this.panels = [];
      this.emitChange();
    },
    handleOutsideClick(e) {
      if (
        this.$refs.regionSelector &&
        !this.$refs.regionSelector.contains(e.target)
      ) {
        this.panelVisible = false;
      }
    },
    emitChange() {
      this.$emit(
        "input",
        this.selected.map((s) => s.value),
      );
      this.$emit("change", {
        values: this.selected.map((s) => s.value),
        labels: this.selected.map((s) => s.label),
      });
    },
  },
};
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
  width: auto;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  overflow: hidden;
}
.panel-body {
  display: flex;
  overflow-x: auto;
  max-height: 300px;
}
.panel-column {
  flex: 0 0 auto;
  min-width: 160px;
  max-width: 280px;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  max-height: 300px;
}
.panel-column:last-child {
  border-right: none;
}
.region-item {
  display: flex;
  align-items: center;
  padding: 7px 12px;
  cursor: default;
  transition: background 0.15s;
}
.region-item:hover {
  background: #f5f7fa;
}
.region-item-radio {
  flex-shrink: 0;
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
}
.radio-dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #c0c4cc;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
  box-sizing: border-box;
}
.radio-dot.checked {
  border-color: #409eff;
}
.radio-dot.checked::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 8px;
  height: 8px;
  background: #409eff;
  border-radius: 50%;
}
.region-item-radio:hover .radio-dot {
  border-color: #409eff;
}
.region-item-label {
  flex: 1;
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  padding: 2px 0;
}
.region-item-label:hover {
  color: #409eff;
}
.region-item-expand {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #c0c4cc;
  cursor: pointer;
  margin-left: 4px;
}
.region-item-expand:hover {
  background: #e8f4ff;
  color: #409eff;
}
.panel-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
}
</style>
