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
    const articleId = route.params.id

    // 模拟从API获取文章数据 - 实际应用中替换为真实API调用
    // 这里使用与 List.vue 中相同的模拟数据
    const mockData = [
      {
        id: 1,
        title: '十四届全国人大常委会第二十一次会议在京举行',
        subtitle: '学习贯彻党的二十届三中全会精神',
        category: '会议精神',
        tags: ['全国人大', '会议精神', '重要讲话'],
        author: '张三',
        source: '新华社',
        sourceUrl: 'https://example.com',
        cover: '',
        summary: '十四届全国人大常委会第二十一次会议在京举行，深入学习贯彻党的二十届三中全会精神，听取和审议有关工作报告。',
        content: '<p>十四届全国人大常委会第二十一次会议在京举行，深入学习贯彻党的二十届三中全会精神...</p>',
        settings: ['recommend', 'top'],
        publishType: 'now',
        publishTime: '2026-06-01 10:30:00',
        sortOrder: 100
      },
      {
        id: 2,
        title: '关于深化民族团结进步教育的实施意见',
        subtitle: '铸牢中华民族共同体意识',
        category: '政策文件',
        tags: ['民族团结', '教育', '政策'],
        author: '李四',
        source: '国家民委',
        sourceUrl: '',
        cover: '',
        summary: '为深入贯彻党的民族工作方针政策，进一步加强和改进民族团结进步教育工作，特制定本实施意见。',
        content: '<p>关于深化民族团结进步教育的实施意见内容...</p>',
        settings: [],
        publishType: 'scheduled',
        publishTime: '2026-06-02 14:20:00',
        sortOrder: 90
      },
      {
        id: 3,
        title: '铸牢中华民族共同体意识专题研讨会成功举办',
        subtitle: '',
        category: '焦点话题',
        tags: ['研讨会', '民族工作'],
        author: '王五',
        source: '中央民族大学',
        sourceUrl: '',
        cover: '',
        summary: '铸牢中华民族共同体意识专题研讨会在京成功举办，与会专家学者围绕相关议题展开深入研讨。',
        content: '<p>铸牢中华民族共同体意识专题研讨会内容...</p>',
        settings: [],
        publishType: 'now',
        publishTime: '',
        sortOrder: 80
      },
      {
        id: 4,
        title: '民族地区经济社会发展取得历史性成就',
        subtitle: '脱贫攻坚与乡村振兴有效衔接',
        category: '焦点话题',
        tags: ['经济发展', '脱贫攻坚'],
        author: '赵六',
        source: '人民日报',
        sourceUrl: 'https://example.com',
        cover: '',
        summary: '党的十八大以来，在党中央的坚强领导下，民族地区经济社会发展取得历史性成就，人民生活水平显著提高。',
        content: '<p>民族地区经济社会发展内容...</p>',
        settings: ['recommend'],
        publishType: 'now',
        publishTime: '2026-06-04 16:40:00',
        sortOrder: 85
      },
      {
        id: 5,
        title: '推动新时代党的民族工作高质量发展',
        subtitle: '',
        category: '政策解读',
        tags: ['民族工作', '高质量发展'],
        author: '张三',
        source: '',
        sourceUrl: '',
        cover: '',
        summary: '推动新时代党的民族工作高质量发展，是贯彻落实党的二十大精神的重要举措。',
        content: '<p>推动新时代党的民族工作高质量发展内容...</p>',
        settings: [],
        publishType: 'draft',
        publishTime: '',
        sortOrder: 75
      }
    ]

    // 根据 ID 查找文章数据
    const article = mockData.find(item => item.id === parseInt(articleId))

    if (article) {
      // 将数据回填到表单
      Object.assign(form, {
        title: article.title,
        subtitle: article.subtitle || '',
        tags: article.tags || [],
        author: article.author,
        source: article.source || '',
        sourceUrl: article.sourceUrl || '',
        cover: article.cover || '',
        summary: article.summary,
        content: article.content,
        settings: article.settings || [],
        publishType: article.publishType || 'now',
        publishTime: article.publishTime || '',
        sortOrder: article.sortOrder || 100
      })
    } else {
      ElMessage.error('文章不存在')
      router.back()
    }
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
