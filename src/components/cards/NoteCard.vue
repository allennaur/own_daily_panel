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
:deep(.card) {
  background: linear-gradient(
    135deg,
    rgba(191, 90, 242, 0.1),
    rgba(175, 82, 222, 0.15)
  ) !important;
  position: relative;
}

:deep(.card-content)::before {
  content: '';
  position: absolute;
  top: 45px; /* 标题栏下方开始 */
  right: 0;
  bottom: 0;
  left: 0;
  background: repeating-linear-gradient(transparent, transparent 21px, rgba(0, 0, 0, 0.02) 21px, rgba(0, 0, 0, 0.02) 22px);
  pointer-events: none;
}

textarea {
  width: 100%;
  height: calc(100% - 10px);
  border: none;
  background: transparent;
  resize: none;
  font-size: 13px;
  color: var(--visionos-text);
  line-height: 22px; /* 与背景线条匹配 */
  font-family: inherit;
  position: relative;
  z-index: 1;
  padding: 0;
  letter-spacing: -0.01em;
}

textarea::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

textarea:focus {
  outline: none;
}

/* 尺寸特定样式 */
textarea.small {
  font-size: 12px;
  height: 60px;
}

textarea.medium {
  height: 70px;
}

textarea.large {
  height: 100%;
  font-size: 14px;
}
</style>
