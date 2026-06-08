<template>
  <div class="campus-practice-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button @click="handleBack">
              <el-icon><ArrowLeft /></el-icon>
              <span>返回</span>
            </el-button>
            <span class="header-title">校园实践详情</span>
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

      <div class="detail-content" v-loading="loading">
        <h1 class="practice-title">{{ detail.title }}</h1>

        <div class="practice-meta">
          <el-tag type="primary">{{ detail.type }}</el-tag>
          <span class="meta-item"><el-icon><Calendar /></el-icon> {{ detail.time }}</span>
          <span class="meta-item"><el-icon><Location /></el-icon> {{ detail.location }}</span>
          <span class="meta-item"><el-icon><User /></el-icon> 参与人数：{{ detail.participants }}人</span>
          <span class="meta-item"><el-icon><View /></el-icon> 浏览量：{{ detail.views }}</span>
        </div>

        <div class="practice-cover" v-if="detail.cover">
          <img :src="detail.cover" alt="封面图" />
        </div>

        <div class="practice-intro" v-if="detail.briefIntro">
          <h3>活动简介</h3>
          <p>{{ detail.briefIntro }}</p>
        </div>

        <div class="practice-content">
          <h3>活动详情</h3>
          <div v-html="detail.content"></div>
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

const detail = ref({
  id: 1,
  title: '民族团结主题演讲比赛',
  type: '文化活动',
  time: '2024-03-15 14:00',
  location: '学校礼堂',
  participants: 150,
  views: 523,
  cover: '',
  briefIntro: '为增强学生民族团结意识，促进各民族学生交流交融，特举办本次演讲比赛。',
  content: '<p>活动详情内容...</p>'
})

const fetchDetail = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push(`/practice/campus/edit/${detail.value.id}`)
}

const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.back()
  })
}

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
.campus-practice-detail-container {
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
    .practice-title {
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 20px;
      color: #303133;
    }

    .practice-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 20px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: #606266;
      }
    }

    .practice-cover {
      margin-bottom: 30px;

      img {
        width: 100%;
        max-width: 800px;
        border-radius: 8px;
      }
    }

    .practice-intro {
      margin-bottom: 30px;

      h3 {
        font-size: 20px;
        font-weight: bold;
        margin: 0 0 15px;
        color: #303133;
      }

      p {
        font-size: 15px;
        line-height: 1.8;
        color: #606266;
        margin: 0;
      }
    }

    .practice-content {
      h3 {
        font-size: 20px;
        font-weight: bold;
        margin: 0 0 15px;
        color: #303133;
      }

      :deep(img) {
        max-width: 100%;
        border-radius: 4px;
      }
    }
  }
}
</style>
