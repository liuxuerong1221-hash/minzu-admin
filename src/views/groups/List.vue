<template>
  <div class="group-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="荣誉级别">
          <el-select v-model="searchForm.level" placeholder="请选择级别" clearable style="width: 200px;">
            <el-option label="国家级" value="national" />
            <el-option label="省级" value="provincial" />
            <el-option label="市级" value="municipal" />
            <el-option label="县级" value="county" />
          </el-select>
        </el-form-item>
        <el-form-item label="民族">
          <el-select v-model="searchForm.ethnicity" placeholder="请选择民族" clearable style="width: 200px;">
            <el-option label="汉族" value="汉族" />
            <el-option label="回族" value="回族" />
            <el-option label="维吾尔族" value="维吾尔族" />
            <el-option label="壮族" value="壮族" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入名称或单位" clearable style="width: 300px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleCreate">新建</el-button>
        <el-button plain :icon="Download" @click="handleExport">导出名册</el-button>

        <div class="view-switcher">
          <el-button-group>
            <el-button :type="viewMode === 'card' ? 'primary' : ''" :icon="Grid" @click="viewMode = 'card'" />
            <el-button :type="viewMode === 'table' ? 'primary' : ''" :icon="List" @click="viewMode = 'table'" />
          </el-button-group>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'card'" class="card-view">
        <el-row :gutter="20">
          <el-col v-for="item in tableData" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6">
            <div class="group-card">
              <div class="card-header">
                <el-avatar :size="80" :src="item.logo" :icon="OfficeBuilding" />
              </div>
              <div class="card-body">
                <h3 class="group-name">{{ item.name }}</h3>
                <p class="group-info">{{ item.info }}</p>
                <div class="group-tags">
                  <el-tag size="small" type="success">{{ item.levelText }}</el-tag>
                  <el-tag size="small">{{ item.honorText }}</el-tag>
                </div>
                <div class="group-stats">
                  <span><el-icon><View /></el-icon> {{ item.views }}</span>
                </div>
              </div>
              <div class="card-footer">
                <el-switch v-model="item.isRecommend" />
                <div class="actions">
                  <el-button link type="primary" size="small" @click="handleView(item)">
                    <el-icon><View /></el-icon>
                  </el-button>
                  <el-button link type="primary" size="small" @click="handleEdit(item)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button link type="danger" size="small" @click="handleDelete(item)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 表格视图 -->
      <el-table v-else v-loading="loading" :data="tableData" stripe style="width: 100%">
        <el-table-column label="头像/标识" width="100" align="center">
          <template #default="{ row }">
            <el-avatar :size="60" :src="row.logo" :icon="OfficeBuilding" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="集体名称" min-width="180" />
        <el-table-column prop="info" label="集体信息" min-width="250" show-overflow-tooltip />
        <el-table-column label="类别" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="primary">{{ row.levelText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="honorText" label="荣誉称号" width="150" />
        <el-table-column prop="views" label="浏览量" width="100" align="center">
          <template #default="{ row }">
            <span style="color: #f56c6c;">{{ row.views }}</span>
          </template>
        </el-table-column>
        <el-table-column label="推荐" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isRecommend" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
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
          :page-sizes="[10, 20, 50]"
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
import { Search, RefreshRight, Plus, Download, Grid, List, View, Edit, Delete, OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const viewMode = ref('card')

// 搜索表单
const searchForm = reactive({
  level: '',
  ethnicity: '',
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
    name: 'XX小学民族团结教育团队',
    info: 'XX市民族小学，深耕三重合育教模式，被评为全国民族团结进步示范学校',
    logo: '',
    level: 'national',
    levelText: '先进集体',
    honor: 'national_unity',
    honorText: '全国民族团结进步示范集体',
    views: 1456,
    isRecommend: true
  },
  {
    id: 2,
    name: 'XX社区民族工作站',
    info: '创新"五共五帮"社区治理模式，服务各族群众1.2万余人，连续5年零矛盾纠纷',
    logo: '',
    level: 'municipal',
    levelText: '先进集体',
    honor: 'harmonious_community',
    honorText: '省级民族团结进步示范社区',
    views: 1123,
    isRecommend: true
  }
]

// 获取列表数据
const fetchData = () => {
  loading.value = true

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
  searchForm.level = ''
  searchForm.ethnicity = ''
  searchForm.keyword = ''
  pagination.page = 1
  fetchData()
}

// 新建
const handleCreate = () => {
  router.push('/groups/create')
}

// 查看详情
const handleView = (row) => {
  router.push(`/groups/detail/${row.id}`)
}

// 编辑
const handleEdit = (row) => {
  router.push(`/groups/edit/${row.id}`)
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这个先进集体吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 导出名册
const handleExport = () => {
  ElMessage.success('导出成功')
}

// 分页处理
const handleSizeChange = () => {
  fetchData()
}

const handleCurrentChange = () => {
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.group-list {
  .search-form {
    margin-bottom: 10px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .view-switcher {
    margin-left: auto;
  }

  .card-view {
    margin-top: 20px;

    .group-card {
      background: #fff;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        text-align: center;
        margin-bottom: 12px;
      }

      .card-body {
        .group-name {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .group-info {
          font-size: 13px;
          color: #606266;
          margin: 0 0 10px 0;
          line-height: 1.5;
          min-height: 40px;
        }

        .group-tags {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 10px;
        }

        .group-stats {
          display: flex;
          justify-content: center;
          gap: 15px;
          font-size: 13px;
          color: #909399;

          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;

        .actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
