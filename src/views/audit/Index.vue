<template>
  <div class="audit-container">
    <!-- 搜索筛选栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="内容模块">
          <el-select v-model="searchForm.module" placeholder="请选择模块" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="时政要闻" value="时政要闻" />
            <el-option label="文化传承" value="文化传承" />
            <el-option label="典型引领" value="典型引领" />
            <el-option label="实践育人" value="实践育人" />
            <el-option label="资源中心" value="资源中心" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 130px;">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已驳回" value="已驳回" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px;"
          />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入标题" clearable style="width: 200px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon><span>搜索</span>
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon><span>重置</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.label">
        <el-card shadow="hover" class="stat-card" :class="stat.class">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="32"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-card class="table-card" shadow="never">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="待审核" name="待审核">
          <el-badge :value="pendingCount" class="tab-badge" />
        </el-tab-pane>
        <el-tab-pane label="已通过" name="已通过" />
        <el-tab-pane label="已驳回" name="已驳回" />
        <el-tab-pane label="全部" name="" />
      </el-tabs>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="title" label="内容标题" min-width="250" show-overflow-tooltip />
        <el-table-column prop="module" label="所属模块" width="110">
          <template #default="{ row }">
            <el-tag :type="getModuleTagType(row.module)">{{ row.module }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="内容类型" width="120" />
        <el-table-column prop="submitter" label="提交人" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="170" />
        <el-table-column prop="status" label="审核状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewer" label="审核人" width="100">
          <template #default="{ row }">
            <span>{{ row.reviewer || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reviewTime" label="审核时间" width="170">
          <template #default="{ row }">
            <span>{{ row.reviewTime || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon><span>查看</span>
            </el-button>
            <el-button v-if="row.status === '待审核'" link type="success" size="small" @click="handleApprove(row)">
              <el-icon><CircleCheck /></el-icon><span>通过</span>
            </el-button>
            <el-button v-if="row.status === '待审核'" link type="danger" size="small" @click="handleReject(row)">
              <el-icon><CircleClose /></el-icon><span>驳回</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="auditForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.result">
            <el-radio label="通过">通过</el-radio>
            <el-radio label="驳回">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input
            v-model="auditForm.comment"
            type="textarea"
            :rows="4"
            :placeholder="auditForm.result === '通过' ? '选填，可输入审核意见' : '必填，请说明驳回原因'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitAudit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const activeTab = ref('待审核')
const searchForm = reactive({ module: '', status: '', dateRange: null, keyword: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const stats = ref([
  { label: '待审核', value: 23, icon: 'Clock', class: 'stat-pending' },
  { label: '今日已审', value: 15, icon: 'CircleCheck', class: 'stat-today' },
  { label: '本周通过', value: 87, icon: 'SuccessFilled', class: 'stat-pass' },
  { label: '本周驳回', value: 12, icon: 'CircleClose', class: 'stat-reject' }
])

const pendingCount = computed(() => stats.value[0].value)

const tableData = ref([
  {
    id: 1,
    title: '铸牢中华民族共同体意识专题讲座报道',
    module: '时政要闻',
    type: '文章',
    submitter: '张三',
    submitTime: '2026-06-08 10:30',
    status: '待审核',
    reviewer: null,
    reviewTime: null
  },
  {
    id: 2,
    title: '少数民族传统手工艺展览活动总结',
    module: '文化传承',
    type: '内容',
    submitter: '李四',
    submitTime: '2026-06-08 09:15',
    status: '待审核',
    reviewer: null,
    reviewTime: null
  },
  {
    id: 3,
    title: '王华同志先进事迹材料',
    module: '典型引领',
    type: '先进个人',
    submitter: '王五',
    submitTime: '2026-06-08 08:45',
    status: '待审核',
    reviewer: null,
    reviewTime: null
  },
  {
    id: 4,
    title: '校园民族团结主题班会活动',
    module: '实践育人',
    type: '校园实践',
    submitter: '赵六',
    submitTime: '2026-06-07 16:20',
    status: '待审核',
    reviewer: null,
    reviewTime: null
  },
  {
    id: 5,
    title: '民族文化学习读本PDF资源',
    module: '资源中心',
    type: '专题资源',
    submitter: '钱七',
    submitTime: '2026-06-07 14:35',
    status: '待审核',
    reviewer: null,
    reviewTime: null
  },
  {
    id: 6,
    title: '中央民族工作会议精神解读',
    module: '时政要闻',
    type: '文章',
    submitter: '张三',
    submitTime: '2026-06-07 10:20',
    status: '已通过',
    reviewer: '审核员A',
    reviewTime: '2026-06-07 11:30'
  },
  {
    id: 7,
    title: '某集体申报材料',
    module: '典型引领',
    type: '先进集体',
    submitter: '李四',
    submitTime: '2026-06-06 15:40',
    status: '已驳回',
    reviewer: '审核员B',
    reviewTime: '2026-06-06 16:50'
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('审核')
const currentRow = ref(null)
const auditForm = reactive({ result: '通过', comment: '' })

const getModuleTagType = (module) => {
  const typeMap = {
    '时政要闻': '',
    '文化传承': 'success',
    '典型引领': 'warning',
    '实践育人': 'danger',
    '资源中心': 'info'
  }
  return typeMap[module] || ''
}

const getStatusType = (status) => {
  const typeMap = {
    '待审核': 'warning',
    '已通过': 'success',
    '已驳回': 'danger'
  }
  return typeMap[status] || 'info'
}

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = [...tableData.value]
    if (searchForm.module) {
      filtered = filtered.filter(item => item.module === searchForm.module)
    }
    if (activeTab.value) {
      filtered = filtered.filter(item => item.status === activeTab.value)
    }
    if (searchForm.keyword) {
      filtered = filtered.filter(item => item.title.includes(searchForm.keyword))
    }
    pagination.total = filtered.length
    loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => {
  searchForm.module = ''
  searchForm.status = ''
  searchForm.dateRange = null
  searchForm.keyword = ''
  pagination.page = 1
  fetchData()
}
const handleTabChange = () => { pagination.page = 1; fetchData() }

const handleView = (row) => {
  ElMessage.info(`查看内容：${row.title}`)
}

const handleApprove = (row) => {
  currentRow.value = row
  dialogTitle.value = '审核通过'
  auditForm.result = '通过'
  auditForm.comment = ''
  dialogVisible.value = true
}

const handleReject = (row) => {
  currentRow.value = row
  dialogTitle.value = '审核驳回'
  auditForm.result = '驳回'
  auditForm.comment = ''
  dialogVisible.value = true
}

const handleSubmitAudit = () => {
  if (auditForm.result === '驳回' && !auditForm.comment.trim()) {
    ElMessage.warning('驳回时必须填写驳回原因')
    return
  }

  const statusText = auditForm.result === '通过' ? '已通过' : '已驳回'
  currentRow.value.status = statusText
  currentRow.value.reviewer = '当前审核员'
  currentRow.value.reviewTime = new Date().toLocaleString('zh-CN')

  ElMessage.success(`审核${auditForm.result}`)
  dialogVisible.value = false

  // 更新统计数据
  stats.value[0].value -= 1
  stats.value[1].value += 1
  if (auditForm.result === '通过') {
    stats.value[2].value += 1
  } else {
    stats.value[3].value += 1
  }

  fetchData()
}

onMounted(() => { fetchData() })
</script>

<style lang="scss" scoped>
.audit-container {
  .search-card, .table-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      border-radius: 8px;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-3px);
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 15px;

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .stat-info {
          .stat-value {
            font-size: 26px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 5px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      &.stat-pending .stat-icon {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      &.stat-today .stat-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.stat-pass .stat-icon {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      &.stat-reject .stat-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}
</style>
