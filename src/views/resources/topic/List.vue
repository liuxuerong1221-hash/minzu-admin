<template>
  <div class="resource-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="上架" value="上架" />
            <el-option label="下架" value="下架" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入资源链接或详情" clearable style="width: 250px;" />
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
          <el-icon><Plus /></el-icon><span>新建专题资源</span>
        </el-button>
      </div>
    </el-card>

    <!-- 列表 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="link" label="专题资源链接" min-width="280">
          <template #default="{ row }">
            <el-link :href="row.link" target="_blank" type="primary">{{ row.link }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="资源详情" min-width="300" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '上架' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon><span>查看</span>
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon><span>编辑</span>
            </el-button>
            <el-button
              link
              :type="row.status === '上架' ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              <el-icon><Switch /></el-icon>
              <span>{{ row.status === '上架' ? '下架' : '上架' }}</span>
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon><span>删除</span>
            </el-button>
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
const searchForm = reactive({ status: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const tableData = ref([
  {
    id: 1,
    link: 'https://example.com/topic/minzu-unity',
    description: '铸牢中华民族共同体意识学习读本PDF版本，包含理论阐述、典型案例和实践指南',
    status: '上架',
    createTime: '2026-05-10 14:30'
  },
  {
    id: 2,
    link: 'https://example.com/video/culture-heritage',
    description: '民族文化传承系列视频合集，涵盖各民族传统艺术、节日习俗等内容',
    status: '上架',
    createTime: '2026-05-08 10:15'
  },
  {
    id: 3,
    link: 'https://example.com/policy/latest-2026',
    description: '2026年中央民族工作会议精神解读材料，政策文件汇编',
    status: '下架',
    createTime: '2026-04-28 16:20'
  }
])

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = [...tableData.value]
    if (searchForm.status) {
      filtered = filtered.filter(item => item.status === searchForm.status)
    }
    if (searchForm.keyword) {
      filtered = filtered.filter(item =>
        item.link.includes(searchForm.keyword) || item.description.includes(searchForm.keyword)
      )
    }
    pagination.total = filtered.length
    loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => { searchForm.status = ''; searchForm.keyword = ''; pagination.page = 1; fetchData() }
const handleCreate = () => { router.push('/resources/topic/create') }
const handleEdit = (row) => { router.push(`/resources/topic/edit/${row.id}`) }
const handleView = (row) => { router.push(`/resources/topic/detail/${row.id}`) }

const handleToggleStatus = (row) => {
  const newStatus = row.status === '上架' ? '下架' : '上架'
  ElMessageBox.confirm(`确定要将该资源${newStatus}吗？`, '提示', { type: 'warning' })
    .then(() => {
      row.status = newStatus
      ElMessage.success(`已${newStatus}`)
    })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该专题资源吗？', '提示', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); fetchData() })
}

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
