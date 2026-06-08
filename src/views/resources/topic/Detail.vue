<template>
  <div class="resource-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
            <span class="header-title">专题资源详情</span>
          </div>
          <div>
            <el-button @click="handleEdit"><el-icon><Edit /></el-icon><span>编辑</span></el-button>
            <el-button type="danger" @click="handleDelete"><el-icon><Delete /></el-icon><span>删除</span></el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="1" border size="large">
          <el-descriptions-item label="专题资源链接" label-class-name="label-cell">
            <el-link :href="detail.link" target="_blank" type="primary" :underline="false">
              <span>{{ detail.link }}</span>
              <el-icon style="margin-left: 5px;"><TopRight /></el-icon>
            </el-link>
          </el-descriptions-item>

          <el-descriptions-item label="资源详情" label-class-name="label-cell">
            <div class="description-text">{{ detail.description }}</div>
          </el-descriptions-item>

          <el-descriptions-item label="状态" label-class-name="label-cell">
            <el-tag :type="detail.status === '上架' ? 'success' : 'info'" size="large">
              {{ detail.status }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="创建时间" label-class-name="label-cell">
            {{ detail.createTime }}
          </el-descriptions-item>

          <el-descriptions-item label="更新时间" label-class-name="label-cell">
            {{ detail.updateTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TopRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const detail = ref({})

const mockDetail = {
  id: 1,
  link: 'https://example.com/topic/minzu-unity',
  description: '铸牢中华民族共同体意识学习读本PDF版本，包含理论阐述、典型案例和实践指南。本资源系统阐述了铸牢中华民族共同体意识的重大意义、科学内涵和实践要求，是开展民族团结进步教育的重要学习材料。',
  status: '上架',
  createTime: '2026-05-10 14:30:25',
  updateTime: '2026-05-15 09:12:40'
}

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    detail.value = { ...mockDetail }
    loading.value = false
  }, 300)
}

const handleBack = () => { router.back() }
const handleEdit = () => { router.push(`/resources/topic/edit/${route.params.id}`) }
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该专题资源吗？', '提示', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); router.push('/resources/topic/list') })
}

onMounted(() => { fetchData() })
</script>

<style lang="scss" scoped>
.resource-detail-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-left { display: flex; align-items: center; gap: 15px; }
    .header-title { font-weight: bold; font-size: 18px; }
  }
  .detail-content {
    :deep(.label-cell) {
      width: 150px;
      background-color: #fafafa;
      font-weight: 600;
    }
    .description-text {
      line-height: 1.8;
      color: #606266;
      white-space: pre-wrap;
    }
  }
}
</style>
