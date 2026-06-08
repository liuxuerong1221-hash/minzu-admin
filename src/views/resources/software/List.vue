<template>
  <div class="resource-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="软件分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="办公软件" value="办公软件" />
            <el-option label="学习工具" value="学习工具" />
            <el-option label="多媒体" value="多媒体" />
            <el-option label="系统工具" value="系统工具" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" clearable style="width: 130px;">
            <el-option label="全部" value="" />
            <el-option label="Windows" value="Windows" />
            <el-option label="macOS" value="macOS" />
            <el-option label="Android" value="Android" />
            <el-option label="iOS" value="iOS" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入软件名称" clearable style="width: 200px;" />
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

    <!-- 操作栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon><span>新建软件资源</span>
        </el-button>
      </div>
    </el-card>

    <!-- 列表 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="图标" width="70">
          <template #default="{ row }">
            <el-avatar :size="44" shape="square" :src="row.icon">
              <el-icon><Monitor /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="软件名称" min-width="180" />
        <el-table-column prop="version" label="版本" width="100" align="center" />
        <el-table-column prop="category" label="分类" width="110">
          <template #default="{ row }"><el-tag>{{ row.category }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="platform" label="平台" width="100" align="center">
          <template #default="{ row }"><el-tag type="info">{{ row.platform }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="fileSize" label="大小" width="100" align="center" />
        <el-table-column prop="downloads" label="下载量" width="100" align="center">
          <template #default="{ row }"><el-tag type="warning">{{ row.downloads }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="isRecommend" label="推荐" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isRecommend" @change="handleRecommendChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon><span>查看</span></el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon><span>编辑</span></el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon><span>删除</span></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData" @current-change="fetchData" />
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
const searchForm = reactive({ category: '', platform: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const tableData = ref([
  { id: 1, title: '民族语言学习助手', version: 'v2.3.1', category: '学习工具', platform: 'Windows', fileSize: '85MB', downloads: 1245, icon: '', isRecommend: true },
  { id: 2, title: '民族文化展示播放器', version: 'v1.5.0', category: '多媒体', platform: 'Android', fileSize: '32MB', downloads: 678, icon: '', isRecommend: false },
  { id: 3, title: '双语办公套件', version: 'v3.0.2', category: '办公软件', platform: 'macOS', fileSize: '156MB', downloads: 923, icon: '', isRecommend: true }
])

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = tableData.value.length
    loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => { searchForm.category = ''; searchForm.platform = ''; searchForm.keyword = ''; pagination.page = 1; fetchData() }
const handleCreate = () => { router.push('/resources/software/create') }
const handleEdit = (row) => { router.push(`/resources/software/edit/${row.id}`) }
const handleView = (row) => { router.push(`/resources/software/detail/${row.id}`) }
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该软件资源吗？', '提示', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); fetchData() })
}
const handleRecommendChange = (row) => { ElMessage.success(row.isRecommend ? '已推荐' : '已取消推荐') }

onMounted(() => { fetchData() })
</script>

<style lang="scss" scoped>
.resource-list-container {
  .search-card, .toolbar-card, .table-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }
  .toolbar { display: flex; align-items: center; }
  .pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
}
</style>
