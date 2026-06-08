<template>
  <div class="person-list-container">
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

        <el-form-item v-if="!isGroup" label="民族">
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
            :placeholder="isGroup ? '请输入集体名称' : '请输入姓名或单位'"
            clearable
            style="width: 200px;"
          />
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
        <div class="toolbar-left">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            <span>{{ isGroup ? '新建集体' : '新建人物' }}</span>
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon><span>导出名册</span>
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 先进个人表格 -->
    <el-card v-if="!isGroup" class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="50" :src="row.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column label="基本信息" min-width="200">
          <template #default="{ row }">
            <div class="info-cell">
              <div>{{ row.gender }} · {{ row.ethnicity }} · {{ row.age }}岁</div>
              <div class="info-sub">{{ row.workUnit }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="荣誉称号" width="200">
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

    <!-- 先进集体表格 -->
    <el-card v-else class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="标识" width="80">
          <template #default>
            <el-avatar :size="50"><el-icon><OfficeBuilding /></el-icon></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="集体名称" width="220" />
        <el-table-column prop="workUnit" label="所属单位" width="160" />
        <el-table-column label="集体简介" min-width="250" show-overflow-tooltip>
          <template #default="{ row }">{{ row.briefIntro || '-' }}</template>
        </el-table-column>
        <el-table-column label="荣誉称号" width="220">
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 根据路由路径判断当前类别
const isGroup = computed(() => route.path.includes('/persons/group'))
const currentCategory = computed(() => isGroup.value ? '先进集体' : '先进个人')

const searchForm = reactive({ honorLevel: '', ethnicity: '', keyword: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })
const tableData = ref([])

const mockData = [
  { id: 1, name: '张伟', gender: '男', ethnicity: '汉族', age: 45, workUnit: 'XX大学', category: '先进个人', honorTitle: '全国劳动模范', honorLevel: 'national', avatar: '', views: 1234, isRecommend: true },
  { id: 2, name: '李娜', gender: '女', ethnicity: '蒙古族', age: 38, workUnit: 'XX研究所', category: '先进个人', honorTitle: '省级劳动模范', honorLevel: 'provincial', avatar: '', views: 987, isRecommend: true },
  { id: 4, name: '王强', gender: '男', ethnicity: '回族', age: 42, workUnit: 'XX企业', category: '先进个人', honorTitle: '全国优秀共产党员', honorLevel: 'national', avatar: '', views: 856, isRecommend: false },
  { id: 3, name: 'XX小学民族团结教育团队', workUnit: 'XX市XX小学', category: '先进集体', briefIntro: '深耕民族团结教育20年，形成"三融合"教育模式', honorTitle: '全国民族团结进步模范集体', honorLevel: 'national', avatar: '', views: 1456, isRecommend: true },
  { id: 5, name: 'XX社区民族工作站', workUnit: 'XX街道XX社区', category: '先进集体', briefIntro: '创新"多元共融"社区治理模式，服务各族群众1.2万余人', honorTitle: '省级民族团结进步示范单位', honorLevel: 'provincial', avatar: '', views: 1123, isRecommend: true }
]

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    let filtered = mockData.filter(item => item.category === currentCategory.value)
    if (searchForm.honorLevel) filtered = filtered.filter(item => item.honorLevel === searchForm.honorLevel)
    if (searchForm.ethnicity) filtered = filtered.filter(item => item.ethnicity === searchForm.ethnicity)
    if (searchForm.keyword) filtered = filtered.filter(item => item.name.includes(searchForm.keyword) || (item.workUnit || '').includes(searchForm.keyword))
    tableData.value = filtered
    pagination.total = filtered.length
    loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => { searchForm.honorLevel = ''; searchForm.ethnicity = ''; searchForm.keyword = ''; pagination.page = 1; fetchData() }

const handleCreate = () => {
  const type = isGroup.value ? 'group' : 'person'
  router.push(`/persons/create?type=${type}`)
}

const handleEdit = (row) => {
  const type = isGroup.value ? 'group' : 'person'
  router.push(`/persons/edit/${row.id}?type=${type}`)
}

const handleView = (row) => { router.push(`/persons/detail/${row.id}`) }

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除${isGroup.value ? '该集体' : '该人物'}吗？`, '提示', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); fetchData() })
}

const handleExport = () => { ElMessage.success('导出成功') }
const handleRecommendChange = (row) => { ElMessage.success(row.isRecommend ? '已推荐' : '已取消推荐') }

// 路由变化时重新加载数据
watch(() => route.path, () => { handleReset() })

onMounted(() => { fetchData() })
</script>

<style lang="scss" scoped>
.person-list-container {
  .search-card, .toolbar-card, .table-card {
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
}
</style>
