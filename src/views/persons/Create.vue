<template>
  <div class="person-create-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">{{ isEdit ? '编辑人物' : '新建人物' }}</span>
          <div>
            <el-button @click="handleBack">返回</el-button>
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit">提交审核</el-button>
          </div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 头像照片 -->
        <el-form-item label="头像照片" prop="avatar">
          <div class="avatar-wrapper">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              accept="image/*"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar-image" />
              <div v-else class="avatar-placeholder">
                <el-icon :size="40"><Plus /></el-icon>
                <div class="upload-text">上传头像</div>
              </div>
            </el-upload>
            <div class="tip">建议尺寸：174x210px</div>
          </div>
        </el-form-item>

        <!-- 基本信息 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">基本信息</span>
        </el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="form.category === '先进集体' ? '集体名称' : '姓名'" prop="name">
              <el-input v-model="form.name" :placeholder="form.category === '先进集体' ? '请输入集体名称' : '请输入姓名'" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.category !== '先进集体'">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.category !== '先进集体'">
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

        <el-row :gutter="20" v-if="form.category !== '先进集体'">
          <el-col :span="12">
            <el-form-item label="出生年月">
              <el-date-picker
                v-model="form.birthDate"
                type="month"
                placeholder="选择出生年月"
                style="width: 100%;"
              />
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

        <el-form-item :label="form.category === '先进集体' ? '所属单位' : '工作单位'" prop="workUnit">
          <el-input v-model="form.workUnit" placeholder="请输入工作单位" />
        </el-form-item>

        <el-form-item label="职务">
          <el-input v-model="form.position" placeholder="请输入职务" />
        </el-form-item>

        <el-form-item label="类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择类别" style="width: 300px;" @change="handleCategoryChange">
            <el-option label="先进个人" value="先进个人" />
            <el-option label="先进集体" value="先进集体" />
          </el-select>
          <el-alert
            v-if="form.category === '先进集体'"
            :closable="false"
            type="info"
            style="margin-top: 10px;"
          >
            <template #default>
              <span style="font-size: 13px;">集体类型无需填写个人性别、民族、出生年月等信息</span>
            </template>
          </el-alert>
        </el-form-item>

        <el-row :gutter="20" v-if="form.category !== '先进集体'">
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

        <el-form-item :label="form.category === '先进集体' ? '集体简介' : '个人简介'" prop="briefIntro">
          <el-input
            v-model="form.briefIntro"
            type="textarea"
            :rows="4"
            placeholder="请输入简介（100-200字）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <!-- 事迹材料 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">事迹材料</span>
        </el-divider>

        <el-form-item label="个人先进事迹" prop="deeds">
          <RichEditor
            v-model="form.deeds"
            height="500px"
            placeholder="请输入个人先进事迹（可分章节详细描述）"
          />
        </el-form-item>

        <!-- 展示设置 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">展示设置</span>
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
  avatar: '',
  name: '',
  gender: '男',
  ethnicity: '',
  birthDate: '',
  politicalStatus: '',
  workUnit: '',
  position: '',
  category: '',
  phone: '',
  email: '',
  briefIntro: '',
  deeds: '',
  isRecommend: false,
  sortOrder: 100
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  ethnicity: [{ required: true, message: '请选择民族', trigger: 'change' }],
  workUnit: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  briefIntro: [
    { required: true, message: '请输入简介', trigger: 'blur' },
    { min: 50, max: 200, message: '简介长度在 50 到 200 个字符', trigger: 'blur' }
  ],
  deeds: [{ required: true, message: '请输入个人先进事迹', trigger: 'blur' }]
}

const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 类别切换处理
const handleCategoryChange = (value) => {
  if (value === '先进集体') {
    // 清空个人信息字段
    form.gender = ''
    form.ethnicity = ''
    form.birthDate = ''
    form.politicalStatus = ''
    form.phone = ''
    form.email = ''
  }
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

  .tip, .upload-tip {
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
}
</style>
