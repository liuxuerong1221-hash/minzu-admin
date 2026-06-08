<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-pattern"></div>
    </div>

    <!-- 登录表单 -->
    <div class="login-box">
      <!-- 顶部标题区 -->
      <div class="login-header">
        <div class="logo-area">
          <div class="logo-icon">
            <el-icon :size="48" color="#A70101"><Stamp /></el-icon>
          </div>
        </div>
        <h1 class="title">铸牢中华民族共同体意识</h1>
        <p class="subtitle">后台管理系统</p>
      </div>

      <!-- 表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 底部提示 -->
      <div class="login-footer">
        <p class="tips">
          <el-icon><InfoFilled /></el-icon>
          <span>默认账号密码：admin / 123456</span>
        </p>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <p>© 2026 铸牢中华民族共同体意识网站 版权所有</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  remember: true
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true

    try {
      // 模拟登录延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 调用store登录方法
      await userStore.login(loginForm)

      ElMessage.success('登录成功')
      router.push('/')
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #A70101 0%, #8B0000 50%, #6B0000 100%);
}

.login-bg {
  position: absolute;
  width: 100%;
  height: 100%;

  .bg-pattern {
    width: 100%;
    height: 100%;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 100px,
        rgba(255, 255, 255, 0.03) 100px,
        rgba(255, 255, 255, 0.03) 200px
      );
    animation: move 20s linear infinite;
  }
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 200px 200px;
  }
}

.login-box {
  position: relative;
  z-index: 1;
  width: 450px;
  padding: 50px 40px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-area {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .logo {
      height: 60px;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #A70101 0%, #8B0000 100%);
      border-radius: 50%;
      box-shadow: 0 8px 20px rgba(167, 1, 1, 0.3);
    }
  }

  .title {
    font-size: 28px;
    font-weight: bold;
    color: #A70101;
    margin-bottom: 8px;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 16px;
    color: #666;
    font-weight: 500;
  }
}

.login-form {
  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;
  }
}

.login-footer {
  margin-top: 20px;

  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #999;
    font-size: 14px;
  }
}

.copyright {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  z-index: 1;
}
</style>
