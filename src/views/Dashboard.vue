<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="item in statsCards" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: item.color }">
              <el-icon :size="32"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
          <div class="stat-footer">
            <span :class="item.trend > 0 ? 'trend-up' : 'trend-down'">
              <el-icon><component :is="item.trend > 0 ? 'CaretTop' : 'CaretBottom'" /></el-icon>
              {{ Math.abs(item.trend) }}%
            </span>
            <span class="stat-label">较上周</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：模块数据统计 -->
    <el-row :gutter="20" class="module-row">
      <el-col :span="6" v-for="module in moduleStats" :key="module.name">
        <el-card shadow="hover" class="module-card">
          <template #header>
            <div class="module-header">
              <el-icon :size="20" :color="module.color"><component :is="module.icon" /></el-icon>
              <span>{{ module.name }}</span>
            </div>
          </template>
          <div class="module-stats">
            <div class="module-item" v-for="stat in module.stats" :key="stat.label">
              <span class="item-label">{{ stat.label }}</span>
              <span class="item-value">{{ stat.value }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第三行：图表展示 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 内容发布趋势 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>内容发布趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="trendChartRef"></div>
        </el-card>
      </el-col>

      <!-- 模块内容分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>模块内容分布</span>
          </template>
          <div class="chart-container" ref="pieChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第四行：最近动态 -->
    <el-row :gutter="20" class="activity-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>最新发布</span>
          </template>
          <div class="activity-list">
            <div class="activity-item" v-for="item in recentPublish" :key="item.id">
              <div class="activity-icon" :style="{ background: item.color }">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ item.title }}</div>
                <div class="activity-meta">{{ item.module }} · {{ item.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>待审核内容</span>
          </template>
          <div class="activity-list">
            <div class="activity-item" v-for="item in pendingReview" :key="item.id">
              <el-tag :type="item.tagType" size="large">{{ item.module }}</el-tag>
              <div class="activity-content" style="flex: 1;">
                <div class="activity-title">{{ item.title }}</div>
                <div class="activity-meta">提交时间：{{ item.time }}</div>
              </div>
              <el-button type="primary" size="small" link>去审核</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const trendPeriod = ref('week')
const trendChartRef = ref(null)
const pieChartRef = ref(null)

// 顶部统计卡片
const statsCards = ref([
  { title: '总内容数', value: '1,856', icon: 'Document', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', trend: 12 },
  { title: '今日访问', value: '3,245', icon: 'View', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', trend: 8 },
  { title: '用户总数', value: '8,932', icon: 'User', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', trend: 15 },
  { title: '待审核', value: '23', icon: 'Clock', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', trend: -5 }
])

// 模块统计数据
const moduleStats = ref([
  {
    name: '时政要闻',
    icon: 'Document',
    color: '#409EFF',
    stats: [
      { label: '文章总数', value: 456 },
      { label: '本周新增', value: 28 },
      { label: '待审核', value: 5 }
    ]
  },
  {
    name: '文化传承',
    icon: 'Reading',
    color: '#67C23A',
    stats: [
      { label: '内容总数', value: 328 },
      { label: '本周新增', value: 15 },
      { label: '待审核', value: 3 }
    ]
  },
  {
    name: '典型引领',
    icon: 'Medal',
    color: '#E6A23C',
    stats: [
      { label: '先进个人', value: 145 },
      { label: '先进集体', value: 67 },
      { label: '待审核', value: 8 }
    ]
  },
  {
    name: '实践育人',
    icon: 'Trophy',
    color: '#F56C6C',
    stats: [
      { label: '校园实践', value: 234 },
      { label: '社会实践', value: 189 },
      { label: '待审核', value: 4 }
    ]
  },
  {
    name: '资源中心',
    icon: 'FolderOpened',
    color: '#909399',
    stats: [
      { label: '专题资源', value: 89 },
      { label: '软件资源', value: 45 },
      { label: '总下载量', value: 12567 }
    ]
  }
])

// 最新发布
const recentPublish = ref([
  { id: 1, title: '中央民族工作会议精神学习解读', module: '时政要闻', time: '10分钟前', icon: 'Document', color: '#409EFF' },
  { id: 2, title: '新增先进个人：张明同志先进事迹', module: '典型引领', time: '30分钟前', icon: 'Medal', color: '#E6A23C' },
  { id: 3, title: '民族文化节活动报道', module: '文化传承', time: '1小时前', icon: 'Reading', color: '#67C23A' },
  { id: 4, title: '校园民族团结实践活动成功举办', module: '实践育人', time: '2小时前', icon: 'Trophy', color: '#F56C6C' },
  { id: 5, title: '民族语言学习助手v2.5发布', module: '资源中心', time: '3小时前', icon: 'FolderOpened', color: '#909399' }
])

// 待审核内容
const pendingReview = ref([
  { id: 1, title: '铸牢中华民族共同体意识专题讲座', module: '时政要闻', time: '2026-06-08 10:30', tagType: '' },
  { id: 2, title: '少数民族传统手工艺展览', module: '文化传承', time: '2026-06-08 09:15', tagType: 'success' },
  { id: 3, title: '李华同志先进事迹材料', module: '典型引领', time: '2026-06-08 08:45', tagType: 'warning' },
  { id: 4, title: '社区志愿服务活动总结', module: '实践育人', time: '2026-06-07 16:20', tagType: 'danger' }
])

// 初始化图表
const initCharts = () => {
  // 内容发布趋势图
  if (trendChartRef.value) {
    const trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['时政要闻', '文化传承', '典型引领', '实践育人', '资源中心'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [
        { name: '时政要闻', type: 'line', smooth: true, data: [12, 15, 8, 18, 22, 10, 16], itemStyle: { color: '#409EFF' } },
        { name: '文化传承', type: 'line', smooth: true, data: [8, 10, 12, 9, 14, 8, 11], itemStyle: { color: '#67C23A' } },
        { name: '典型引领', type: 'line', smooth: true, data: [5, 8, 6, 10, 7, 12, 9], itemStyle: { color: '#E6A23C' } },
        { name: '实践育人', type: 'line', smooth: true, data: [10, 12, 15, 13, 18, 14, 16], itemStyle: { color: '#F56C6C' } },
        { name: '资源中心', type: 'line', smooth: true, data: [3, 5, 4, 6, 5, 7, 4], itemStyle: { color: '#909399' } }
      ]
    })
  }

  // 模块内容分布饼图
  if (pieChartRef.value) {
    const pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            { value: 456, name: '时政要闻', itemStyle: { color: '#409EFF' } },
            { value: 328, name: '文化传承', itemStyle: { color: '#67C23A' } },
            { value: 212, name: '典型引领', itemStyle: { color: '#E6A23C' } },
            { value: 423, name: '实践育人', itemStyle: { color: '#F56C6C' } },
            { value: 134, name: '资源中心', itemStyle: { color: '#909399' } }
          ],
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }
      ]
    })
  }
}

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    border-radius: 8px;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 5px;
        }

        .stat-title {
          font-size: 14px;
          color: #909399;
        }
      }
    }

    .stat-footer {
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      font-size: 13px;

      .trend-up {
        color: #67c23a;
        display: flex;
        align-items: center;
        gap: 3px;
      }

      .trend-down {
        color: #f56c6c;
        display: flex;
        align-items: center;
        gap: 3px;
      }

      .stat-label {
        color: #909399;
      }
    }
  }

  .module-row {
    margin-bottom: 20px;
  }

  .module-card {
    border-radius: 8px;

    .module-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    .module-stats {
      .module-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .item-label {
          font-size: 14px;
          color: #606266;
        }

        .item-value {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-container {
      height: 300px;
    }
  }

  .activity-row {
    .activity-list {
      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;

          .activity-title {
            font-size: 14px;
            color: #303133;
            margin-bottom: 5px;
          }

          .activity-meta {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>
