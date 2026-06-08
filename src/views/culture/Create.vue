<template>
  <div class="culture-create-container">

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ isEdit ? '编辑内容' : '新建内容' }}</span>
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

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入内容标题" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="所属类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择类别" style="width: 300px;">
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="简介">
          <el-input
            v-model="form.briefIntro"
            type="textarea"
            :rows="3"
            placeholder="请输入简介（选填，100字以内）"
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
                <el-icon :size="50"><Plus /></el-icon>
                <div class="upload-text">上传封面图</div>
                <div class="upload-tip">选填，建议尺寸：800x600px，不超过2MB</div>
              </div>
            </el-upload>
            <div v-if="form.cover" class="cover-actions">
              <el-button size="small" type="danger" @click="form.cover = ''">
                <el-icon><Delete /></el-icon>
                <span>删除</span>
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- 详细内容 -->
        <el-divider content-position="left">
          <span class="divider-title">详细内容</span>
        </el-divider>

        <el-form-item label="内容详情" prop="content">
          <RichEditor v-model="form.content" height="400px" placeholder="请输入文化内容详情..." />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import RichEditor from '@/components/RichEditor.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const isEdit = computed(() => !!route.params.id)

const categories = [
  '塞外长城驿站',
  '传统戏曲艺术',
  '经典古籍',
  '汉字书法',
  '民族节日',
  '民族服饰',
  '民族音乐舞蹈',
  '传统技艺'
]

const form = reactive({
  title: '',
  category: '',
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
    callback(new Error('请输入内容详情'))
  } else {
    callback()
  }
}

const rules = {
  title: [{ required: true, message: '请输入内容标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择所属类别', trigger: 'change' }],
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
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (!valid) return
    ElMessage.success('提交成功，等待审核')
    setTimeout(() => {
      router.push('/culture/list')
    }, 1000)
  })
}

const initData = () => {
  if (isEdit.value) {
    const cultureId = route.params.id

    // 模拟数据
    const mockData = {
      1: {
        id: 1,
        title: '塞外长城驿站——历史的见证',
        category: '塞外长城驿站',
        briefIntro: '塞外长城驿站是古代丝绸之路上的重要驿站，承载着厚重的历史文化。',
        content: '<p>塞外长城驿站位于古代丝绸之路的关键节点，见证了中华民族各族人民的交流交往交融...</p>'
      },
      2: {
        id: 2,
        title: '塞上江南——宁夏文化概览',
        category: '塞上江南文化',
        briefIntro: '宁夏作为塞上江南，拥有独特的回族文化和黄河文化融合特色。',
        content: '<p>宁夏回族自治区地处黄河中上游，被誉为"塞上江南"，这里的文化底蕴深厚...</p>'
      },
      3: {
        id: 3,
        title: '民族传统手工艺传承与发展',
        category: '传统工艺',
        briefIntro: '探讨少数民族传统手工艺在现代社会的传承与创新发展。',
        content: '<p>少数民族传统手工艺是中华优秀传统文化的重要组成部分，包含刺绣、编织、银饰等...</p>'
      }
    }

    const data = mockData[cultureId]
    if (data) {
      Object.assign(form, {
        title: data.title || '',
        category: data.category || '',
        briefIntro: data.briefIntro || '',
        content: data.content || ''
      })
    }
  }
}

onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.culture-create-container {
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
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #999;
  }

  .video-list {
    width: 100%;
  }

  .video-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .el-input {
      flex: 1;
    }
  }
}
</style>
