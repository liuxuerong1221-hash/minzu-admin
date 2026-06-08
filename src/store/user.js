import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const name = ref(userInfo.value.name || '')
  const avatar = ref(userInfo.value.avatar || '')
  const roles = ref(userInfo.value.roles || [])

  // 登录
  const login = async (loginForm) => {
    // 模拟登录验证
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      const mockToken = 'mock-token-' + Date.now()
      const mockUserInfo = {
        id: 1,
        username: 'admin',
        name: '系统管理员',
        avatar: '',
        roles: ['admin'],
        permissions: ['*:*:*']
      }

      token.value = mockToken
      userInfo.value = mockUserInfo
      name.value = mockUserInfo.name
      avatar.value = mockUserInfo.avatar
      roles.value = mockUserInfo.roles

      localStorage.setItem('token', mockToken)
      localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))

      return mockUserInfo
    } else {
      throw new Error('用户名或密码错误')
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    name.value = ''
    avatar.value = ''
    roles.value = []

    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 获取用户信息
  const getUserInfo = async () => {
    // 模拟获取用户信息
    return userInfo.value
  }

  return {
    token,
    userInfo,
    name,
    avatar,
    roles,
    login,
    logout,
    getUserInfo
  }
})
