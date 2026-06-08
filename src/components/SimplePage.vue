<template>
  <div class="simple-page">
    <el-card shadow="never">
      <template #header>
        <span class="header-title">{{ title }}</span>
      </template>
      <el-empty :description="description">
        <el-button type="primary" @click="handleAction">{{ actionText }}</el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  title: {
    type: String,
    default: '功能开发中'
  },
  description: {
    type: String,
    default: '该功能正在开发中，敬请期待...'
  },
  actionText: {
    type: String,
    default: '了解更多'
  }
})

const handleAction = () => {
  ElMessage.info('功能开发中，敬请期待')
}
</script>

<style lang="scss" scoped>
.simple-page {
  .header-title {
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
