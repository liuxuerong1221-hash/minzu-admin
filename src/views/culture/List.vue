<template>
  <div class="culture-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="类别">
          <el-select v-model="searchForm.category" placeholder="请选择类别" clearable style="width: 160px;">
            <el-option label="全部" value="" />
            <el-option
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="草稿" value="draft" />
            <el-option label="待审核" value="pending" />
            <el-option label="已发布" value="published" />
            <el-option label="已下线" value="offline" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入标题" clearable style="width: 200px;" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon>
            <span>重置</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 操作栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            <span>新建</span>
          </el-button>
          <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0">
            <el-icon><Delete /></el-icon>
            <span>批量删除</span>
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 内容列表 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" />

        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 70px; height: 50px; border-radius: 4px;"
            />
            <div v-else class="no-cover">暂无封面</div>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />

        <el-table-column prop="category" label="类别" width="140">
          <template #default="{ row }">
            <el-tag effect="plain">{{ row.category }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="资源" width="140">
          <template #default="{ row }">
            <div class="media-stats">
              <span class="media-stat media-stat-image">
                <el-icon :size="16"><Picture /></el-icon>
                <span class="media-count">{{ row.imageCount }}</span>
              </span>
              <span class="media-stat media-stat-video">
                <el-icon :size="16"><VideoCamera /></el-icon>
                <span class="media-count">{{ row.videoCount }}</span>
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="views" label="浏览量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.views }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isRecommend" label="推荐" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isRecommend" @change="handleRecommendChange(row)" />
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="更新时间" width="170" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              <span>查看</span>
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              <span>编辑</span>
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              <span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const selectedIds = ref([])

// 文化类别（与首页文化传承板块对应）
const categories = [
  { label: '塞外长城驿站', value: '塞外长城驿站' },
  { label: '传统戏曲艺术', value: '传统戏曲艺术' },
  { label: '经典古籍', value: '经典古籍' },
  { label: '汉字书法', value: '汉字书法' },
  { label: '民族节日', value: '民族节日' },
  { label: '民族服饰', value: '民族服饰' },
  { label: '民族音乐舞蹈', value: '民族音乐舞蹈' },
  { label: '传统技艺', value: '传统技艺' }
]

const searchForm = reactive({
  category: '',
  status: '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const tableData = ref([])

// 模拟数据
const mockData = [
  {
    id: 1,
    title: '塞外长城驿站——历史的见证',
    category: '塞外长城驿站',
    cover: '',
    imageCount: 12,
    videoCount: 1,
    views: 1845,
    status: 'published',
    isRecommend: true,
    updateTime: '2026-06-01 10:30:00'
  },
  {
    id: 2,
    title: '传统戏曲艺术的传承与创新',
    category: '传统戏曲艺术',
    cover: '',
    imageCount: 8,
    videoCount: 3,
    views: 1320,
    status: 'published',
    isRecommend: true,
    updateTime: '2026-06-02 14:20:00'
  },
  {
    id: 3,
    title: '经典古籍中的民族团结智慧',
    category: '经典古籍',
    cover: '',
    imageCount: 15,
    videoCount: 0,
    views: 986,
    status: 'pending',
    isRecommend: false,
    updateTime: '2026-06-03 09:15:00'
  },
  {
    id: 4,
    title: '汉字书法之美',
    category: '汉字书法',
    cover: '',
    imageCount: 20,
    videoCount: 1,
    views: 1567,
    status: 'published',
    isRecommend: true,
    updateTime: '2026-06-04 16:40:00'
  },
  {
    id: 5,
    title: '傣族泼水节——欢乐的民族盛会',
    category: '民族节日',
    cover: '',
    imageCount: 18,
    videoCount: 2,
    views: 2103,
    status: 'draft',
    isRecommend: false,
    updateTime: '2026-06-05 11:00:00'
  }
]

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = [...mockData]
    if (searchForm.category) {
      filtered = filtered.filter(item => item.category === searchForm.category)
    }
    if (searchForm.status) {
      filtered = filtered.filter(item => item.status === searchForm.status)
    }
    if (searchForm.keyword) {
      filtered = filtered.filter(item => item.title.includes(searchForm.keyword))
    }
    tableData.value = filtered
    pagination.total = filtered.length
    loading.value = false
  }, 400)
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.category = ''
  searchForm.status = ''
  searchForm.keyword = ''
  pagination.page = 1
  fetchData()
}

const handleRefresh = () => {
  fetchData()
  ElMessage.success('刷新成功')
}

const handleCreate = () => {
  router.push('/culture/create')
}

const handleView = (row) => {
  router.push(`/culture/detail/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/culture/edit/${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该内容吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条内容吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  }).catch(() => {})
}

const handleRecommendChange = (row) => {
  ElMessage.success(row.isRecommend ? '已推荐' : '已取消推荐')
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleSizeChange = () => {
  fetchData()
}

const handleCurrentChange = () => {
  fetchData()
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
.culture-list-container {
  .search-card,
  .toolbar-card,
  .table-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .no-cover {
    width: 70px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    color: #999;
  }

  .media-stats {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .media-stat {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;

    .media-count {
      font-weight: 600;
      font-size: 15px;
    }
  }

  .media-stat-image {
    color: #409EFF;
  }

  .media-stat-video {
    color: #F56C6C;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>


