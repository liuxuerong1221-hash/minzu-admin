<template>
  <div class="social-practice-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="实践类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="社区服务" value="社区服务" />
            <el-option label="企业实习" value="企业实习" />
            <el-option label="支教实践" value="支教实践" />
            <el-option label="调研考察" value="调研考察" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入标题或地点"
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
        </div>
        <div class="toolbar-right">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="table">
              <el-icon><List /></el-icon>
            </el-radio-button>
            <el-radio-button label="card">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </el-card>

    <!-- 列表视图 -->
    <el-card v-if="viewMode === 'table'" class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="type" label="实践类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="实践时间" width="180" />
        <el-table-column prop="location" label="实践地点" width="150" />
        <el-table-column prop="participants" label="参与人数" width="100" align="center" />
        <el-table-column prop="views" label="浏览量" width="100" align="center" />
        <el-table-column prop="isRecommend" label="推荐" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isRecommend" @change="handleRecommendChange(row)" />
          </template>
        </el-table-column>
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

    <!-- 卡片视图 -->
    <div v-else class="card-view">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8" :xl="6" v-for="item in tableData" :key="item.id">
          <el-card class="practice-card" shadow="hover">
            <div class="card-cover" :style="{ backgroundImage: `url(${item.cover})` }">
              <el-tag v-if="item.isRecommend" class="recommend-tag" type="danger" size="small">推荐</el-tag>
            </div>
            <div class="card-content">
              <h3 class="practice-title">{{ item.title }}</h3>
              <div class="practice-meta">
                <el-tag size="small">{{ item.type }}</el-tag>
                <span class="meta-item"><el-icon><Calendar /></el-icon> {{ item.time }}</span>
                <span class="meta-item"><el-icon><Location /></el-icon> {{ item.location }}</span>
                <span class="meta-item"><el-icon><User /></el-icon> {{ item.participants }}人</span>
              </div>
              <div class="card-footer">
                <span><el-icon><View /></el-icon> {{ item.views }}</span>
                <div>
                  <el-button size="small" @click="handleView(item)">查看</el-button>
                  <el-button size="small" type="primary" @click="handleEdit(item)">编辑</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[12, 24, 48, 96]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const viewMode = ref('table')

const searchForm = reactive({
  type: '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 模拟数据
const tableData = ref([
  {
    id: 1,
    title: '民族团结主题演讲比赛',
    type: '企业实习',
    time: '2024-03-15',
    location: '学校礼堂',
    participants: 150,
    views: 523,
    cover: '',
    isRecommend: true
  },
  {
    id: 2,
    title: '少数民族文化知识讲座',
    type: '社区服务',
    time: '2024-03-20',
    location: '图书馆报告厅',
    participants: 200,
    views: 678,
    cover: '',
    isRecommend: false
  }
])

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = tableData.value.length
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.keyword = ''
  pagination.page = 1
  fetchData()
}

const handleCreate = () => {
  router.push('/practice/social/create')
}

const handleEdit = (row) => {
  router.push(`/practice/social/edit/${row.id}`)
}

const handleView = (row) => {
  router.push(`/practice/social/detail/${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该实践吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleRecommendChange = (row) => {
  ElMessage.success(row.isRecommend ? '已推荐' : '已取消推荐')
}

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

<style lang="scss" scoped>
.social-practice-list-container {
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

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .card-view {
    .practice-card {
      margin-bottom: 20px;
      border-radius: 12px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .card-cover {
        height: 160px;
        background-size: cover;
        background-position: center;
        background-color: #f0f2f5;
        border-radius: 8px 8px 0 0;
        position: relative;

        .recommend-tag {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }

      .card-content {
        padding: 15px;

        .practice-title {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .practice-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
          color: #606266;
          margin-bottom: 15px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #ebeef5;

          span {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>
