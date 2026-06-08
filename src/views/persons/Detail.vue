<template>
  <div class="person-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              <span>返回</span>
            </el-button>
            <span class="header-title">人物详情</span>
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
        <!-- 人物基础信息 -->
        <div class="section person-header">
          <div class="avatar-wrapper">
            <el-avatar :size="120" :src="detailData.avatar">
              <el-icon :size="60"><User /></el-icon>
            </el-avatar>
          </div>
          <div class="header-info">
            <h2 class="person-name">{{ detailData.name }}</h2>
            <div class="meta-info">
              <el-tag size="large">{{ detailData.category }}</el-tag>
              <el-tag :type="getStatusType(detailData.status)" size="large">
                {{ getStatusText(detailData.status) }}
              </el-tag>
            </div>
            <div class="basic-info">
              <span class="info-item">
                <el-icon><Male /></el-icon>
                <span>{{ detailData.gender }}</span>
              </span>
              <span class="info-item">
                <el-icon><LocationFilled /></el-icon>
                <span>{{ detailData.ethnicity }}</span>
              </span>
              <span class="info-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ detailData.age }} 岁</span>
              </span>
              <span class="info-item">
                <el-icon><Briefcase /></el-icon>
                <span>{{ detailData.occupation }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 简介 -->
        <div class="section" v-if="detailData.briefIntro">
          <h3 class="section-subtitle">人物简介</h3>
          <p class="brief-intro">{{ detailData.briefIntro }}</p>
        </div>

        <!-- 主要事迹 -->
        <div class="section">
          <h3 class="section-subtitle">主要事迹</h3>
          <div class="rich-content" v-html="detailData.mainDeeds"></div>
        </div>

        <!-- 荣誉成就 -->
        <div class="section" v-if="detailData.honors && detailData.honors.length > 0">
          <h3 class="section-subtitle">
            荣誉成就
            <el-tag type="warning" size="small" style="margin-left: 10px;">
              共 {{ detailData.honors.length }} 项
            </el-tag>
          </h3>
          <div class="honors-list">
            <div v-for="(honor, index) in detailData.honors" :key="index" class="honor-item">
              <el-icon class="honor-icon" color="#E6A23C"><Medal /></el-icon>
              <div class="honor-content">
                <div class="honor-title">{{ honor.title }}</div>
                <div class="honor-time">{{ honor.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 图片资料 -->
        <div class="section" v-if="detailData.images && detailData.images.length > 0">
          <h3 class="section-subtitle">
            图片资料
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
            <el-descriptions-item label="浏览量">
              <el-tag type="danger">{{ detailData.views }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="排序权重">
              {{ detailData.sortOrder }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ detailData.updateTime }}
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
  name: '',
  category: '',
  avatar: '',
  gender: '',
  ethnicity: '',
  age: 0,
  occupation: '',
  briefIntro: '',
  mainDeeds: '',
  honors: [],
  images: [],
  videos: [],
  views: 0,
  status: 'published',
  isRecommend: false,
  sortOrder: 100,
  updateTime: ''
})

// 模拟详情数据
const mockDetailData = {
  1: {
    id: 1,
    name: '周联清',
    category: '民族团结模范',
    avatar: 'https://via.placeholder.com/120/667788/FFFFFF?text=周',
    gender: '男',
    ethnicity: '汉族',
    age: 56,
    occupation: '社区工作者',
    briefIntro: '扎根基层30年，致力于民族团结进步事业，为促进各民族交往交流交融作出突出贡献。',
    mainDeeds: '<p>周联清同志自1994年参加工作以来，始终坚守在基层一线，全心全意为各族群众服务。</p><p>他创新工作方法，建立"民族团结议事会"，搭建各民族群众沟通交流平台，有效化解矛盾纠纷200余起。</p><p>在他的带领下，社区各族群众像石榴籽一样紧紧抱在一起，形成了"你中有我、我中有你"的和谐氛围。</p><p>他的先进事迹被新华社、人民日报等多家媒体报道，成为基层民族工作的典范。</p>',
    honors: [
      { title: '全国民族团结进步模范个人', time: '2025年9月' },
      { title: '省级优秀共产党员', time: '2024年7月' },
      { title: '市级劳动模范', time: '2023年5月' }
    ],
    images: [
      'https://via.placeholder.com/400x300/667788/FFFFFF?text=工作照1',
      'https://via.placeholder.com/400x300/889966/FFFFFF?text=工作照2',
      'https://via.placeholder.com/400x300/AA5566/FFFFFF?text=活动照1',
      'https://via.placeholder.com/400x300/5588AA/FFFFFF?text=活动照2'
    ],
    videos: [
      'https://www.bilibili.com/video/BV1xx411c7mD'
    ],
    views: 2856,
    status: 'published',
    isRecommend: true,
    sortOrder: 100,
    updateTime: '2026-06-01 10:30:00'
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
  router.push(`/persons/edit/${route.params.id}`)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该人物档案吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.push('/persons/list')
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
.person-detail-container {
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

    .person-header {
      display: flex;
      gap: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
      border-radius: 8px;

      .avatar-wrapper {
        flex-shrink: 0;
      }

      .header-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
      }

      .person-name {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        margin: 0;
      }

      .meta-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .basic-info {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        .info-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #606266;
          font-size: 15px;
        }
      }
    }

    .section-subtitle {
      font-size: 16px;
      font-weight: 600;
      color: #606266;
      margin: 0 0 15px 0;
      padding-bottom: 10px;
    }

    .brief-intro {
      font-size: 15px;
      line-height: 1.8;
      color: #606266;
      background: #f5f7fa;
      padding: 15px 20px;
      border-radius: 6px;
      margin: 0;
      border-left: 4px solid #409EFF;
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

    .honors-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .honor-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: #fef9f0;
        border-radius: 6px;
        border-left: 4px solid #E6A23C;

        .honor-icon {
          font-size: 24px;
        }

        .honor-content {
          flex: 1;
        }

        .honor-title {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 5px;
        }

        .honor-time {
          font-size: 13px;
          color: #909399;
        }
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
