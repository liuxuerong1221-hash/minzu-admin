<template>
  <div class="page-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.to">
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const result = []

  // 遍历匹配的路由
  matched.forEach((item, index) => {
    result.push({
      path: item.path,
      title: item.meta.title,
      to: index === matched.length - 1 ? undefined : { path: item.path }
    })

    // 如果是最后一级且是新建/编辑/详情页，尝试插入列表页层级
    if (index === matched.length - 1) {
      const pathSegments = route.path.split('/').filter(Boolean)
      const lastSegment = pathSegments[pathSegments.length - 1]

      // 判断是否是新建/编辑/详情页
      if (['create', 'edit', 'detail'].some(key => lastSegment.includes(key))) {
        // 尝试找到列表页路由
        let listRoute = null

        // 从前一个父级的 children 中找列表页
        if (matched.length >= 2) {
          const parent = matched[matched.length - 2]
          if (parent.children) {
            listRoute = parent.children.find(child =>
              child.path === 'list' ||
              child.path === 'person' ||
              child.path === 'group' ||
              child.name?.toLowerCase().includes('list')
            )
          }
        }

        // 如果找到列表页，插入到最后一级之前
        if (listRoute && listRoute.meta?.title) {
          // 特殊处理：如果是典型引领，根据 query.type 判断是先进个人还是先进集体
          let listTitle = listRoute.meta.title
          let listPath = listRoute.path

          if (route.path.includes('/persons/')) {
            const type = route.query.type
            if (type === 'group') {
              // 先进集体
              const groupRoute = matched[matched.length - 2]?.children?.find(c => c.path === 'group')
              if (groupRoute) {
                listTitle = groupRoute.meta.title
                listPath = '/persons/group'
              }
            } else {
              // 先进个人
              const personRoute = matched[matched.length - 2]?.children?.find(c => c.path === 'person')
              if (personRoute) {
                listTitle = personRoute.meta.title
                listPath = '/persons/person'
              }
            }
          }

          // 插入列表页到倒数第二位
          result.splice(result.length - 1, 0, {
            path: listPath,
            title: listTitle,
            to: { path: listPath }
          })
        }
      }
    }
  })

  return result
})
</script>

<style lang="scss" scoped>
.page-breadcrumb {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
