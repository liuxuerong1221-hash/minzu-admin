<template>
  <div class="users-container">
    <!-- 搜索筛选栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 200px;" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="超级管理员" value="超级管理员" />
            <el-option label="管理员" value="管理员" />
            <el-option label="编辑" value="编辑" />
            <el-option label="审核员" value="审核员" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 130px;">
            <el-option label="全部" value="" />
            <el-option label="正常" value="正常" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon><span>搜索</span>
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshRight /></el-icon><span>重置</span>
          </el-button>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon><span>新建用户</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="所属部门" width="150" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="170" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon><span>编辑</span>
            </el-button>
            <el-button link type="warning" size="small" @click="handleResetPassword(row)">
              <el-icon><Lock /></el-icon><span>重置密码</span>
            </el-button>
            <el-button v-if="row.status === '正常'" link type="danger" size="small" @click="handleDisable(row)">
              <el-icon><CircleClose /></el-icon><span>禁用</span>
            </el-button>
            <el-button v-else link type="success" size="small" @click="handleEnable(row)">
              <el-icon><CircleCheck /></el-icon><span>启用</span>
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon><span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 新建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%;">
            <el-option label="超级管理员" value="超级管理员" />
            <el-option label="管理员" value="管理员" />
            <el-option label="编辑" value="编辑" />
            <el-option label="审核员" value="审核员" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="正常">正常</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchForm = reactive({ username: '', role: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const tableData = ref([
  {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: '超级管理员',
    department: '技术部',
    status: '正常',
    lastLoginTime: '2026-06-08 14:30:25',
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'editor1',
    realName: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    role: '编辑',
    department: '内容部',
    status: '正常',
    lastLoginTime: '2026-06-08 09:15:30',
    createTime: '2025-03-15 14:20:00'
  },
  {
    id: 3,
    username: 'auditor1',
    realName: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    role: '审核员',
    department: '审核部',
    status: '正常',
    lastLoginTime: '2026-06-07 16:45:10',
    createTime: '2025-04-20 09:30:00'
  },
  {
    id: 4,
    username: 'manager1',
    realName: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    role: '管理员',
    department: '运营部',
    status: '禁用',
    lastLoginTime: '2026-05-20 10:20:00',
    createTime: '2025-05-10 11:00:00'
  }
])

const dialogVisible = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑用户' : '新建用户')
const isEdit = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  username: '',
  realName: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  password: '',
  status: '正常'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const getRoleTagType = (role) => {
  const typeMap = {
    '超级管理员': 'danger',
    '管理员': 'warning',
    '编辑': '',
    '审核员': 'success'
  }
  return typeMap[role] || 'info'
}

const fetchData = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = tableData.value.length
    loading.value = false
  }, 300)
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => {
  searchForm.username = ''
  searchForm.role = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    username: '',
    realName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    password: '',
    status: '正常'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '修改成功' : '新建成功')
      dialogVisible.value = false
      fetchData()
    }
  })
}

const handleResetPassword = (row) => {
  ElMessageBox.confirm(`确定重置用户 ${row.username} 的密码吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('密码已重置为：123456')
  }).catch(() => {})
}

const handleDisable = (row) => {
  ElMessageBox.confirm(`确定禁用用户 ${row.username} 吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    row.status = '禁用'
    ElMessage.success('已禁用')
  }).catch(() => {})
}

const handleEnable = (row) => {
  row.status = '正常'
  ElMessage.success('已启用')
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除用户 ${row.username} 吗？此操作不可恢复！`, '警告', {
    type: 'error',
    confirmButtonText: '确定删除'
  }).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

fetchData()
</script>

<style lang="scss" scoped>
.users-container {
  .search-card, .table-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
