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
  background: linear-gradient(135deg,
    rgba(255, 159, 10, 0.95),
    rgba(255, 122, 0, 0.9)
  ) !important;
  position: relative;
  overflow: hidden;
}

/* 笔记卡片使用橙色系渐变文本 */
:deep(.card-header) h3 {
  background: linear-gradient(135deg, #ff9f0a, #ff7a00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  letter-spacing: -0.01em;
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
  color: #cc6600;
  line-height: 22px;
  font-family: inherit;
  position: relative;
  z-index: 10 !important;
  padding: 0;
  letter-spacing: -0.01em;
  font-weight: 500;
  background: transparent;
}

/* 笔记卡片特殊处理 - 覆盖全局文本颜色 */
:deep(.card) textarea {
  color: rgba(0, 0, 0, 0.85) !important;
}

/* 白色半透明背景区域以提高文本可读性 */
:deep(.card-content)::before {
  content: '';
  position: absolute;
  top: 45px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.4); /* 增加背景不透明度以提高可读性 */
  border-radius: 12px;
  z-index: 1;
}

/* 笔记背景线条 */
:deep(.card-content) {
  position: relative;
  background: repeating-linear-gradient(transparent, transparent 21px, rgba(255, 159, 10, 0.1) 21px, rgba(255, 159, 10, 0.1) 22px);
}

textarea::placeholder {
  color: rgba(255, 159, 10, 0.5);
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
  height: 60px;
  padding-left: 5px;
  color: #cc6600;
}

textarea.medium {
  height: 70px;
  padding-left: 10px;
  font-size: 13.5px;
  color: #cc6600;
}

textarea.large {
  height: 100%;
  font-size: 15px;
  padding-left: 15px;
  line-height: 24px;
  color: #cc6600;
}

/* 添加装饰元素 */
:deep(.card-large)::before {
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
