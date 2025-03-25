<template>
  <BaseCard 
    :size="size" 
    type="editable" 
    title="快速笔记"
    class="card-note"
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
  background: rgba(255, 159, 10, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 10px 30px rgba(255, 159, 10, 0.12),
    0 5px 15px rgba(255, 159, 10, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4) !important;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
}

/* 笔记卡片使用橙色系渐变文本 */
:deep(.card-header) h3 {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

/* 笔记文本特殊处理 - 确保使用深色 */
:deep(.card) textarea {
  color: rgba(0, 0, 0, 0.85) !important;
  background: transparent !important; /* 确保文本区域背景透明 */
}

/* 文本区域本身的样式，确保优先级高 */
textarea {
  width: 100%;
  height: calc(100% - 10px);
  border: none;
  resize: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85) !important;
  line-height: 23px;
  font-family: inherit;
  position: relative;
  z-index: 10 !important;
  padding: 16px 18px;
  letter-spacing: -0.01em;
  font-weight: 500;
  background: transparent !important;
  margin-top: 5px;
}

/* 笔记卡片特殊处理 - 覆盖全局文本颜色 */
:deep(.card) textarea {
  color: rgba(0, 0, 0, 0.85) !important;
}

/* 白色半透明背景区域以提高文本可读性 */
:deep(.card-content)::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1;
}

/* 笔记背景线条 */
:deep(.card-content) {
  position: relative;
  background: none;
  overflow: auto;
}

:deep(.card-content)::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: repeating-linear-gradient(
    transparent, 
    transparent 22px, 
    rgba(0, 0, 0, 0.04) 22px, 
    rgba(0, 0, 0, 0.04) 23px
  );
  z-index: 2;
  pointer-events: none;
  border-radius: 16px;
}

textarea::placeholder {
  color: rgba(0, 0, 0, 0.4) !important;
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
    rgba(255, 159, 10, 0.1),
    transparent 80%);
  z-index: 1;
}

/* 尺寸特定样式 */
textarea.small {
  font-size: 13px;
  padding: 15px;
}

textarea.medium {
  height: calc(100% - 15px);
  padding: 16px;
}

textarea.large {
  font-size: 15px;
  padding: 18px;
}

/* 添加装饰元素 */
:deep(.card-large)::before {
  content: '📝';
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 24px;
  opacity: 0.3;
  z-index: 11;
  transform: rotate(-15deg);
}
</style>
