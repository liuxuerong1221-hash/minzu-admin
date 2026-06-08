<template>
  <div class="campus-practice-create-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ isEdit ? '编辑校园实践' : '新建校园实践' }}</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <!-- 基本信息 -->
        <el-divider content-position="left">
          <span class="divider-title">基本信息</span>
        </el-divider>

        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" maxlength="100" show-word-limit />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%;">
                <el-option label="学术讲座" value="学术讲座" />
                <el-option label="文化活动" value="文化活动" />
                <el-option label="志愿服务" value="志愿服务" />
                <el-option label="社团活动" value="社团活动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动时间" prop="time">
              <el-date-picker
                v-model="form.time"
                type="datetime"
                placeholder="选择活动时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动地点" prop="location">
              <el-input v-model="form.location" placeholder="请输入活动地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人数">
              <el-input-number v-model="form.participants" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动简介">
          <el-input
            v-model="form.briefIntro"
            type="textarea"
            :rows="3"
            placeholder="请输入活动简介（100字以内）"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <!-- 封面图片 -->
        <el-divider content-position="left">
          <span class="divider-title">封面图片</span>
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
                <el-icon :size="40"><Plus /></el-icon>
                <div class="upload-text">上传封面</div>
              </div>
            </el-upload>
            <div class="tip">建议尺寸：800x450px，不超过2MB</div>
          </div>
        </el-form-item>

        <!-- 活动详情 -->
        <el-divider content-position="left">
          <span class="divider-title">活动详情</span>
        </el-divider>

        <el-form-item label="活动详情" prop="content">
          <RichEditor v-model="form.content" height="400px" placeholder="请输入活动详情..." />
        </el-form-item>

        <!-- 展示设置 -->
        <el-divider content-position="left">
          <span class="divider-title">展示设置</span>
        </el-divider>

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
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import RichEditor from '@/components/RichEditor.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  type: '',
  time: '',
  location: '',
  participants: 0,
  briefIntro: '',
  cover: '',
  content: '',
  isRecommend: false,
  sortOrder: 100
})

// 富文本内容校验
const validateContent = (rule, value, callback) => {
  const text = (value || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim()
  if (!text) {
    callback(new Error('请输入活动详情'))
  } else {
    callback()
  }
}

const rules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  content: [{ validator: validateContent, trigger: 'change' }]
}

const handleCoverChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.cover = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleBack = () => {
  router.back()
}

const handleSaveDraft = () => {
  ElMessage.success('草稿保存成功')
}

const handleSubmit = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功')
      setTimeout(() => {
        router.push('/practice/campus/list')
      }, 1000)
    }
  })
}
</script>

<style lang="scss" scoped>
.campus-practice-create-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-title {
      font-weight: bold;
      font-size: 18px;
    }
  }

  .divider-title {
    font-weight: bold;
    font-size: 16px;
  }

  .cover-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .cover-uploader {
    .cover-image {
      width: 400px;
      height: 225px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
    }

    .cover-placeholder {
      width: 400px;
      height: 225px;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        border-color: #A70101;
      }

      .upload-text {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .tip {
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
}
</style>
