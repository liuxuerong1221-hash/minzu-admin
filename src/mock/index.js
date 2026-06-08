import Mock from 'mockjs'

// 配置Mock
Mock.setup({
  timeout: '200-600'
})

// 登录接口
Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body)

  if (username === 'admin' && password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: Mock.Random.guid(),
        userInfo: {
          id: 1,
          username: 'admin',
          name: '系统管理员',
          avatar: '',
          roles: ['admin']
        }
      }
    }
  } else {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null
    }
  }
})

// 用户信息接口
Mock.mock('/api/user/info', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    id: 1,
    username: 'admin',
    name: '系统管理员',
    avatar: '',
    roles: ['admin'],
    permissions: ['*:*:*']
  }
})

// 统计数据接口
Mock.mock('/api/dashboard/stats', 'get', {
  code: 200,
  message: '获取成功',
  data: {
    totalViews: 126560,
    totalArticles: 1245,
    pendingAudit: 23,
    totalMessages: 89
  }
})

console.log('Mock data loaded')

export default Mock
