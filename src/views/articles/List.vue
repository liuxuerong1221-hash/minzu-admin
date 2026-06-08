<template>
  <div class="article-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
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
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入标题或内容"
            clearable
            style="width: 200px;"
          />
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

    <!-- 文章列表 -->
    <el-card class="table-card" shadow="never">
      <el-table
        :data="tableData"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55" />

        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;"
            />
            <div v-else class="no-cover">暂无封面</div>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />

        <el-table-column prop="author" label="作者" width="100" />

        <el-table-column prop="views" label="浏览量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.views }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isTop" label="置顶" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.isTop"
              @change="handleTopChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="publishTime" label="发布时间" width="180" />

        <el-table-column label="操作" width="220" fixed="right">
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

      <!-- 分页 -->
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

// 搜索表单
const searchForm = reactive({
  status: '',
  keyword: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 表格数据
const tableData = ref([])

// 模拟数据
const mockData = [
  {
    id: 1,
    title: '十四届全国人大常委会第二十一次会议在京举行',
    category: '焦点话题',
    author: '张三',
    cover: '',
    views: 2345,
    status: 'published',
    isTop: true,
    publishTime: '2026-06-01 10:30:00'
  },
  {
    id: 2,
    title: '关于深化民族团结进步教育的实施意见',
    category: '政策解读',
    author: '李四',
    cover: '',
    views: 1987,
    status: 'published',
    isTop: false,
    publishTime: '2026-06-02 14:20:00'
  },
  {
    id: 3,
    title: '铸牢中华民族共同体意识专题讲座成功举办',
    category: '时政新闻',
    author: '王五',
    cover: '',
    views: 1654,
    status: 'pending',
    isTop: false,
    publishTime: '2026-06-03 09:15:00'
  },
  {
    id: 4,
    title: '民族地区经济社会发展取得历史性成就',
    category: '焦点话题',
    author: '赵六',
    cover: '',
    views: 1432,
    status: 'published',
    isTop: false,
    publishTime: '2026-06-04 16:40:00'
  },
  {
    id: 5,
    title: '推动新时代党的民族工作高质量发展',
    category: '政策解读',
    author: '张三',
    cover: '',
    views: 1298,
    status: 'draft',
    isTop: false,
    publishTime: ''
  }
]

// 获取列表数据
const fetchData = () => {
  loading.value = true

  // 模拟API请求
  setTimeout(() => {
    tableData.value = mockData
    pagination.total = mockData.length
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.status = ''
  searchForm.keyword = ''
  pagination.page = 1
  fetchData()
}

// 刷新
const handleRefresh = () => {
  fetchData()
  ElMessage.success('刷新成功')
}

// 新建
const handleCreate = () => {
  router.push('/articles/create')
}

// 查看详情
const handleView = (row) => {
  router.push(`/articles/detail/${row.id}`)
}

// 编辑
const handleEdit = (row) => {
  router.push(`/articles/edit/${row.id}`)
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 篇文章吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchData()
  }).catch(() => {})
}

// 置顶切换
const handleTopChange = (row) => {
  ElMessage.success(row.isTop ? '已置顶' : '已取消置顶')
}

// 选择改变
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页大小改变
const handleSizeChange = () => {
  fetchData()
}

// 页码改变
const handleCurrentChange = () => {
  fetchData()
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    draft: 'info',
    pending: 'warning',
    published: 'success',
    offline: 'danger'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    draft: '草稿',
    pending: '待审核',
    published: '已发布',
    offline: '已下线'
  }
  return statusMap[status] || ''
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.article-list-container {
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
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    color: #999;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
