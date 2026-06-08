<template>
  <div class="person-create-container">

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ pageTitle }}</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="currentRules" label-width="120px">
        <!-- 头像/标识 -->
        <el-form-item :label="isGroup ? '集体标识' : '头像照片'">
          <div class="avatar-wrapper">
            <el-upload
              :class="['avatar-uploader', { 'avatar-uploader-group': isGroup }]"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              accept="image/*"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar-image" />
              <div v-else class="avatar-placeholder">
                <el-icon :size="40"><Plus /></el-icon>
                <div class="upload-text">{{ isGroup ? '上传标识' : '上传头像' }}</div>
              </div>
            </el-upload>
            <div class="tip">建议尺寸：{{ isGroup ? '285x226px' : '174x210px' }}</div>
          </div>
        </el-form-item>

        <!-- ========== 先进个人表单 ========== -->
        <template v-if="!isGroup">
          <el-divider content-position="left">
            <span class="divider-title">基本信息</span>
          </el-divider>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族" prop="ethnicity">
                <el-select v-model="form.ethnicity" placeholder="请选择民族" style="width: 100%;">
                  <el-option label="汉族" value="汉族" />
                  <el-option label="蒙古族" value="蒙古族" />
                  <el-option label="回族" value="回族" />
                  <el-option label="藏族" value="藏族" />
                  <el-option label="维吾尔族" value="维吾尔族" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="出生年月">
                <el-date-picker v-model="form.birthDate" type="month" placeholder="选择出生年月" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="政治面貌">
                <el-select v-model="form.politicalStatus" placeholder="请选择" style="width: 100%;">
                  <el-option label="中共党员" value="中共党员" />
                  <el-option label="共青团员" value="共青团员" />
                  <el-option label="民主党派" value="民主党派" />
                  <el-option label="群众" value="群众" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="工作单位" prop="workUnit">
            <el-input v-model="form.workUnit" placeholder="请输入工作单位" />
          </el-form-item>

          <el-form-item label="职务">
            <el-input v-model="form.position" placeholder="请输入职务" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="form.phone" placeholder="仅后台可见" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="form.email" placeholder="仅后台可见" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="个人简介" prop="briefIntro">
            <el-input v-model="form.briefIntro" type="textarea" :rows="4" placeholder="请输入个人简介（100-200字）" maxlength="200" show-word-limit />
          </el-form-item>

          <el-divider content-position="left">
            <span class="divider-title">事迹材料</span>
          </el-divider>

          <el-form-item label="个人先进事迹" prop="deeds">
            <RichEditor v-model="form.deeds" height="500px" placeholder="请输入个人先进事迹（可分章节详细描述）" />
          </el-form-item>
        </template>

        <!-- ========== 先进集体表单 ========== -->
        <template v-else>
          <el-divider content-position="left">
            <span class="divider-title">集体信息</span>
          </el-divider>

          <el-form-item label="集体名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入先进集体名称" />
          </el-form-item>

          <el-form-item label="所属单位" prop="workUnit">
            <el-input v-model="form.workUnit" placeholder="请输入集体所属单位" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="成立时间">
                <el-date-picker v-model="form.establishDate" type="date" placeholder="选择成立时间" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成员人数">
                <el-input-number v-model="form.memberCount" :min="1" :max="99999" placeholder="请输入成员人数" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="联系人">
            <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="form.phone" placeholder="仅后台可见" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="form.email" placeholder="仅后台可见" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="集体简介" prop="briefIntro">
            <el-input v-model="form.briefIntro" type="textarea" :rows="4" placeholder="请输入集体简介（100-200字）" maxlength="200" show-word-limit />
          </el-form-item>

          <el-divider content-position="left">
            <span class="divider-title">集体事迹</span>
          </el-divider>

          <el-form-item label="集体先进事迹" prop="deeds">
            <RichEditor v-model="form.deeds" height="500px" placeholder="请输入集体先进事迹（可分章节详细描述）" />
          </el-form-item>
        </template>

        <!-- ========== 通用：荣誉与展示设置 ========== -->
        <el-divider content-position="left">
          <span class="divider-title">荣誉信息</span>
        </el-divider>

        <el-form-item label="荣誉称号" prop="honorTitle">
          <el-input v-model="form.honorTitle" placeholder="请输入荣誉称号" />
        </el-form-item>

        <el-form-item label="荣誉级别" prop="honorLevel">
          <el-select v-model="form.honorLevel" placeholder="请选择荣誉级别" style="width: 300px;">
            <el-option label="国家级" value="national" />
            <el-option label="省级" value="provincial" />
            <el-option label="市级" value="city" />
          </el-select>
        </el-form-item>

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
const isGroup = computed(() => route.query.type === 'group')

