<template>
  <div class="resource-create-container">

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ isEdit ? '编辑专题资源' : '新建专题资源' }}</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="专题资源链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入资源链接，如 https://example.com/resource" style="width: 600px;" />
          <div class="form-tip">请输入完整的资源链接地址</div>
        </el-form-item>

        <el-form-item label="资源详情" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="5"
            placeholder="请输入资源详情说明"
            maxlength="500"
            show-word-limit
            style="width: 600px;"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="上架">上架</el-radio>
            <el-radio label="下架">下架</el-radio>
          </el-radio-group>
          <div class="form-tip">上架后该资源将在前台展示</div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const isEdit = computed(() => !!route.params.id)

const form = reactive({
  link: '',
  description: '',
  status: '上架'
})

const rules = {
  link: [
    { required: true, message: '请输入资源链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入资源详情', trigger: 'blur' },
    { min: 10, message: '资源详情至少10个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const handleBack = () => { router.back() }

const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '修改成功' : '新建成功')
      setTimeout(() => { router.push('/resources/topic/list') }, 1000)
    }
  })
}

// 初始化数据（编辑模式）
const initData = () => {
  if (isEdit.value) {
    const resourceId = route.params.id

    // 模拟数据
    const mockData = {
      1: {
        id: 1,
        title: '铸牢中华民族共同体意识学习资料',
        category: '理论学习',
        description: '关于铸牢中华民族共同体意识的系统性学习资料汇编。',
        fileUrl: 'https://example.com/resource1.pdf',
        fileSize: '15.6 MB',
        coverImage: '',
        tags: ['理论学习', '民族工作', '政策文件'],
        downloads: 1580,
        status: '已发布'
      },
      2: {
        id: 2,
        title: '民族政策法规汇编',
        category: '政策法规',
        description: '我国民族政策法规的系统汇编，包含最新修订内容。',
        fileUrl: 'https://example.com/resource2.pdf',
        fileSize: '22.3 MB',
        coverImage: '',
        tags: ['政策法规', '法律文件'],
        downloads: 2340,
        status: '已发布'
      }
    }

    const data = mockData[resourceId]
    if (data) {
      Object.assign(form, {
        title: data.title || '',
        category: data.category || '',
        description: data.description || '',
        fileUrl: data.fileUrl || '',
        fileSize: data.fileSize || '',
        coverImage: data.coverImage || '',
        tags: data.tags || [],
        downloads: data.downloads || 0,
        status: data.status || '草稿'
      })
    }
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.resource-create-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-title { font-weight: bold; font-size: 18px; }
  }
  .form-tip {
    margin-top: 5px;
    font-size: 13px;
    color: #909399;
  }
}
</style>
