<template>
  <div class="culture-categories-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">文化类别管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            <span>新建</span>
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="类别名称" width="200" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="100" align="center" />
        <el-table-column prop="contentCount" label="内容数" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.contentCount }}</el-tag>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类别名称" />
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
  description: '',
  sortOrder: 100,
  isActive: true
})

const rules = {
  name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }]
}

const tableData = ref([
  { id: 1, name: '塞外长城驿站', description: '长城沿线驿站历史文化', sortOrder: 1, contentCount: 12, isActive: true },
  { id: 2, name: '传统戏曲艺术', description: '各民族传统戏曲剧种', sortOrder: 2, contentCount: 8, isActive: true },
  { id: 3, name: '经典古籍', description: '民族文化经典古籍文献', sortOrder: 3, contentCount: 15, isActive: true },
  { id: 4, name: '汉字书法', description: '汉字书法艺术之美', sortOrder: 4, contentCount: 20, isActive: true },
  { id: 5, name: '民族节日', description: '各民族传统节日庆典', sortOrder: 5, contentCount: 18, isActive: true }
])

const dialogTitle = computed(() => editId.value ? '编辑类别' : '新建类别')

const handleAdd = () => {
  editId.value = null
  Object.assign(form, {
    name: '',
    description: '',
    sortOrder: 100,
    isActive: true
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editId.value = row.id
  Object.assign(form, {
    name: row.name,
    description: row.description,
    sortOrder: row.sortOrder,
    isActive: row.isActive
  })
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
  if (row.contentCount > 0) {
    ElMessage.warning('该类别下还有内容，无法删除')
    return
  }
  ElMessageBox.confirm('确定要删除该类别吗？', '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleStatusChange = (row) => {
  ElMessage.success(row.isActive ? '已启用' : '已禁用')
}
</script>

<style lang="scss" scoped>
.culture-categories-container {
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