const pageTitle = computed(() => {
  if (isEdit.value) {
    return isGroup.value ? '编辑先进集体' : '编辑先进个人'
  }
  return isGroup.value ? '新建先进集体' : '新建先进个人'
})

const form = reactive({
  avatar: '',
  name: '',
  gender: '男',
  ethnicity: '',
  birthDate: '',
  politicalStatus: '',
  workUnit: '',
  position: '',
  category: route.query.type === 'group' ? '先进集体' : '先进个人',
  phone: '',
  email: '',
  briefIntro: '',
  deeds: '',
  honorTitle: '',
  honorLevel: '',
  // 集体专用字段
  establishDate: '',
  memberCount: null,
  contactPerson: '',
  isRecommend: false,
  sortOrder: 100
})

// 先进个人验证规则
const personRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  ethnicity: [{ required: true, message: '请选择民族', trigger: 'change' }],
  workUnit: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
  briefIntro: [{ required: true, message: '请输入个人简介', trigger: 'blur' }],
  deeds: [{ required: true, message: '请输入个人先进事迹', trigger: 'blur' }],
  honorTitle: [{ required: true, message: '请输入荣誉称号', trigger: 'blur' }],
  honorLevel: [{ required: true, message: '请选择荣誉级别', trigger: 'change' }]
}

// 先进集体验证规则
const groupRules = {
  name: [{ required: true, message: '请输入集体名称', trigger: 'blur' }],
  workUnit: [{ required: true, message: '请输入所属单位', trigger: 'blur' }],
  briefIntro: [{ required: true, message: '请输入集体简介', trigger: 'blur' }],
  deeds: [{ required: true, message: '请输入集体先进事迹', trigger: 'blur' }],
  honorTitle: [{ required: true, message: '请输入荣誉称号', trigger: 'blur' }],
  honorLevel: [{ required: true, message: '请选择荣誉级别', trigger: 'change' }]
}

const currentRules = computed(() => isGroup.value ? groupRules : personRules)

const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target.result
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
        router.push('/persons/list')
      }, 1000)
    }
  })
}

// 初始化数据（编辑模式）
const initData = () => {
  if (isEdit.value) {
    const personId = route.params.id
    const type = route.query.type

    // 模拟数据
    const mockData = {
      person: {
        1: {
          id: 1,
          avatar: '',
          name: '张明',
          gender: '男',
          ethnicity: '汉族',
          birthDate: '1985-03-15',
          politicalStatus: '中共党员',
          workplace: '某市教育局',
          position: '局长',
          description: '<p>张明同志长期从事民族教育工作，积极推动民族团结进步事业...</p>',
          awards: '<p>2023年获得全国民族团结进步模范个人称号</p>',
          isRecommend: true,
          sortOrder: 100
        }
      },
      group: {
        1: {
          id: 1,
          avatar: '',
          name: '某市民族团结进步示范学校',
          ethnicity: '',
          birthDate: '2010-09-01',
          politicalStatus: '',
          workplace: '某市教育系统',
          position: '',
          description: '<p>该学校长期致力于民族团结进步教育，创建和谐校园...</p>',
          awards: '<p>2024年被评为全国民族团结进步示范单位</p>',
          isRecommend: true,
          sortOrder: 90
        }
      }
    }

    const dataSource = type === 'group' ? mockData.group : mockData.person
    const data = dataSource[personId]

    if (data) {
      Object.assign(form, {
        avatar: data.avatar || '',
        name: data.name || '',
        gender: data.gender || '男',
        ethnicity: data.ethnicity || '',
        birthDate: data.birthDate || '',
        politicalStatus: data.politicalStatus || '',
        workplace: data.workplace || '',
        position: data.position || '',
        description: data.description || '',
        awards: data.awards || '',
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
.person-create-container {
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

  .avatar-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-uploader {
    .avatar-image {
      width: 174px;
      height: 210px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
    }

    .avatar-placeholder {
      width: 174px;
      height: 210px;
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

  .avatar-uploader-group {
    .avatar-image {
      width: 285px !important;
      height: 226px !important;
    }

    .avatar-placeholder {
      width: 285px !important;
      height: 226px !important;
    }
  }

  .tip {
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
}
</style>
