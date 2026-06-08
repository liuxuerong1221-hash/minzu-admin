<template>
  <div class="categories-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">分类管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>新建</span>
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="分类名称" width="200" />
        <el-table-column prop="code" label="分类代码" width="150" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="100" align="center" />
        <el-table-column prop="articleCount" label="文章数" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.articleCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.isActive" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类代码（英文）" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref(null)
const editId = ref(null)

const form = reactive({
  name: '',
  code: '',
  description: '',
  sortOrder: 100,
  isActive: true
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入分类代码', trigger: 'blur' }]
}

const tableData = ref([
  { id: 1, name: '焦点话题', code: 'focus', description: '重要焦点话题', sortOrder: 1, articleCount: 156, isActive: true },
  { id: 2, name: '时政新闻', code: 'news', description: '时事政治新闻', sortOrder: 2, articleCount: 234, isActive: true },
  { id: 3, name: '政策解读', code: 'policy', description: '政策文件解读', sortOrder: 3, articleCount: 89, isActive: true }
])

const dialogTitle = computed(() => editId.value ? '编辑分类' : '新建分类')

const handleAdd = () => {
  editId.value = null
  Object.assign(form, {
    name: '',
    code: '',
    description: '',
    sortOrder: 100,
    isActive: true
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSave = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(editId.value ? '编辑成功' : '新建成功')
      dialogVisible.value = false
    }
  })
}

const handleDelete = (row) => {
  if (row.articleCount > 0) {
    ElMessage.warning('该分类下还有文章，无法删除')
    return
  }
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleStatusChange = (row) => {
  ElMessage.success(row.isActive ? '已启用' : '已禁用')
}
</script>

<style lang="scss" scoped>
.categories-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-title {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
