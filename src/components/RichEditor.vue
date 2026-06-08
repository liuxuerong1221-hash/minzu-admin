<template>
  <div class="rich-editor" style="border: 1px solid #dcdfe6; border-radius: 4px; overflow: hidden;">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #dcdfe6;"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      :style="{ height: height, overflowY: 'hidden' }"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '400px'
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  mode: {
    type: String,
    default: 'default' // default 或 simple
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容HTML
const valueHtml = ref(props.modelValue)

// 监听外部值变化（如编辑模式回填）
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal
    }
  }
)

// 工具栏配置
const toolbarConfig = {
  excludeKeys: [
    'fullScreen'
  ]
}

// 编辑器配置
const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {
    // 图片上传配置（演示版本：转base64）
    uploadImage: {
      // 自定义上传：将图片转为base64插入
      customUpload(file, insertFn) {
        const reader = new FileReader()
        reader.onload = (e) => {
          insertFn(e.target.result, file.name, e.target.result)
        }
        reader.readAsDataURL(file)
      }
    },
    // 视频上传配置
    uploadVideo: {
      // 自定义上传：将视频转为base64插入（注意：视频文件较大，实际应用建议上传到服务器）
      customUpload(file, insertFn) {
        // 限制视频大小为50MB
        const maxSize = 50 * 1024 * 1024
        if (file.size > maxSize) {
          alert('视频文件不能超过50MB')
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          insertFn(e.target.result, file.name)
        }
        reader.readAsDataURL(file)
      }
    },
    // 插入视频配置
    insertVideo: {
      // 校验视频链接
      checkVideo: (src) => {
        if (!src) return
        if (src.indexOf('http') !== 0) {
          return '视频地址必须以 http/https 开头'
        }
        return true
      },
      // 转换视频链接
      parseVideoSrc: (src) => {
        return src
      }
    }
  }
}

// 编辑器创建完成
const handleCreated = (editor) => {
  editorRef.value = editor
}

// 内容变化
const handleChange = (editor) => {
  const html = editor.getHtml()
  emit('update:modelValue', html)
  emit('change', html)
}

// 组件销毁时销毁编辑器，避免内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped>
.rich-editor {
  width: 100%;
}
</style>
