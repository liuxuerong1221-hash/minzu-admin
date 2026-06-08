<template>
  <div class="person-list-container">
    <!-- 类别标签切换 -->
    <el-card class="category-tabs" shadow="never">
      <el-radio-group v-model="activeCategory" size="large" @change="handleCategoryChange">
        <el-radio-button label="先进个人">先进个人</el-radio-button>
        <el-radio-button label="先进集体">先进集体</el-radio-button>
      </el-radio-group>
    </el-card>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>

        <el-form-item label="荣誉级别">
          <el-select v-model="searchForm.honorLevel" placeholder="请选择级别" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="国家级" value="national" />
            <el-option label="省级" value="provincial" />
            <el-option label="市级" value="city" />
          </el-select>
        </el-form-item>

        <el-form-item label="民族">
          <el-select v-model="searchForm.ethnicity" placeholder="请选择民族" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="汉族" value="汉族" />
            <el-option label="蒙古族" value="蒙古族" />
            <el-option label="回族" value="回族" />
            <el-option label="藏族" value="藏族" />
            <el-option label="维吾尔族" value="维吾尔族" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入姓名或单位"
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
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            <span>导出名册</span>
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
        <el-table-column label="头像/标识" width="80">
          <template #default="{ row }">
            <el-avatar :size="50" :src="row.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>

        <!-- 先进个人列 -->
        <el-table-column v-if="activeCategory !== '先进集体'" prop="name" label="姓名" width="120" />

        <el-table-column v-if="activeCategory !== '先进集体'" label="基本信息" min-width="200">
          <template #default="{ row }">
            <div class="info-cell">
              <div>{{ row.gender }} · {{ row.ethnicity }} · {{ row.age }}岁</div>
              <div class="info-sub">{{ row.workUnit }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 先进集体列 -->
        <el-table-column v-if="activeCategory === '先进集体'" prop="name" label="集体名称" width="200" />

        <el-table-column v-if="activeCategory === '先进集体'" label="集体信息" min-width="250">
          <template #default="{ row }">
            <div class="info-cell">
              <div>{{ row.workUnit || '单位名称' }}</div>
              <div class="info-sub">{{ row.briefIntro || '集体简介' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="类别" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.category }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="荣誉称号" width="180">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.honorTitle }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="views" label="浏览量" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.views }}</el-tag>
          </template>
        </el-table-column>

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
          <el-card class="person-card" shadow="hover">
            <div class="card-content">
              <div class="card-header">
                <el-avatar :size="80" :src="item.avatar">
                  <el-icon :size="40"><User /></el-icon>
                </el-avatar>
                <el-tag v-if="item.isRecommend" class="recommend-tag" type="danger" size="small">推荐</el-tag>
              </div>

              <div class="card-body">
                <h3 class="person-name">{{ item.name }}</h3>

                <!-- 先进个人信息 -->
                <p v-if="activeCategory !== '先进集体'" class="person-info">
                  {{ item.gender }} · {{ item.ethnicity }} · {{ item.age }}岁
                </p>

                <!-- 先进集体信息 -->
                <p v-if="activeCategory === '先进集体'" class="person-info">
                  {{ item.workUnit || '单位名称' }}
                </p>
                <p v-if="activeCategory === '先进集体'" class="person-brief">
                  {{ item.briefIntro || '集体简介' }}
                </p>
                <p class="person-unit">{{ item.workUnit }}</p>
                <el-divider />
                <div class="person-honor">
                  <el-tag type="danger" effect="plain">{{ item.honorTitle }}</el-tag>
                </div>
                <div class="person-stats">
                  <span><el-icon><View /></el-icon> {{ item.views }}</span>
                  <el-tag size="small">{{ item.category }}</el-tag>
                </div>
              </div>

              <div class="card-footer">
                <el-button size="small" @click="handleView(item)">查看</el-button>
                <el-button size="small" type="primary" @click="handleEdit(item)">编辑</el-button>
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
const activeCategory = ref('先进个人')

const searchForm = reactive({
  honorLevel: '',
  ethnicity: '',
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
    name: '张伟',
    gender: '男',
    ethnicity: '汉族',
    age: 45,
    workUnit: 'XX大学',
    position: '教授',
    category: '先进个人',
    honorTitle: '全国劳动模范',
    honorLevel: 'national',
    avatar: '',
    views: 1234,
    isRecommend: true
  },
  {
    id: 2,
    name: '李娜',
    gender: '女',
    ethnicity: '蒙古族',
    age: 38,
    workUnit: 'XX研究所',
    position: '研究员',
    category: '先进个人',
    honorTitle: '省级劳动模范',
    honorLevel: 'provincial',
    avatar: '',
    views: 987,
    isRecommend: true
  },
  {
    id: 3,
    name: 'XX小学民族团结教育团队',
    gender: '',
    ethnicity: '',
    age: '',
    workUnit: 'XX市XX小学',
    position: '',
    category: '先进集体',
    briefIntro: '深耕民族团结教育20年，形成"三融合"教育模式，被评为全国民族团结进步示范学校',
    honorTitle: '全国民族团结进步模范集体',
    honorLevel: 'national',
    avatar: '',
    views: 1456,
    isRecommend: true
  },
  {
    id: 4,
    name: '王强',
    gender: '男',
    ethnicity: '回族',
    age: 42,
    workUnit: 'XX企业',
    position: '总工程师',
    category: '道德模范',
    honorTitle: '市级道德模范',
    honorLevel: 'city',
    avatar: '',
    views: 856,
    isRecommend: false
  },
  {
    id: 5,
    name: 'XX社区民族工作站',
    gender: '',
    ethnicity: '',
    age: '',
    workUnit: 'XX社区',
    position: '',
    category: '先进集体',
    honorTitle: '省级民族团结进步示范单位',
    honorLevel: 'provincial',
    avatar: '',
    views: 1123,
    isRecommend: true
  }
])

