<template>
  <div class="roles-container">
    <!-- 顶部操作栏 -->
    <el-card class="action-card" shadow="never">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon><span>新建角色</span>
      </el-button>
    </el-card>

    <!-- 列表 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色代码" width="150" />
        <el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userCount" label="用户数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon><span>编辑</span>
            </el-button>
            <el-button link type="success" size="small" @click="handlePermission(row)">
              <el-icon><Key /></el-icon><span>权限</span>
            </el-button>
            <el-button v-if="!row.isSystem" link type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon><span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="90px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色代码（如：admin）" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog v-model="permissionVisible" title="权限配置" width="700px">
      <el-alert
        title="提示：勾选的权限将授予该角色"
        type="info"
        :closable="false"
        style="margin-bottom: 20px;"
      />
      <el-tree
        ref="treeRef"
        :data="permissionTree"
        :props="{ label: 'label', children: 'children' }"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <template #footer>
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePermission">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)

const tableData = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限，不可删除',
    userCount: 1,
    status: '启用',
    isSystem: true,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    name: '管理员',
    code: 'admin',
    description: '拥有大部分管理权限，可管理用户和内容',
    userCount: 3,
    status: '启用',
    isSystem: true,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 3,
    name: '编辑',
    code: 'editor',
    description: '负责内容的创建和编辑',
    userCount: 15,
    status: '启用',
    isSystem: false,
    createTime: '2025-03-10 14:20:00'
  },
  {
    id: 4,
    name: '审核员',
    code: 'auditor',
    description: '负责内容的审核工作',
    userCount: 8,
    status: '启用',
    isSystem: false,
    createTime: '2025-03-15 09:30:00'
  }
])

const permissionTree = ref([
  {
    id: 1,
    label: '数据概览',
    children: [
      { id: 11, label: '查看数据概览' }
    ]
  },
  {
    id: 2,
    label: '时政要闻',
    children: [
      { id: 21, label: '查看列表' },
      { id: 22, label: '新建文章' },
      { id: 23, label: '编辑文章' },
      { id: 24, label: '删除文章' },
      { id: 25, label: '分类管理' }
    ]
  },
  {
    id: 3,
    label: '文化传承',
    children: [
      { id: 31, label: '查看列表' },
      { id: 32, label: '新建内容' },
      { id: 33, label: '编辑内容' },
      { id: 34, label: '删除内容' }
    ]
  },
  {
    id: 4,
    label: '典型引领',
    children: [
      { id: 41, label: '查看先进个人' },
      { id: 42, label: '查看先进集体' },
      { id: 43, label: '新建' },
      { id: 44, label: '编辑' },
      { id: 45, label: '删除' }
    ]
  },
  {
    id: 5,
    label: '实践育人',
    children: [
      { id: 51, label: '查看校园实践' },
      { id: 52, label: '查看社会实践' },
      { id: 53, label: '新建' },
      { id: 54, label: '编辑' },
      { id: 55, label: '删除' }
    ]
  },
  {
    id: 6,
    label: '资源中心',
    children: [
      { id: 61, label: '查看专题资源' },
      { id: 62, label: '查看软件资源' },
      { id: 63, label: '新建' },
      { id: 64, label: '编辑' },
      { id: 65, label: '删除' }
    ]
  },
  {
    id: 7,
    label: '审核管理',
    children: [
      { id: 71, label: '查看待审核' },
      { id: 72, label: '审核通过' },
      { id: 73, label: '审核驳回' }
    ]
  },
  {
    id: 8,
    label: '系统管理',
    children: [
      { id: 81, label: '用户管理' },
      { id: 82, label: '角色管理' },
      { id: 83, label: '网站配置' }
    ]
  }
])

const dialogVisible = ref(false)
const permissionVisible = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑角色' : '新建角色')
const isEdit = ref(false)
const formRef = ref(null)
const treeRef = ref(null)
const currentRole = ref(null)

const form = reactive({
  id: null,
  name: '',
  code: '',
  description: '',
  status: '启用'
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色代码', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '角色代码只能包含小写字母和下划线', trigger: 'blur' }
  ]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    name: '',
    code: '',
    description: '',
    status: '启用'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  if (row.isSystem) {
    ElMessage.warning('系统角色不可编辑')
    return
  }
  isEdit.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '修改成功' : '新建成功')
      dialogVisible.value = false
    }
  })
}

const handlePermission = (row) => {
  currentRole.value = row
  permissionVisible.value = true

  // 模拟已有权限（这里可以根据角色加载已授权的权限ID）
  setTimeout(() => {
    if (row.code === 'editor') {
      treeRef.value.setCheckedKeys([21, 22, 23, 31, 32, 33, 41, 43, 51, 53, 61, 63])
    } else if (row.code === 'auditor') {
      treeRef.value.setCheckedKeys([21, 31, 41, 51, 61, 71, 72, 73])
    }
  }, 100)
}

const handleSavePermission = () => {
  const checkedKeys = treeRef.value.getCheckedKeys()
  console.log('保存权限:', checkedKeys)
  ElMessage.success('权限配置保存成功')
  permissionVisible.value = false
}

const handleDelete = (row) => {
  if (row.isSystem) {
    ElMessage.warning('系统角色不可删除')
    return
  }
  ElMessageBox.confirm(`确定删除角色 ${row.name} 吗？此操作不可恢复！`, '警告', {
    type: 'error',
    confirmButtonText: '确定删除'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.roles-container {
  .action-card, .table-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }
}
</style>
