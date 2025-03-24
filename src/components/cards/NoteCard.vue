<template>
  <BaseCard 
    :size="size" 
    type="editable" 
    title="快速笔记"
    @context-menu="$emit('context-menu', $event)">
    
    <textarea 
      v-model="noteText" 
      placeholder="在这里记录一些想法..." 
      @input="updateNote"
      :class="size"></textarea>
  </BaseCard>
</template>

<script>
import BaseCard from './BaseCard.vue';

export default {
  name: 'NoteCard',
  components: { BaseCard },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    initialNote: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      noteText: this.initialNote
    };
  },
  methods: {
    updateNote() {
      this.$emit('update:note', this.noteText);
    }
  }
}
</script>

<style scoped>
/* 笔记卡片使用橙色主题 */
:deep(.card) {
  background: linear-gradient(135deg,
    rgba(255, 159, 10, 0.95),
    rgba(255, 122, 0, 0.9)
  ) !important;
  /* 修改默认文字颜色以提高可读性 */
  color: rgba(0, 0, 0, 0.8) !important;
  position: relative;
  overflow: hidden;
}

/* 标题使用白色 */
:deep(.card-header) h3 {
  color: #ffffff !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  z-index: 5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 笔记文本使用深色 */
textarea {
  width: 100%;
  height: calc(100% - 10px);
  border: none;
  background: transparent;
  resize: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85) !important; /* 改为深色文本以提高可读性 */
  line-height: 22px; /* 与背景线条匹配 */
  font-family: inherit;
  position: relative;
  z-index: 10 !important; /* 确保文本始终在顶层 */
  padding: 0;
  letter-spacing: -0.01em;
  font-weight: 500; /* 稍微加粗以提高可读性 */
}

/* 白色半透明背景区域以提高文本可读性 */
:deep(.card-content)::before {
  content: '';
  position: absolute;
  top: 45px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  z-index: 1;
}

/* 笔记背景线条 */
:deep(.card-content) {
  position: relative;
  background: repeating-linear-gradient(transparent, transparent 21px, rgba(0, 0, 0, 0.05) 21px, rgba(0, 0, 0, 0.05) 22px);
}

textarea::placeholder {
  color: rgba(51, 51, 51, 0.6) !important; /* 深色占位符 */
  font-style: italic;
}

/* 提高选择器权重 */
:deep(.card) {
  background: linear-gradient(135deg,
    rgba(255, 159, 10, 0.95),
    rgba(255, 122, 0, 0.9)
  ) !important; /* 增强背景颜色 */
  /* 修改默认文字颜色以提高可读性 */
  color: rgba(0, 0, 0, 0.8) !important;
  position: relative;
  overflow: hidden;
}

:deep(.card)::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0 0 0 80px;
  z-index: 1;
}

:deep(.card-content)::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 45px; /* 标题栏下方开始 */
  background: repeating-linear-gradient(transparent, transparent 21px, rgba(0, 0, 0, 0.03) 21px, rgba(0, 0, 0, 0.03) 22px);
  pointer-events: none;
  z-index: 2;
}

/* 强制控制标题文字颜色 */
:deep(.card-header) h3 {
  color: white !important; /* 保持标题为白色 */
  font-weight: 600 !important; /* 加粗标题 */
  letter-spacing: -0.01em;
  z-index: 5;
}

/* 笔记文本区域修改 */
textarea {
  width: 100%;
  height: calc(100% - 10px);
  border: none;
  background: transparent;
  resize: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85) !important; /* 改为深色文本以提高可读性 */
  line-height: 22px; /* 与背景线条匹配 */
  font-family: inherit;
  position: relative;
  z-index: 10 !important; /* 确保文本始终在顶层 */
  padding: 0;
  letter-spacing: -0.01em;
}

textarea::placeholder {
  color: rgba(0, 0, 0, 0.5) !important; /* 改为深色占位符 */
  font-style: italic;
}

textarea:focus {
  outline: none;
}

/* 仿便签效果 */
:deep(.card-content)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.15),
    transparent 80%);
  z-index: 1;
}

/* 尺寸特定样式 */
textarea.small {
  font-size: 13px;
  height: 60px;
  padding-left: 5px;
}

textarea.medium {
  height: 70px;
  padding-left: 10px;
  font-size: 13.5px;
}

textarea.large {
  height: 100%;
  font-size: 15px;
  padding-left: 15px;
  line-height: 24px;
}

/* 添加装饰元素 */
:deep(.card-large)::after {
  content: '📝';
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 24px;
  opacity: 0.5;
  z-index: 2;
  transform: rotate(-15deg);
}
</style>
