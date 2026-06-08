<template>
  <div class="group-create">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑' : '新建' }}先进集体</span>
          <el-button link @click="handleBack">返回列表</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <!-- 基本信息 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">基本信息</span>
        </el-divider>

        <el-form-item label="集体标识/Logo">
          <el-upload
            class="logo-uploader"
            :show-file-list="false"
            :before-upload="() => false"
            :on-change="handleLogoChange"
            accept="image/*"
          >
            <el-avatar v-if="form.logo" :size="100" :src="form.logo" />
            <el-icon v-else class="logo-uploader-icon" :size="100"><Plus /></el-icon>
          </el-upload>
          <div style="margin-top: 10px; color: #999; font-size: 12px;">
            建议尺寸：200x200像素，支持 JPG、PNG 格式
          </div>
        </el-form-item>

        <el-form-item label="集体名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入集体名称" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="所属单位" prop="organization">
          <el-input v-model="form.organization" placeholder="请输入所属单位" maxlength="100" />
        </el-form-item>

        <el-form-item label="荣誉级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择荣誉级别" style="width: 100%;">
            <el-option label="国家级" value="national" />
            <el-option label="省级" value="provincial" />
            <el-option label="市级" value="municipal" />
            <el-option label="县级" value="county" />
          </el-select>
        </el-form-item>

        <el-form-item label="荣誉称号" prop="honor">
          <el-input v-model="form.honor" placeholder="如：全国民族团结进步示范集体" maxlength="100" />
        </el-form-item>

        <el-form-item label="获奖时间">
          <el-date-picker
            v-model="form.awardDate"
            type="date"
            placeholder="请选择获奖时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="涉及民族">
          <el-select v-model="form.ethnicities" multiple placeholder="请选择涉及的民族" style="width: 100%;">
            <el-option label="汉族" value="汉族" />
            <el-option label="回族" value="回族" />
            <el-option label="维吾尔族" value="维吾尔族" />
            <el-option label="壮族" value="壮族" />
            <el-option label="满族" value="满族" />
            <el-option label="藏族" value="藏族" />
            <el-option label="蒙古族" value="蒙古族" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="联系方式">
          <el-input v-model="form.contact" placeholder="联系电话或邮箱" maxlength="50" />
        </el-form-item>

        <el-form-item label="集体简介" prop="briefIntro">
          <el-input
            v-model="form.briefIntro"
            type="textarea"
            :rows="4"
            placeholder="请简要介绍集体情况（100-300字）"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <!-- 事迹材料 -->
        <el-divider content-position="left">
          <span style="font-weight: bold; font-size: 16px;">事迹材料</span>
        </el-divider>

        <el-form-item label="集体先进事迹" prop="deeds">
          <RichEditor
            v-model="form.deeds"
            height="500px"
            placeholder="请输入集体先进事迹（可分章节详细描述）"
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

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import RichEditor from '@/components/RichEditor.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const form = reactive({
  logo: '',
  name: '',
  organization: '',
  level: '',
  honor: '',
  awardDate: '',
  ethnicities: [],
  contact: '',
  briefIntro: '',
  deeds: '',
  isRecommend: false,
  sortOrder: 100
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入集体名称', trigger: 'blur' }],
  organization: [{ required: true, message: '请输入所属单位', trigger: 'blur' }],
  level: [{ required: true, message: '请选择荣誉级别', trigger: 'change' }],
  honor: [{ required: true, message: '请输入荣誉称号', trigger: 'blur' }],
  briefIntro: [
    { required: true, message: '请输入集体简介', trigger: 'blur' },
    { min: 100, max: 300, message: '简介长度在 100 到 300 个字符', trigger: 'blur' }
  ],
  deeds: [{ required: true, message: '请输入集体先进事迹', trigger: 'blur' }]
}

// 处理Logo变化
const handleLogoChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.logo = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 返回
const handleBack = () => {
  router.back()
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    // 模拟提交
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    setTimeout(() => {
      router.push('/groups/list')
    }, 1000)
  })
}

// 初始化数据（编辑模式）
const initData = () => {
  if (isEdit.value) {
    const groupId = route.params.id

    // 模拟数据
    const mockData = [
      {
        id: 1,
        logo: '',
        name: 'XX小学民族团结教育团队',
        organization: 'XX市民族小学',
        level: 'national',
        honor: '全国民族团结进步示范集体',
        awardDate: '2023-09-01',
        ethnicities: ['汉族', '回族', '维吾尔族'],
        contact: '0991-1234567',
        briefIntro: 'XX市民族小学民族团结教育团队成立于2015年，深耕三重合育教模式，通过课程融合、活动融合、文化融合，打造民族团结进步教育品牌。团队先后被评为全国民族团结进步示范学校、自治区民族团结进步模范集体。',
        deeds: '<p>XX小学民族团结教育团队的先进事迹...</p>',
        isRecommend: true,
        sortOrder: 100
      },
      {
        id: 2,
        logo: '',
        name: 'XX社区民族工作站',
        organization: 'XX街道XX社区',
        level: 'provincial',
        honor: '省级民族团结进步示范社区',
        awardDate: '2023-06-15',
        ethnicities: ['汉族', '回族', '满族'],
        contact: '010-12345678',
        briefIntro: 'XX社区民族工作站创新"五共五帮"社区治理模式，服务各族群众1.2万余人。通过组建民族团结志愿服务队、开展多元文化交流活动、建立矛盾纠纷调解机制，连续5年实现零矛盾纠纷，成为民族团结进步创建工作的典范。',
        deeds: '<p>XX社区民族工作站的先进事迹...</p>',
        isRecommend: true,
        sortOrder: 90
      }
    ]

    const group = mockData.find(item => item.id === parseInt(groupId))

    if (group) {
      Object.assign(form, {
        logo: group.logo || '',
        name: group.name,
        organization: group.organization,
        level: group.level,
        honor: group.honor,
        awardDate: group.awardDate || '',
        ethnicities: group.ethnicities || [],
        contact: group.contact || '',
        briefIntro: group.briefIntro,
        deeds: group.deeds,
        isRecommend: group.isRecommend || false,
        sortOrder: group.sortOrder || 100
      })
    } else {
      ElMessage.error('集体不存在')
      router.back()
    }
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.group-create {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .logo-uploader-icon {
      color: #8c939d;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
