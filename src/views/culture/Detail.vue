<template>
  <div class="culture-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              <span>返回</span>
            </el-button>
            <span class="header-title">内容详情</span>
          </div>
          <div class="header-right">
            <el-button @click="handleEdit">
              <el-icon><Edit /></el-icon>
              <span>编辑</span>
            </el-button>
            <el-button type="danger" @click="handleDelete">
              <el-icon><Delete /></el-icon>
              <span>删除</span>
            </el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <!-- 基础信息 -->
        <div class="section">
          <h2 class="section-title">{{ detailData.title }}</h2>
          <div class="meta-info">
            <el-tag effect="plain" size="large">{{ detailData.category }}</el-tag>
            <el-tag :type="getStatusType(detailData.status)" size="large">
              {{ getStatusText(detailData.status) }}
            </el-tag>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              <span>{{ detailData.views }} 次浏览</span>
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ detailData.updateTime }}</span>
            </span>
          </div>
        </div>
        <!-- 封面图 -->
        <div class="section" v-if="detailData.cover">
          <h3 class="section-subtitle">封面图</h3>
          <el-image
            :src="detailData.cover"
            :preview-src-list="[detailData.cover]"
            fit="cover"
            class="cover-image"
          />
        </div>

        <!-- 简介 -->
        <div class="section" v-if="detailData.briefIntro">
          <h3 class="section-subtitle">简介</h3>
          <p class="brief-intro">{{ detailData.briefIntro }}</p>
        </div>

        <!-- 内容详情 -->
        <div class="section">
          <h3 class="section-subtitle">内容详情</h3>
          <div class="rich-content" v-html="detailData.content"></div>
        </div>

        <!-- 图片集 -->
        <div class="section" v-if="detailData.images && detailData.images.length > 0">
          <h3 class="section-subtitle">
            图片集
            <el-tag type="info" size="small" style="margin-left: 10px;">
              共 {{ detailData.images.length }} 张
            </el-tag>
          </h3>
          <div class="image-gallery">
            <el-image
              v-for="(img, index) in detailData.images"
              :key="index"
              :src="img"
              :preview-src-list="detailData.images"
              :initial-index="index"
              fit="cover"
              class="gallery-item"
            />
          </div>
        </div>

        <!-- 视频资料 -->
        <div class="section" v-if="detailData.videos && detailData.videos.length > 0">
          <h3 class="section-subtitle">
            视频资料
            <el-tag type="danger" size="small" style="margin-left: 10px;">
              共 {{ detailData.videos.length }} 个
            </el-tag>
          </h3>
          <div class="video-list">
            <div v-for="(video, index) in detailData.videos" :key="index" class="video-item">
              <el-icon class="video-icon"><VideoCamera /></el-icon>
              <a :href="video" target="_blank" class="video-link">视频链接 {{ index + 1 }}</a>
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="section">
          <h3 class="section-subtitle">其他信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="是否推荐到首页">
              <el-tag :type="detailData.isRecommend ? 'success' : 'info'">
                {{ detailData.isRecommend ? '是' : '否' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="排序权重">
              {{ detailData.sortOrder }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间" :span="2">
              {{ detailData.createTime || detailData.updateTime }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const detailData = ref({
  id: null,
  title: '',
  category: '',
  briefIntro: '',
  cover: '',
  content: '',
  images: [],
  videos: [],
  views: 0,
  status: 'published',
  isRecommend: false,
  sortOrder: 100,
  updateTime: '',
  createTime: ''
})

// 模拟详情数据
const mockDetailData = {
  1: {
    id: 1,
    title: '塞外长城驿站——历史的见证',
    category: '塞外长城驿站',
    briefIntro: '长城驿站是古代重要的军事防御和通信设施，见证了中华民族的历史变迁。',
    cover: 'https://via.placeholder.com/800x500/A70101/FFFFFF?text=长城驿站',
    content: '<p>塞外长城驿站是中国古代边防体系的重要组成部分。这些驿站不仅承担着军事防御的功能，还是信息传递、物资补给的重要节点。</p><p>驿站建筑融合了汉族与北方少数民族的建筑特色，体现了多民族文化的交流融合。</p><p>如今，这些历史遗迹仍然矗立在塞外大地上，诉说着千年的历史故事。</p>',
    images: [
      'https://via.placeholder.com/400x300/667788/FFFFFF?text=驿站全景',
      'https://via.placeholder.com/400x300/889966/FFFFFF?text=驿站内部',
      'https://via.placeholder.com/400x300/AA5566/FFFFFF?text=驿站城墙',
      'https://via.placeholder.com/400x300/5588AA/FFFFFF?text=驿站遗址',
      'https://via.placeholder.com/400x300/AA8855/FFFFFF?text=驿站文物',
      'https://via.placeholder.com/400x300/6699AA/FFFFFF?text=驿站铭文'
    ],
    videos: [
      'https://www.bilibili.com/video/BV1xx411c7mD',
      'https://v.qq.com/x/page/a0123456789.html'
    ],
    views: 1845,
    status: 'published',
    isRecommend: true,
    sortOrder: 100,
    updateTime: '2026-06-01 10:30:00',
    createTime: '2026-05-20 09:00:00'
  }
}

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    const id = parseInt(route.params.id)
    const data = mockDetailData[id] || mockDetailData[1]
    detailData.value = { ...data }
    loading.value = false
  }, 300)
}

const handleBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push(`/culture/edit/${route.params.id}`)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该内容吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.push('/culture/list')
  }).catch(() => {})
}

const getStatusType = (status) => {
  return { draft: 'info', pending: 'warning', published: 'success', offline: 'danger' }[status] || ''
}

const getStatusText = (status) => {
  return { draft: '草稿', pending: '待审核', published: '已发布', offline: '已下线' }[status] || ''
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.culture-detail-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;

      .header-title {
        font-weight: bold;
        font-size: 18px;
      }
    }

    .header-right {
      display: flex;
      gap: 10px;
    }
  }

  .detail-content {
    .section {
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      margin: 0 0 15px 0;
    }

    .section-subtitle {
      font-size: 16px;
      font-weight: 600;
      color: #606266;
      margin: 0 0 15px 0;
      padding-bottom: 10px;
    }

    .meta-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;

      .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: #909399;
        font-size: 14px;
      }
    }

    .cover-image {
      width: 100%;
      max-width: 800px;
      border-radius: 8px;
      cursor: pointer;
    }

    .brief-intro {
      font-size: 15px;
      line-height: 1.8;
      color: #606266;
      background: #f5f7fa;
      padding: 15px 20px;
      border-radius: 6px;
      margin: 0;
    }

    .rich-content {
      font-size: 15px;
      line-height: 1.8;
      color: #303133;

      :deep(p) {
        margin: 0 0 12px 0;
      }

      :deep(img) {
        max-width: 100%;
        border-radius: 4px;
        margin: 10px 0;
      }
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;

      .gallery-item {
        width: 100%;
        height: 160px;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .video-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .video-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 15px;
        background: #f5f7fa;
        border-radius: 6px;
        transition: background 0.3s;

        &:hover {
          background: #e8eaf0;
        }

        .video-icon {
          font-size: 20px;
          color: #F56C6C;
        }

        .video-link {
          color: #409EFF;
          text-decoration: none;
          font-size: 14px;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>