// 类别切换
const handleCategoryChange = () => {
  pagination.page = 1
  fetchData()
}

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    // 根据activeCategory过滤数据
    let filteredData = [...mockData]
    if (activeCategory.value) {
      filteredData = filteredData.filter(item => item.category === activeCategory.value)
    }
    tableData.value = filteredData
    pagination.total = filteredData.length
    loading.value = false
  }, 500)
}

// 原始模拟数据
const mockData = [
  {
    id: 1,
    name: '张伟',
    gender: '男',
    ethnicity: '汉族',
    age: 45,
    workUnit: 'XX大学',
    position: '教授',
    category: '先进个人',
    honorTitle: '全国劳动模范',
    honorLevel: 'national',
    avatar: '',
    views: 1234,
    isRecommend: true
  },
  {
    id: 2,
    name: '李娜',
    gender: '女',
    ethnicity: '蒙古族',
    age: 38,
    workUnit: 'XX研究所',
    position: '研究员',
    category: '先进个人',
    honorTitle: '省级劳动模范',
    honorLevel: 'provincial',
    avatar: '',
    views: 987,
    isRecommend: true
  },
  {
    id: 3,
    name: 'XX小学民族团结教育团队',
    gender: '',
    ethnicity: '',
    age: '',
    workUnit: 'XX市XX小学',
    position: '',
    category: '先进集体',
    briefIntro: '深耕民族团结教育20年，形成"三融合"教育模式，被评为全国民族团结进步示范学校',
    honorTitle: '全国民族团结进步模范集体',
    honorLevel: 'national',
    avatar: '',
    views: 1456,
    isRecommend: true
  },
  {
    id: 4,
    name: '王强',
    gender: '男',
    ethnicity: '回族',
    age: 42,
    workUnit: 'XX企业',
    position: '总工程师',
    category: '先进个人',
    honorTitle: '全国优秀共产党员',
    honorLevel: 'national',
    avatar: '',
    views: 856,
    isRecommend: false
  },
  {
    id: 5,
    name: 'XX社区民族工作站',
    gender: '',
    ethnicity: '',
    age: '',
    workUnit: 'XX街道XX社区',
    position: '',
    category: '先进集体',
    briefIntro: '创新"多元共融"社区治理模式，服务各族群众1.2万余人，连续5年零矛盾纠纷',
    honorTitle: '省级民族团结进步示范单位',
    honorLevel: 'provincial',
    avatar: '',
    views: 1123,
    isRecommend: true
  }
]

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  activeCategory.value = '先进个人'
  searchForm.honorLevel = ''
  searchForm.ethnicity = ''
  searchForm.keyword = ''
  pagination.page = 1
  fetchData()
}

const handleCreate = () => {
  router.push('/persons/create')
}

const handleEdit = (row) => {
  router.push(`/persons/edit/${row.id}`)
}

const handleView = (row) => {
  router.push(`/persons/detail/${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该人物档案吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleExport = () => {
  ElMessage.success('导出成功')
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
.person-list-container {
  .category-tabs {
    margin-bottom: 20px;
    border-radius: 8px;

    :deep(.el-radio-button__inner) {
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
    }

    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      background-color: #A70101;
      border-color: #A70101;
    }
  }

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

  .info-cell {
    .info-sub {
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .card-view {
    .person-card {
      margin-bottom: 20px;
      border-radius: 12px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .card-content {
        .card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          margin-bottom: 15px;

          .recommend-tag {
            position: absolute;
            top: 0;
            right: 0;
          }
        }

        .card-body {
          text-align: center;

          .person-name {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0 5px;
            color: #303133;
          }

          .person-info {
            font-size: 13px;
            color: #909399;
            margin: 5px 0;
          }

          .person-unit {
            font-size: 14px;
            color: #606266;
            margin: 5px 0;
          }

          .person-honor {
            margin: 10px 0;
          }

          .person-stats {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            color: #909399;

            span {
              display: flex;
              align-items: center;
              gap: 5px;
            }
          }
        }

        .card-footer {
          display: flex;
          gap: 10px;
          margin-top: 15px;

          .el-button {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
