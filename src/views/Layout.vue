<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '240px'" class="sidebar">
      <div class="logo-container" :class="{ collapse: isCollapse }">
        <el-icon v-if="isCollapse" :size="28" color="#A70101"><Stamp /></el-icon>
        <template v-else>
          <el-icon :size="32" color="#A70101"><Stamp /></el-icon>
          <span class="logo-text">民族共同体</span>
        </template>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
      >
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
            <template #title>
              <el-icon><component :is="route.meta.icon" /></el-icon>
              <span>{{ route.meta.title }}</span>
            </template>
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="route.path + '/' + child.path"
            >
              <el-icon><component :is="child.meta.icon" /></el-icon>
              <span>{{ child.meta.title }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="route.path">
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="navbar">
        <div class="navbar-left">
          <el-icon class="collapse-icon" @click="toggleCollapse" :size="20">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>

          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="item in breadcrumbs"
              :key="item.path"
              :to="item.path === '' ? undefined : { path: item.path }"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="navbar-right">
          <el-badge :value="3" class="badge-item">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>

          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="content-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)

// 菜单路由配置
const menuRoutes = computed(() => {
  return [
    {
      path: '/dashboard',
      meta: { title: '数据概览', icon: 'PieChart' }
    },
    {
      path: '/articles',
      meta: { title: '时政要闻', icon: 'Notification' },
      children: [
        { path: 'list', meta: { title: '文章列表', icon: 'List' } },
        { path: 'create', meta: { title: '新建文章', icon: 'EditPen' } }
      ]
    },
    {
      path: '/culture',
      meta: { title: '文化传承', icon: 'Brush' },
      children: [
        { path: 'list', meta: { title: '内容列表', icon: 'List' } },
        { path: 'create', meta: { title: '新建内容', icon: 'EditPen' } },
        { path: 'categories', meta: { title: '类别管理', icon: 'FolderOpened' } }
      ]
    },
    {
      path: '/persons',
      meta: { title: '典型引领', icon: 'Medal' },
      children: [
        { path: 'list', meta: { title: '人物列表', icon: 'List' } },
        { path: 'create', meta: { title: '新建人物', icon: 'UserFilled' } }
      ]
    },
    {
      path: '/practice',
      meta: { title: '实践育人', icon: 'Suitcase' },
      children: [
        { path: 'campus/list', meta: { title: '校园实践', icon: 'School' } },
        { path: 'social/list', meta: { title: '社会实践', icon: 'OfficeBuilding' } }
      ]
    },
    {
      path: '/messages',
      meta: { title: '交流互动', icon: 'ChatDotRound' }
    },
    {
      path: '/resources',
      meta: { title: '资源中心', icon: 'Folder' }
    },
    {
      path: '/audit',
      meta: { title: '审核管理', icon: 'Stamp' }
    },
    {
      path: '/system',
      meta: { title: '系统管理', icon: 'Setting' },
      children: [
        { path: 'users', meta: { title: '用户管理', icon: 'User' } },
        { path: 'roles', meta: { title: '角色管理', icon: 'Avatar' } },
        { path: 'config', meta: { title: '网站配置', icon: 'Tools' } }
      ]
    }
  ]
})

// 当前激活菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title
  }))
})

// 切换侧边栏折叠
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 下拉菜单命令处理
const handleCommand = async (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
      ElMessage.success('已退出登录')
    }).catch(() => {})
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中...')
  } else if (command === 'settings') {
    ElMessage.info('系统设置功能开发中...')
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  display: flex;
}

.sidebar {
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
  overflow-x: hidden;

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    transition: all 0.3s;

    .logo-text {
      font-size: 18px;
      font-weight: bold;
      color: #A70101;
      white-space: nowrap;
    }

    &.collapse {
      padding: 0;
    }
  }

  .sidebar-menu {
    border: none;
    height: calc(100vh - 60px);
    overflow-y: auto;

    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      &:hover {
        background-color: rgba(167, 1, 1, 0.05) !important;
      }
    }

    :deep(.el-menu-item.is-active) {
      background-color: rgba(167, 1, 1, 0.1) !important;
      color: #A70101 !important;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: #A70101;
      }
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.navbar {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-icon {
      cursor: pointer;
      color: #666;
      transition: color 0.3s;

      &:hover {
        color: #A70101;
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .badge-item {
      cursor: pointer;
      color: #666;
      transition: color 0.3s;

      &:hover {
        color: #A70101;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background 0.3s;

      .username {
        font-size: 14px;
        color: #333;
      }

      &:hover {
        background: rgba(167, 1, 1, 0.05);
      }
    }
  }
}

.content-main {
  padding: 20px;
  overflow-y: auto;
}

// 过渡动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
