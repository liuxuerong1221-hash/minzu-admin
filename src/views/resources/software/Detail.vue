<template>
  <div class="resource-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack"><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
            <span class="header-title">软件资源详情</span>
          </div>
          <div>
            <el-button @click="handleEdit"><el-icon><Edit /></el-icon><span>编辑</span></el-button>
            <el-button type="danger" @click="handleDelete"><el-icon><Delete /></el-icon><span>删除</span></el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <div class="section software-header">
          <div class="icon-wrapper">
            <el-image v-if="detail.icon" :src="detail.icon" fit="cover" class="icon-img" />
            <div v-else class="icon-placeholder"><el-icon :size="48"><Monitor /></el-icon></div>
          </div>
          <div class="header-info">
            <h2 class="software-title">{{ detail.title }} <span class="version">{{ detail.version }}</span></h2>
            <div class="meta-tags">
              <el-tag size="large">{{ detail.category }}</el-tag>
              <el-tag type="info" size="large">{{ detail.platform }}</el-tag>
              <el-tag type="success" size="large">{{ detail.license }}</el-tag>
            </div>
            <div class="meta-info">
              <span class="info-item"><el-icon><Files /></el-icon> 大小：{{ detail.fileSize }}</span>
              <span class="info-item"><el-icon><Download /></el-icon> 下载量：{{ detail.downloads }}</span>
              <span class="info-item"><el-icon><Calendar /></el-icon> 更新时间：{{ detail.updateTime }}</span>
            </div>
            <el-button type="primary" :icon="Download" style="margin-top: 12px;">下载安装包</el-button>
          </div>
        </div>

        <div class="section">
          <h3 class="section-subtitle">软件简介</h3>
          <p class="brief">{{ detail.description }}</p>
        </div>

        <div class="section">
          <h3 class="section-subtitle">功能介绍</h3>
          <div class="rich-content" v-html="detail.content"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const detail = ref({})

const mockDetail = {
  id: 1,
  title: '民族语言学习助手',
  version: 'v2.3.1',
  category: '学习工具',
  platform: 'Windows',
  license: '免费',
  fileSize: '85MB',
  downloads: 1245,
  updateTime: '2026-05-15',
  icon: '',
  description: '一款支持多民族语言互译、发音学习的桌面应用，内置丰富的民族文化知识库，助力各族群众语言交流学习。',
  content: '<p><strong>主要功能：</strong></p><p>1. 支持蒙古语、藏语、维吾尔语等多种民族语言与汉语互译</p><p>2. 标准发音示范与跟读评测</p><p>3. 民族文化知识图谱</p><p>4. 离线词库下载，无网络也可使用</p><p><strong>系统要求：</strong>Windows 10 及以上，4GB 内存</p>'
}

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    detail.value = { ...mockDetail }
    loading.value = false
  }, 300)
}

const handleBack = () => { router.back() }
const handleEdit = () => { router.push(`/resources/software/edit/${route.params.id}`) }
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该软件资源吗？', '提示', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); router.push('/resources/software/list') })
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
    .section { margin-bottom: 30px; &:last-child { margin-bottom: 0; } }
    .software-header {
      display: flex; gap: 30px; padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%); border-radius: 8px;
      .icon-wrapper { flex-shrink: 0; }
      .icon-img { width: 120px; height: 120px; border-radius: 16px; }
      .icon-placeholder {
        width: 120px; height: 120px; background: #e8eaf0; border-radius: 16px;
        display: flex; align-items: center; justify-content: center; color: #909399;
      }
      .header-info { flex: 1; display: flex; flex-direction: column; gap: 12px; }
      .software-title {
        font-size: 24px; font-weight: bold; color: #303133; margin: 0;
        .version { font-size: 16px; color: #909399; font-weight: normal; margin-left: 8px; }
      }
      .meta-tags { display: flex; gap: 10px; }
      .meta-info {
        display: flex; gap: 20px; flex-wrap: wrap;
        .info-item { display: inline-flex; align-items: center; gap: 5px; color: #606266; font-size: 14px; }
      }
    }
    .section-subtitle { font-size: 16px; font-weight: 600; color: #606266; margin: 0 0 15px 0; padding-bottom: 10px; }
    .brief {
      font-size: 15px; line-height: 1.8; color: #606266; background: #f5f7fa;
      padding: 15px 20px; border-radius: 6px; margin: 0; border-left: 4px solid #409EFF;
    }
    .rich-content {
      font-size: 15px; line-height: 1.8; color: #303133;
      :deep(p) { margin: 0 0 12px 0; }
    }
  }
}
</style>
