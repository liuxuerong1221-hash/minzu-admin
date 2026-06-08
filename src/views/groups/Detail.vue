<template>
  <div class="group-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>先进集体详情</span>
          <div>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
            <el-button @click="handleBack">返回列表</el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <!-- 头部信息 -->
        <div class="detail-header">
          <el-avatar :size="120" :src="detail.logo" :icon="OfficeBuilding" />
          <div class="header-info">
            <h2 class="group-name">{{ detail.name }}</h2>
            <p class="group-org">{{ detail.organization }}</p>
            <div class="group-tags">
              <el-tag type="success">{{ detail.levelText }}</el-tag>
              <el-tag>{{ detail.honor }}</el-tag>
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">基本信息</span>
        </el-divider>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="集体名称">{{ detail.name }}</el-descriptions-item>
          <el-descriptions-item label="所属单位">{{ detail.organization }}</el-descriptions-item>
          <el-descriptions-item label="荣誉级别">{{ detail.levelText }}</el-descriptions-item>
          <el-descriptions-item label="荣誉称号">{{ detail.honor }}</el-descriptions-item>
          <el-descriptions-item label="获奖时间">{{ detail.awardDate }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ detail.contact }}</el-descriptions-item>
          <el-descriptions-item label="涉及民族" :span="2">
            <el-tag v-for="item in detail.ethnicities" :key="item" size="small" style="margin-right: 8px;">
              {{ item }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="浏览量">{{ detail.views }}</el-descriptions-item>
          <el-descriptions-item label="推荐状态">
            <el-tag :type="detail.isRecommend ? 'success' : 'info'">
              {{ detail.isRecommend ? '已推荐' : '未推荐' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 集体简介 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">集体简介</span>
        </el-divider>
        <div class="brief-intro">{{ detail.briefIntro }}</div>

        <!-- 先进事迹 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">集体先进事迹</span>
        </el-divider>
        <div class="deeds-content" v-html="detail.deeds"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const detail = ref({})

// 级别映射
const levelMap = {
  national: '国家级',
  provincial: '省级',
  municipal: '市级',
  county: '县级'
}

// 获取详情数据
const fetchDetail = () => {
  loading.value = true
  const groupId = route.params.id

  // 模拟数据
  const mockData = [
    {
      id: 1,
      logo: '',
      name: 'XX小学民族团结教育团队',
      organization: 'XX市民族小学',
      level: 'national',
      honor: '全国民族团结进步示范集体',
      awardDate: '2023-09-01',
      ethnicities: ['汉族', '回族', '维吾尔族'],
      contact: '0991-1234567',
      briefIntro: 'XX市民族小学民族团结教育团队成立于2015年，深耕三重合育教模式，通过课程融合、活动融合、文化融合，打造民族团结进步教育品牌。团队先后被评为全国民族团结进步示范学校、自治区民族团结进步模范集体。',
      deeds: '<p>XX小学民族团结教育团队的先进事迹内容...</p>',
      views: 1456,
      isRecommend: true
    },
    {
      id: 2,
      logo: '',
      name: 'XX社区民族工作站',
      organization: 'XX街道XX社区',
      level: 'provincial',
      honor: '省级民族团结进步示范社区',
      awardDate: '2023-06-15',
      ethnicities: ['汉族', '回族', '满族'],
      contact: '010-12345678',
      briefIntro: 'XX社区民族工作站创新"五共五帮"社区治理模式，服务各族群众1.2万余人。通过组建民族团结志愿服务队、开展多元文化交流活动、建立矛盾纠纷调解机制，连续5年实现零矛盾纠纷，成为民族团结进步创建工作的典范。',
      deeds: '<p>XX社区民族工作站的先进事迹内容...</p>',
      views: 1123,
      isRecommend: true
    }
  ]

  setTimeout(() => {
    const group = mockData.find(item => item.id === parseInt(groupId))
    if (group) {
      detail.value = {
        ...group,
        levelText: levelMap[group.level] || group.level
      }
    } else {
      ElMessage.error('集体不存在')
      router.back()
    }
    loading.value = false
  }, 500)
}

// 编辑
const handleEdit = () => {
  router.push(`/groups/edit/${route.params.id}`)
}

// 返回
const handleBack = () => {
  router.push('/groups/list')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="scss">
.group-detail {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-content {
    .detail-header {
      display: flex;
      gap: 24px;
      align-items: center;
      padding: 20px;
      background: #f5f7fa;
      border-radius: 8px;
      margin-bottom: 20px;

      .header-info {
        .group-name {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        .group-org {
          color: #606266;
          margin: 0 0 12px 0;
        }

        .group-tags {
          display: flex;
          gap: 8px;
        }
      }
    }

    .brief-intro {
      line-height: 1.8;
      color: #303133;
      padding: 10px 0;
    }

    .deeds-content {
      line-height: 1.8;
      color: #303133;
      padding: 10px 0;

      :deep(img) {
        max-width: 100%;
      }
    }
  }
}
</style>
