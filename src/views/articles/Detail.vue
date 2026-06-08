<template>
  <div class="article-detail-container">

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              <span>返回</span>
            </el-button>
            <span class="header-title">文章详情</span>
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
        <!-- 文章标题 -->
        <div class="section">
          <h2 class="section-title">{{ detailData.title }}</h2>
          <div class="meta-info">
            <el-tag effect="plain" size="large">{{ detailData.category }}</el-tag>
            <el-tag :type="getStatusType(detailData.status)" size="large">
              {{ getStatusText(detailData.status) }}
            </el-tag>
            <span class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ detailData.author }}</span>
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              <span>{{ detailData.views }} 次浏览</span>
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ detailData.publishTime || detailData.updateTime }}</span>
            </span>
          </div>
        </div>

        <!-- 摘要 -->
        <div class="section" v-if="detailData.summary">
          <h3 class="section-subtitle">摘要</h3>
          <p class="summary">{{ detailData.summary }}</p>
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

        <!-- 正文内容 -->
        <div class="section">
          <h3 class="section-subtitle">正文内容</h3>
          <div class="rich-content" v-html="detailData.content"></div>
        </div>

        <!-- 附件图片 -->
        <div class="section" v-if="detailData.images && detailData.images.length > 0">
          <h3 class="section-subtitle">
            附件图片
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

        <!-- 其他信息 -->
        <div class="section">
          <h3 class="section-subtitle">其他信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="是否推荐到首页">
              <el-tag :type="detailData.isRecommend ? 'success' : 'info'">
                {{ detailData.isRecommend ? '是' : '否' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="是否置顶">
              <el-tag :type="detailData.isTop ? 'warning' : 'info'">
                {{ detailData.isTop ? '是' : '否' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="排序权重">
              {{ detailData.sortOrder }}
            </el-descriptions-item>
            <el-descriptions-item label="评论数">
              {{ detailData.commentCount || 0 }}
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
  author: '',
  summary: '',
  cover: '',
  content: '',
  images: [],
  views: 0,
  status: 'published',
  isRecommend: false,
  isTop: false,
  sortOrder: 100,
  commentCount: 0,
  publishTime: '',
  updateTime: '',
  createTime: ''
})

// 模拟详情数据
const mockDetailData = {
  1: {
    id: 1,
    title: '十四届全国人大常委会第十四次会议在京举行 习近平签署主席令公布三部法律',
    category: '时政要闻',
    author: '新华社',
    summary: '十四届全国人大常委会第十四次会议26日下午在北京人民大会堂闭幕。会议经表决，通过了金融稳定法、印花税法、反不正当竞争法修订草案。',
    cover: 'https://via.placeholder.com/800x500/A70101/FFFFFF?text=时政要闻封面',
    content: '<p>新华社北京1月26日电 十四届全国人大常委会第十四次会议26日下午在北京人民大会堂闭幕。会议经表决，通过了金融稳定法、印花税法、反不正当竞争法修订草案。国家主席习近平分别签署第37号、第38号、第39号主席令予以公布。</p><p>全国人大常委会委员长赵乐际主持闭幕会。</p><p>常委会组成人员155人出席会议，出席人数符合法定人数。</p><p>会议表决通过了全国人大常委会关于批准《〈关于持久性有机污染物的斯德哥尔摩公约〉新增列六溴环十二烷修正案》的决定、关于批准《〈关于消耗臭氧层物质的蒙特利尔议定书〉基加利修正案》的决定。</p>',
    images: [
      'https://via.placeholder.com/400x300/667788/FFFFFF?text=会议现场1',
      'https://via.placeholder.com/400x300/889966/FFFFFF?text=会议现场2',
      'https://via.placeholder.com/400x300/AA5566/FFFFFF?text=会议现场3'
    ],
    views: 3856,
    status: 'published',
    isRecommend: true,
    isTop: true,
    sortOrder: 999,
    commentCount: 0,
    publishTime: '2026-06-01 18:30:00',
    updateTime: '2026-06-01 18:30:00',
    createTime: '2026-06-01 15:00:00'
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
  router.push(`/articles/edit/${route.params.id}`)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.push('/articles/list')
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
.article-detail-container {
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
      line-height: 1.5;
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

    .summary {
      font-size: 15px;
      line-height: 1.8;
      color: #606266;
      background: #f5f7fa;
      padding: 15px 20px;
      border-radius: 6px;
      margin: 0;
      border-left: 4px solid #A70101;
    }

    .cover-image {
      width: 100%;
      max-width: 800px;
      border-radius: 8px;
      cursor: pointer;
    }

    .rich-content {
      font-size: 16px;
      line-height: 2;
      color: #303133;

      :deep(p) {
        margin: 0 0 15px 0;
        text-indent: 2em;
      }

      :deep(img) {
        max-width: 100%;
        border-radius: 4px;
        margin: 15px 0;
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
  }
}
</style>
