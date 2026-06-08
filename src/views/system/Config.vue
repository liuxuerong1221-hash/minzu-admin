<template>
  <div class="config-container">
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="header-title">网站配置</span>
          <el-button type="primary" @click="handleSave">
            <el-icon><Select /></el-icon><span>保存配置</span>
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="config" label-width="120px" style="max-width: 800px;">
            <el-form-item label="网站名称">
              <el-input v-model="config.siteName" placeholder="请输入网站名称" />
            </el-form-item>
            <el-form-item label="网站标题">
              <el-input v-model="config.siteTitle" placeholder="请输入网站标题（显示在浏览器标签页）" />
            </el-form-item>
            <el-form-item label="网站Logo">
              <div class="logo-upload">
                <img v-if="config.siteLogo" :src="config.siteLogo" class="logo-image" />
                <el-upload
                  class="logo-uploader"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleLogoChange"
                >
                  <el-button type="primary" size="small">
                    <el-icon><Upload /></el-icon><span>{{ config.siteLogo ? '重新上传' : '上传Logo' }}</span>
                  </el-button>
                </el-upload>
                <div class="tip">建议尺寸：200x200px，支持PNG/JPG格式</div>
              </div>
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input v-model="config.siteDescription" type="textarea" :rows="4" placeholder="请输入网站描述" />
            </el-form-item>
            <el-form-item label="网站关键词">
              <el-input v-model="config.siteKeywords" placeholder="多个关键词用逗号分隔" />
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="config.copyright" placeholder="如：© 2026 铸牢中华民族共同体意识" />
            </el-form-item>
            <el-form-item label="ICP备案号">
              <el-input v-model="config.icp" placeholder="请输入ICP备案号" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 联系方式 -->
        <el-tab-pane label="联系方式" name="contact">
          <el-form :model="config" label-width="120px" style="max-width: 800px;">
            <el-form-item label="联系电话">
              <el-input v-model="config.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="config.email" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="联系地址">
              <el-input v-model="config.address" placeholder="请输入联系地址" />
            </el-form-item>
            <el-form-item label="官方微信">
              <el-input v-model="config.wechat" placeholder="请输入微信号" />
            </el-form-item>
            <el-form-item label="官方微博">
              <el-input v-model="config.weibo" placeholder="请输入微博地址" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 功能设置 -->
        <el-tab-pane label="功能设置" name="features">
          <el-form :model="config" label-width="150px" style="max-width: 800px;">
            <el-form-item label="是否开启注册">
              <el-switch v-model="config.enableRegister" />
              <span class="form-tip">关闭后用户无法自行注册账号</span>
            </el-form-item>
            <el-form-item label="是否开启评论">
              <el-switch v-model="config.enableComment" />
              <span class="form-tip">关闭后用户无法发表评论</span>
            </el-form-item>
            <el-form-item label="评论需要审核">
              <el-switch v-model="config.commentNeedAudit" :disabled="!config.enableComment" />
              <span class="form-tip">开启后评论需要审核通过才能显示</span>
            </el-form-item>
            <el-form-item label="上传文件大小限制">
              <el-input-number v-model="config.uploadMaxSize" :min="1" :max="100" />
              <span class="form-tip" style="margin-left: 10px;">单位：MB</span>
            </el-form-item>
            <el-form-item label="允许上传的格式">
              <el-checkbox-group v-model="config.uploadFormats">
                <el-checkbox label="jpg">JPG</el-checkbox>
                <el-checkbox label="png">PNG</el-checkbox>
                <el-checkbox label="gif">GIF</el-checkbox>
                <el-checkbox label="pdf">PDF</el-checkbox>
                <el-checkbox label="doc">DOC</el-checkbox>
                <el-checkbox label="docx">DOCX</el-checkbox>
                <el-checkbox label="xls">XLS</el-checkbox>
                <el-checkbox label="xlsx">XLSX</el-checkbox>
                <el-checkbox label="zip">ZIP</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否开启水印">
              <el-switch v-model="config.enableWatermark" />
              <span class="form-tip">开启后上传的图片自动添加水印</span>
            </el-form-item>
            <el-form-item label="水印文字" v-if="config.enableWatermark">
              <el-input v-model="config.watermarkText" placeholder="请输入水印文字" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- SEO设置 -->
        <el-tab-pane label="SEO设置" name="seo">
          <el-form :model="config" label-width="150px" style="max-width: 800px;">
            <el-form-item label="首页标题模板">
              <el-input v-model="config.seoTitleTemplate" placeholder="如：{title} - {siteName}" />
              <div class="form-tip">可用变量：{title} 页面标题, {siteName} 网站名称</div>
            </el-form-item>
            <el-form-item label="百度统计代码">
              <el-input v-model="config.baiduAnalytics" type="textarea" :rows="3" placeholder="请粘贴百度统计代码" />
            </el-form-item>
            <el-form-item label="Google Analytics">
              <el-input v-model="config.googleAnalytics" placeholder="请输入Google Analytics ID" />
            </el-form-item>
            <el-form-item label="站点地图自动生成">
              <el-switch v-model="config.autoSitemap" />
              <span class="form-tip">开启后系统自动生成sitemap.xml</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置" name="email">
          <el-form :model="config" label-width="150px" style="max-width: 800px;">
            <el-form-item label="SMTP服务器">
              <el-input v-model="config.smtpHost" placeholder="如：smtp.example.com" />
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input-number v-model="config.smtpPort" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="config.smtpUser" placeholder="请输入发件人邮箱" />
            </el-form-item>
            <el-form-item label="邮箱密码">
              <el-input v-model="config.smtpPassword" type="password" placeholder="请输入邮箱密码或授权码" show-password />
            </el-form-item>
            <el-form-item label="发件人名称">
              <el-input v-model="config.smtpFromName" placeholder="请输入发件人名称" />
            </el-form-item>
            <el-form-item label="启用SSL">
              <el-switch v-model="config.smtpSsl" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleTestEmail">发送测试邮件</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form :model="config" label-width="180px" style="max-width: 800px;">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="config.passwordMinLength" :min="6" :max="20" />
              <span class="form-tip" style="margin-left: 10px;">字符</span>
            </el-form-item>
            <el-form-item label="密码必须包含数字">
              <el-switch v-model="config.passwordRequireNumber" />
            </el-form-item>
            <el-form-item label="密码必须包含大写字母">
              <el-switch v-model="config.passwordRequireUppercase" />
            </el-form-item>
            <el-form-item label="密码必须包含特殊字符">
              <el-switch v-model="config.passwordRequireSpecial" />
            </el-form-item>
            <el-form-item label="登录失败锁定阈值">
              <el-input-number v-model="config.loginFailThreshold" :min="3" :max="10" />
              <span class="form-tip" style="margin-left: 10px;">次失败后锁定账号</span>
            </el-form-item>
            <el-form-item label="账号锁定时长">
              <el-input-number v-model="config.lockDuration" :min="5" :max="1440" />
              <span class="form-tip" style="margin-left: 10px;">分钟</span>
            </el-form-item>
            <el-form-item label="Session超时时间">
              <el-input-number v-model="config.sessionTimeout" :min="10" :max="1440" />
              <span class="form-tip" style="margin-left: 10px;">分钟</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const config = reactive({
  // 基本信息
  siteName: '铸牢中华民族共同体意识后台管理系统',
  siteTitle: '铸牢中华民族共同体意识 - 后台管理系统',
  siteLogo: '',
  siteDescription: '铸牢中华民族共同体意识宣传教育平台，致力于推动民族团结进步事业发展。',
  siteKeywords: '民族团结,共同体意识,民族工作,文化传承',
  copyright: '© 2026 铸牢中华民族共同体意识',
  icp: '',

  // 联系方式
  phone: '010-12345678',
  email: 'contact@example.com',
  address: '北京市某区某街道某号',
  wechat: '',
  weibo: '',

  // 功能设置
  enableRegister: false,
  enableComment: true,
  commentNeedAudit: true,
  uploadMaxSize: 10,
  uploadFormats: ['jpg', 'png', 'pdf', 'doc', 'docx'],
  enableWatermark: false,
  watermarkText: '铸牢中华民族共同体意识',

  // SEO设置
  seoTitleTemplate: '{title} - {siteName}',
  baiduAnalytics: '',
  googleAnalytics: '',
  autoSitemap: true,

  // 邮件设置
  smtpHost: '',
  smtpPort: 465,
  smtpUser: '',
  smtpPassword: '',
  smtpFromName: '铸牢中华民族共同体意识',
  smtpSsl: true,

  // 安全设置
  passwordMinLength: 8,
  passwordRequireNumber: true,
  passwordRequireUppercase: false,
  passwordRequireSpecial: false,
  loginFailThreshold: 5,
  lockDuration: 30,
  sessionTimeout: 120
})

const handleLogoChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    config.siteLogo = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleSave = () => {
  ElMessage.success('配置保存成功')
}

const handleTestEmail = () => {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) {
    ElMessage.warning('请先填写完整的邮件配置')
    return
  }
  ElMessage.success('测试邮件已发送，请检查收件箱')
}
</script>

<style lang="scss" scoped>
.config-container {
  .config-card {
    border-radius: 8px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-title {
        font-weight: bold;
        font-size: 18px;
      }
    }
  }

  .logo-upload {
    .logo-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 10px;
      display: block;
    }

    .tip {
      margin-top: 8px;
      font-size: 12px;
      color: #999;
    }
  }

  .form-tip {
    margin-left: 10px;
    font-size: 13px;
    color: #909399;
  }

  :deep(.el-tabs--border-card) {
    box-shadow: none;
    border: 1px solid #e4e7ed;
  }

  :deep(.el-tabs__content) {
    padding: 20px;
  }
}
</style>
