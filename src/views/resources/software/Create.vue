<template>
  <div class="resource-create-container">

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ isEdit ? '编辑软件资源' : '新建软件资源' }}</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="软件图标">
          <el-upload class="icon-uploader" :show-file-list="false" :auto-upload="false" :on-change="handleIconChange" accept="image/*">
            <img v-if="form.icon" :src="form.icon" class="icon-image" />
            <div v-else class="icon-placeholder">
              <el-icon :size="28"><Plus /></el-icon>
              <div class="upload-text">上传图标</div>
            </div>
          </el-upload>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="软件名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入软件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="如 v1.0.0" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="软件分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%;">
                <el-option label="办公软件" value="办公软件" />
                <el-option label="学习工具" value="学习工具" />
                <el-option label="多媒体" value="多媒体" />
                <el-option label="系统工具" value="系统工具" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="适用平台" prop="platform">
              <el-select v-model="form.platform" placeholder="请选择平台" style="width: 100%;">
                <el-option label="Windows" value="Windows" />
                <el-option label="macOS" value="macOS" />
                <el-option label="Android" value="Android" />
                <el-option label="iOS" value="iOS" />
                <el-option label="跨平台" value="跨平台" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权方式">
              <el-select v-model="form.license" placeholder="请选择" style="width: 100%;">
                <el-option label="免费" value="免费" />
                <el-option label="开源" value="开源" />
                <el-option label="共享" value="共享" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="安装包" prop="file">
          <el-upload class="file-uploader" :auto-upload="false" :on-change="handleFileChange" :limit="1">
            <el-button type="primary"><el-icon><Upload /></el-icon><span>选择安装包</span></el-button>
            <template #tip>
              <div class="el-upload__tip">支持 exe、dmg、apk、zip 等格式，单个文件不超过 1GB</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="软件简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入软件简介" maxlength="300" show-word-limit />
        </el-form-item>

        <el-divider content-position="left"><span class="divider-title">详细说明</span></el-divider>
        <el-form-item label="功能介绍">
          <RichEditor v-model="form.content" height="300px" placeholder="请输入软件功能介绍、使用说明等" />
        </el-form-item>

        <el-divider content-position="left"><span class="divider-title">展示设置</span></el-divider>
        <el-form-item label="推荐到首页">
          <el-switch v-model="form.isRecommend" />
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" />
          <span style="margin-left: 10px; color: #999;">数字越大越靠前</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import RichEditor from '@/components/RichEditor.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const isEdit = computed(() => !!route.params.id)

const form = reactive({
  icon: '', title: '', version: '', category: '', platform: '', license: '免费',
  file: '', description: '', content: '', isRecommend: false, sortOrder: 100
})

const rules = {
  title: [{ required: true, message: '请输入软件名称', trigger: 'blur' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
  description: [{ required: true, message: '请输入软件简介', trigger: 'blur' }]
}

const handleIconChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => { form.icon = e.target.result }
  reader.readAsDataURL(file.raw)
}
const handleFileChange = (file) => { form.file = file.name }
const handleBack = () => { router.back() }
const handleSaveDraft = () => { ElMessage.success('草稿保存成功') }
const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功')
      setTimeout(() => { router.push('/resources/software/list') }, 1000)
    }
  })
}

// 初始化数据（编辑模式）
const initData = () => {
  if (isEdit.value) {
    const softwareId = route.params.id

    // 模拟数据
    const mockData = {
      1: {
        id: 1,
        name: '民族语言学习助手',
        version: 'v2.5.0',
        platform: 'Windows',
        category: '教育学习',
        description: '帮助用户学习少数民族语言的智能辅助工具，支持多种民族语言。',
        icon: '',
        file: '',
        fileSize: '45.2 MB',
        developer: '某教育科技公司',
        releaseDate: '2026-05-01',
        downloads: 8920,
        isRecommend: true,
        sortOrder: 100
      },
      2: {
        id: 2,
        name: '民族文化知识库',
        version: 'v1.8.3',
        platform: 'Android',
        category: '文化参考',
        description: '集合各民族文化知识的移动应用，包含历史、习俗、节日等内容。',
        icon: '',
        file: '',
        fileSize: '32.7 MB',
        developer: '某文化传媒公司',
        releaseDate: '2026-04-15',
        downloads: 5640,
        isRecommend: true,
        sortOrder: 90
      }
    }

    const data = mockData[softwareId]
    if (data) {
      Object.assign(form, {
        name: data.name || '',
        version: data.version || '',
        platform: data.platform || '',
        category: data.category || '',
        description: data.description || '',
        icon: data.icon || '',
        file: data.file || '',
        fileSize: data.fileSize || '',
        developer: data.developer || '',
        releaseDate: data.releaseDate || '',
        downloads: data.downloads || 0,
        isRecommend: data.isRecommend ?? false,
        sortOrder: data.sortOrder ?? 100
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
  .divider-title { font-weight: bold; font-size: 16px; }
  .icon-uploader {
    .icon-image { width: 100px; height: 100px; object-fit: cover; border-radius: 12px; }
    .icon-placeholder {
      width: 100px; height: 100px; border: 2px dashed #d9d9d9; border-radius: 12px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;
      &:hover { border-color: #A70101; }
      .upload-text { margin-top: 6px; font-size: 12px; color: #666; }
    }
  }
}
</style>
