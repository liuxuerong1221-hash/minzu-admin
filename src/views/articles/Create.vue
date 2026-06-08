<template>
  <div class="article-create-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ isEdit ? '编辑文章' : '新建文章' }}</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">基本信息</span>
        </el-divider>

        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题（50-200字）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="副标题">
          <el-input
            v-model="form.subtitle"
            placeholder="请输入副标题（可选）"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入标签"
            style="width: 100%;"
          >
            <el-option label="民族团结" value="民族团结" />
            <el-option label="文化传承" value="文化传承" />
            <el-option label="政策解读" value="政策解读" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="form.author" placeholder="默认当前用户" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="form.source" placeholder="如：新华社、人民日报" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="原文链接">
          <el-input v-model="form.sourceUrl" placeholder="请输入原文链接（可选）" />
        </el-form-item>

        <!-- 封面图片 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">封面图片</span>
        </el-divider>

        <el-form-item label="封面图">
          <div class="cover-wrapper">
            <el-upload
              class="cover-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleCoverChange"
              accept="image/*"
            >
              <img v-if="form.cover" :src="form.cover" class="cover-image" />
              <div v-else class="cover-placeholder">
                <el-icon :size="50"><Plus /></el-icon>
                <div class="upload-text">上传封面图</div>
                <div class="upload-tip">选填，建议尺寸：800x600px，不超过2MB</div>
              </div>
            </el-upload>
            <div v-if="form.cover" class="cover-actions">
              <el-button size="small" @click="triggerReupload">
                <el-icon><RefreshRight /></el-icon>
                <span>重新上传</span>
              </el-button>
              <el-button size="small" type="danger" @click="handleRemoveCover">
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-button>
            </div>
          </div>
          <input
            ref="coverInputRef"
            type="file"
            accept="image/*"
            style="display: none;"
            @change="handleReuploadChange"
          />
        </el-form-item>

        <!-- 文章摘要 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">文章摘要</span>
        </el-divider>

        <el-form-item label="摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="4"
            placeholder="请输入文章摘要（100-300字）"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <!-- 正文内容 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">正文内容</span>
        </el-divider>

        <el-form-item label="正文" prop="content">
          <RichEditor
            v-model="form.content"
            height="450px"
            placeholder="请输入文章正文内容..."
          />
        </el-form-item>

        <!-- 发布设置 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">发布设置</span>
        </el-divider>

        <el-form-item label="设置">
          <el-checkbox-group v-model="form.settings">
            <el-checkbox label="isTop">置顶</el-checkbox>
            <el-checkbox label="isRecommend">推荐</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="发布时间">
          <el-radio-group v-model="form.publishType">
            <el-radio label="now">立即发布</el-radio>
            <el-radio label="scheduled">定时发布</el-radio>
          </el-radio-group>
          <el-date-picker
            v-if="form.publishType === 'scheduled'"
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            style="margin-left: 20px;"
          />
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
const coverInputRef = ref(null)

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const form = reactive({
  title: '',
  subtitle: '',
  tags: [],
  author: '系统管理员',
  source: '',
  sourceUrl: '',
  cover: '',
  summary: '',
  content: '',
  settings: [],
  publishType: 'now',
  publishTime: '',
  sortOrder: 100
})

// 富文本内容校验：去除HTML标签后判断纯文本长度
const validateContent = (rule, value, callback) => {
  const text = (value || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim()
  if (!text) {
    callback(new Error('请输入文章内容'))
  } else if (text.length < 100) {
    callback(new Error('内容至少 100 个字符'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 10, max: 200, message: '标题长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 50, max: 300, message: '摘要长度在 50 到 300 个字符', trigger: 'blur' }
  ],
  content: [
    { validator: validateContent, trigger: 'change' }
  ]
}

// 处理封面图变化
const handleCoverChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.cover = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 删除封面图
const handleRemoveCover = () => {
  form.cover = ''
  ElMessage.success('封面图已删除')
}

// 触发重新上传
const triggerReupload = () => {
  coverInputRef.value && coverInputRef.value.click()
}

// 重新上传封面图
const handleReuploadChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    form.cover = e.target.result
  }
  reader.readAsDataURL(file)
  // 清空input值，确保可再次选择同一文件
  event.target.value = ''
}

// 返回
const handleBack = () => {
  router.back()
}

// 保存草稿
const handleSaveDraft = async () => {
  ElMessage.success('草稿保存成功')
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    // 模拟提交
    ElMessage.success('提交成功，等待审核')
    setTimeout(() => {
      router.push('/articles/list')
    }, 1000)
  })
}

// 初始化数据（编辑模式）
const initData = () => {
  if (isEdit.value) {
    // 模拟获取文章数据
    Object.assign(form, {
      title: '示例文章标题',
      summary: '这是一篇示例文章的摘要内容，用于展示编辑功能。',
      content: '这里是文章的正文内容...'
    })
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.article-create-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-title {
      font-weight: bold;
      font-size: 18px;
    }
  }

  .cover-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .cover-actions {
      display: flex;
      gap: 10px;
    }
  }

  .cover-uploader {
    .cover-image {
      width: 300px;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
    }

    .cover-placeholder {
      width: 300px;
      height: 200px;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #A70101;
      }

      .upload-text {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
      }

      .upload-tip {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .editor-container {
    width: 100%;

    .editor-tip {
      margin-top: 10px;
      padding: 10px;
      background: #f5f7fa;
      border-radius: 4px;
      color: #909399;
      font-size: 13px;
    }
  }
}
</style>
