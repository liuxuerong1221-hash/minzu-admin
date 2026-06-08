<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6" v-for="item in statCards" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="card-content">
            <div class="card-left">
              <div class="card-icon" :style="{ background: item.color }">
                <el-icon :size="28">
                  <component :is="item.icon" />
                </el-icon>
              </div>
            </div>
            <div class="card-right">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-value">{{ item.value }}</div>
              <div class="card-desc" :style="{ color: item.trend === 'up' ? '#67C23A' : '#F56C6C' }">
                <el-icon>
                  <component :is="item.trend === 'up' ? 'CaretTop' : 'CaretBottom'" />
                </el-icon>
                {{ item.percent }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 访问趋势图 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">访问趋势</span>
              <el-radio-group v-model="visitPeriod" size="small">
                <el-radio-button label="week">最近7天</el-radio-button>
                <el-radio-button label="month">最近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="visitChartRef" class="chart" style="height: 350px;"></div>
        </el-card>
      </el-col>

      <!-- 内容类型占比 -->
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <span class="header-title">内容类型分布</span>
          </template>
          <div ref="contentPieRef" class="chart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据列表 -->
    <el-row :gutter="20" class="data-row">
      <!-- 热门文章 -->
      <el-col :xs="24" :lg="12">
        <el-card class="data-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">热门文章 TOP10</span>
              <el-link type="primary" :underline="false">查看更多</el-link>
            </div>
          </template>
          <el-table :data="hotArticles" style="width: 100%" stripe>
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="title" label="标题" show-overflow-tooltip />
            <el-table-column prop="views" label="浏览量" width="100" align="center">
              <template #default="{ row }">
                <el-tag type="danger" size="small">{{ row.views }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 待处理事项 -->
      <el-col :xs="24" :lg="12">
        <el-card class="data-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="header-title">待处理事项</span>
              <el-badge :value="pendingCount" :max="99" />
            </div>
          </template>
          <div class="pending-list">
            <div class="pending-item" v-for="item in pendingItems" :key="item.id" @click="handlePending(item)">
              <div class="item-left">
                <el-icon :size="20" :color="item.color">
                  <component :is="item.icon" />
                </el-icon>
                <div class="item-content">
                  <div class="item-title">{{ item.title }}</div>
                  <div class="item-desc">{{ item.desc }}</div>
                </div>
              </div>
              <el-badge :value="item.count" class="item-badge" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-card class="quick-card" shadow="hover">
      <template #header>
        <span class="header-title">快捷入口</span>
      </template>
      <div class="quick-entries">
        <div class="quick-item" v-for="item in quickEntries" :key="item.title" @click="router.push(item.path)">
          <div class="quick-icon" :style="{ background: item.color }">
            <el-icon :size="32">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="quick-title">{{ item.title }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const visitPeriod = ref('week')
const visitChartRef = ref(null)
const contentPieRef = ref(null)

// 统计卡片数据
const statCards = ref([
  {
    title: '总访问量',
    value: '126,560',
    percent: '+12.5%',
    trend: 'up',
    icon: 'View',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '文章总数',
    value: '1,245',
    percent: '+8.2%',
    trend: 'up',
    icon: 'Document',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '待审核',
    value: '23',
    percent: '-5.1%',
    trend: 'down',
    icon: 'DocumentChecked',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '用户留言',
    value: '89',
    percent: '+15.3%',
    trend: 'up',
    icon: 'ChatDotRound',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

// 热门文章
const hotArticles = ref([
  { title: '十四届全国人大常委会第二十一次会议在京举行', views: 2345 },
  { title: '关于深化民族团结进步教育的实施意见', views: 1987 },
  { title: '铸牢中华民族共同体意识专题讲座成功举办', views: 1654 },
  { title: '民族地区经济社会发展取得历史性成就', views: 1432 },
  { title: '推动新时代党的民族工作高质量发展', views: 1298 },
  { title: '中华民族共同体建设的理论与实践', views: 1156 },
  { title: '各民族交往交流交融的历史经验', views: 1045 },
  { title: '新时代民族工作的创新发展', views: 967 },
  { title: '铸牢中华民族共同体意识的路径探索', views: 856 },
  { title: '构建中华民族共有精神家园', views: 734 }
])

// 待处理事项
const pendingItems = ref([
  { id: 1, title: '待审核文章', desc: '时政要闻', count: 12, icon: 'Document', color: '#A70101' },
  { id: 2, title: '待审核人物', desc: '典型引领', count: 5, icon: 'User', color: '#E6A23C' },
  { id: 3, title: '待回复留言', desc: '交流互动', count: 6, icon: 'ChatDotRound', color: '#409EFF' }
])

const pendingCount = ref(23)

// 快捷入口
const quickEntries = ref([
  { title: '新建文章', path: '/articles/create', icon: 'EditPen', color: 'linear-gradient(135deg, #A70101 0%, #8B0000 100%)' },
  { title: '新建人物', path: '/persons/create', icon: 'UserFilled', color: 'linear-gradient(135deg, #E6A23C 0%, #D48806 100%)' },
  { title: '审核管理', path: '/audit', icon: 'DocumentChecked', color: 'linear-gradient(135deg, #409EFF 0%, #3370FF 100%)' },
  { title: '数据统计', path: '/statistics', icon: 'DataAnalysis', color: 'linear-gradient(135deg, #67C23A 0%, #529B2E 100%)' },
  { title: '用户管理', path: '/system/users', icon: 'User', color: 'linear-gradient(135deg, #909399 0%, #73767A 100%)' },
  { title: '系统设置', path: '/system/config', icon: 'Setting', color: 'linear-gradient(135deg, #F56C6C 0%, #F23030 100%)' }
])

// 初始化访问趋势图
const initVisitChart = () => {
  const chart = echarts.init(visitChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['访问量 (PV)', '访客数 (UV)']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: visitPeriod.value === 'week'
        ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        : ['1日', '5日', '10日', '15日', '20日', '25日', '30日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量 (PV)',
        type: 'line',
        smooth: true,
        data: visitPeriod.value === 'week'
          ? [1200, 1320, 1010, 1340, 1890, 2300, 2100]
          : [3200, 3800, 3600, 4200, 5100, 5800, 5600],
        itemStyle: {
          color: '#A70101'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(167, 1, 1, 0.3)' },
            { offset: 1, color: 'rgba(167, 1, 1, 0.05)' }
          ])
        }
      },
      {
        name: '访客数 (UV)',
        type: 'line',
        smooth: true,
        data: visitPeriod.value === 'week'
          ? [820, 932, 801, 934, 1290, 1330, 1320]
          : [2100, 2400, 2300, 2800, 3400, 3800, 3700],
        itemStyle: {
          color: '#E6A23C'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(230, 162, 60, 0.3)' },
            { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
          ])
        }
      }
    ]
  }
  chart.setOption(option)

  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化内容类型饼图
const initContentPie = () => {
  const chart = echarts.init(contentPieRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '内容类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 435, name: '时政要闻', itemStyle: { color: '#A70101' } },
          { value: 256, name: '典型引领', itemStyle: { color: '#E6A23C' } },
          { value: 198, name: '文化传承', itemStyle: { color: '#409EFF' } },
          { value: 178, name: '实践育人', itemStyle: { color: '#67C23A' } },
          { value: 178, name: '其他', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  chart.setOption(option)

  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 处理待办事项点击
const handlePending = (item) => {
  router.push('/audit')
}

// 监听时间周期变化
watch(visitPeriod, () => {
  initVisitChart()
})

onMounted(() => {
  initVisitChart()
  initContentPie()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  .stat-cards {
    margin-bottom: 20px;

    .stat-card {
      border-radius: 8px;

      .card-content {
        display: flex;
        align-items: center;
        gap: 20px;

        .card-left {
          .card-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
          }
        }

        .card-right {
          flex: 1;

          .card-title {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }

          .card-value {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 5px;
          }

          .card-desc {
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 3px;
          }
        }
      }
    }
  }

  .charts-row,
  .data-row {
    margin-bottom: 20px;
  }

  .chart-card,
  .data-card,
  .quick-card {
    border-radius: 8px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-title {
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  .pending-list {
    .pending-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 10px;
      background: #fafafa;

      &:hover {
        background: rgba(167, 1, 1, 0.05);
        transform: translateX(5px);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .item-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .item-content {
          .item-title {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .item-desc {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  .quick-entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;

    .quick-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      background: #fafafa;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .quick-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      .quick-title {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }
  }
}
</style>
