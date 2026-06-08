import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据概览', icon: 'DataAnalysis' }
      },
      // 时政要闻
      {
        path: 'articles',
        name: 'Articles',
        redirect: '/articles/list',
        meta: { title: '时政要闻', icon: 'Document' },
        children: [
          {
            path: 'list',
            name: 'ArticleList',
            component: () => import('@/views/articles/List.vue'),
            meta: { title: '文章列表', icon: 'List' }
          },
          {
            path: 'create',
            name: 'ArticleCreate',
            component: () => import('@/views/articles/Create.vue'),
            meta: { title: '新建文章', icon: 'EditPen' }
          },
          {
            path: 'edit/:id',
            name: 'ArticleEdit',
            component: () => import('@/views/articles/Create.vue'),
            meta: { title: '编辑文章', icon: 'EditPen', hidden: true }
          },
          {
            path: 'detail/:id',
            name: 'ArticleDetail',
            component: () => import('@/views/articles/Detail.vue'),
            meta: { title: '文章详情', icon: 'View', hidden: true }
          },
          {
            path: 'categories',
            name: 'ArticleCategories',
            component: () => import('@/views/articles/Categories.vue'),
            meta: { title: '分类管理', icon: 'FolderOpened' }
          }
        ]
      },
      // 典型引领
      {
        path: 'persons',
        name: 'Persons',
        redirect: '/persons/list',
        meta: { title: '典型引领', icon: 'User' },
        children: [
          {
            path: 'list',
            name: 'PersonList',
            component: () => import('@/views/persons/List.vue'),
            meta: { title: '人物列表', icon: 'List' }
          },
          {
            path: 'create',
            name: 'PersonCreate',
            component: () => import('@/views/persons/Create.vue'),
            meta: { title: '新建人物', icon: 'UserFilled' }
          },
          {
            path: 'edit/:id',
            name: 'PersonEdit',
            component: () => import('@/views/persons/Create.vue'),
            meta: { title: '编辑人物', icon: 'UserFilled', hidden: true }
          },
          {
            path: 'detail/:id',
            name: 'PersonDetail',
            component: () => import('@/views/persons/Detail.vue'),
            meta: { title: '人物详情', icon: 'View', hidden: true }
          }
        ]
      },
      // 文化传承
      {
        path: 'culture',
        name: 'Culture',
        redirect: '/culture/list',
        meta: { title: '文化传承', icon: 'Reading' },
        children: [
          {
            path: 'list',
            name: 'CultureList',
            component: () => import('@/views/culture/List.vue'),
            meta: { title: '内容列表', icon: 'List' }
          },
          {
            path: 'create',
            name: 'CultureCreate',
            component: () => import('@/views/culture/Create.vue'),
            meta: { title: '新建内容', icon: 'EditPen' }
          },
          {
            path: 'edit/:id',
            name: 'CultureEdit',
            component: () => import('@/views/culture/Create.vue'),
            meta: { title: '编辑内容', icon: 'EditPen', hidden: true }
          },
          {
            path: 'detail/:id',
            name: 'CultureDetail',
            component: () => import('@/views/culture/Detail.vue'),
            meta: { title: '内容详情', icon: 'View', hidden: true }
          },
          {
            path: 'categories',
            name: 'CultureCategories',
            component: () => import('@/views/culture/Categories.vue'),
            meta: { title: '类别管理', icon: 'FolderOpened' }
          }
        ]
      },
      // 实践育人
      {
        path: 'practice',
        name: 'Practice',
        redirect: '/practice/campus/list',
        meta: { title: '实践育人', icon: 'Calendar' },
        children: [
          // 校园实践
          {
            path: 'campus/list',
            name: 'CampusPracticeList',
            component: () => import('@/views/practice/campus/List.vue'),
            meta: { title: '校园实践', icon: 'School' }
          },
          {
            path: 'campus/create',
            name: 'CampusPracticeCreate',
            component: () => import('@/views/practice/campus/Create.vue'),
            meta: { title: '新建校园实践', icon: 'EditPen', hidden: true }
          },
          {
            path: 'campus/edit/:id',
            name: 'CampusPracticeEdit',
            component: () => import('@/views/practice/campus/Create.vue'),
            meta: { title: '编辑校园实践', icon: 'EditPen', hidden: true }
          },
          {
            path: 'campus/detail/:id',
            name: 'CampusPracticeDetail',
            component: () => import('@/views/practice/campus/Detail.vue'),
            meta: { title: '校园实践详情', icon: 'View', hidden: true }
          },
          // 社会实践
          {
            path: 'social/list',
            name: 'SocialPracticeList',
            component: () => import('@/views/practice/social/List.vue'),
            meta: { title: '社会实践', icon: 'OfficeBuilding' }
          },
          {
            path: 'social/create',
            name: 'SocialPracticeCreate',
            component: () => import('@/views/practice/social/Create.vue'),
            meta: { title: '新建社会实践', icon: 'EditPen', hidden: true }
          },
          {
            path: 'social/edit/:id',
            name: 'SocialPracticeEdit',
            component: () => import('@/views/practice/social/Create.vue'),
            meta: { title: '编辑社会实践', icon: 'EditPen', hidden: true }
          },
          {
            path: 'social/detail/:id',
            name: 'SocialPracticeDetail',
            component: () => import('@/views/practice/social/Detail.vue'),
            meta: { title: '社会实践详情', icon: 'View', hidden: true }
          }
        ]
      },
      // 资源中心
      {
        path: 'resources',
        name: 'Resources',
        component: () => import('@/views/resources/Index.vue'),
        meta: { title: '资源中心', icon: 'FolderOpened' }
      },
      // 审核管理
      {
        path: 'audit',
        name: 'Audit',
        component: () => import('@/views/audit/Index.vue'),
        meta: { title: '审核管理', icon: 'DocumentChecked' }
      },
      // 系统管理
      {
        path: 'system',
        name: 'System',
        redirect: '/system/users',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: 'users',
            name: 'SystemUsers',
            component: () => import('@/views/system/Users.vue'),
            meta: { title: '用户管理', icon: 'User' }
          },
          {
            path: 'roles',
            name: 'SystemRoles',
            component: () => import('@/views/system/Roles.vue'),
            meta: { title: '角色管理', icon: 'Avatar' }
          },
          {
            path: 'config',
            name: 'SystemConfig',
            component: () => import('@/views/system/Config.vue'),
            meta: { title: '网站配置', icon: 'Tools' }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 铸牢中华民族共同体意识` : '铸牢中华民族共同体意识'

  // 白名单，不需要登录的页面
  const whiteList = ['/login']

  if (token) {
    // 已登录
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      ElMessage.warning('请先登录')
      next('/login')
    }
  }
})

export default router
