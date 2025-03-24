<template>
  <div :class="['card', 'notes-card', cardSizeClass]" ref="noteCard">
    <div class="card-header">
      <h3>快速笔记</h3>
    </div>
    <div :class="['card-content', size]">
      <textarea v-model="noteText" placeholder="在这里记录一些想法..." @input="updateNote"></textarea>
    </div>
  </div>
</template>

<script>
import { CardEffectMixin } from './CardBase.js';

export default {
  name: 'NoteCard',
  mixins: [CardEffectMixin],
  props: {
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
  mounted() {
    this.setupCardEffect(this.$refs.noteCard);
  },
  methods: {
    setupCardEffect(card) {
      if (!card) return;
      
      card.addEventListener('mouseenter', this.handleCardMouseEnter);
      card.addEventListener('mousemove', this.handleCardMouseMove);
      card.addEventListener('mouseleave', this.handleCardMouseLeave);
    },
    
    handleCardMouseEnter(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.2s ease-out';
    },
    
    handleCardMouseMove(e) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const cardMoveX = (e.clientX - cardCenterX) / (rect.width / 2) * 5;
      const cardMoveY = (e.clientY - cardCenterY) / (rect.height / 2) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${-cardMoveY}deg) rotateY(${cardMoveX}deg)`;
    },
    
    handleCardMouseLeave(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    },
    
    updateNote() {
      this.$emit('update:note', this.noteText);
    }
  },
  beforeUnmount() {
    const card = this.$refs.noteCard;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
    }
  }
}
</script>

<style scoped>
.notes-card {
  background: linear-gradient(
    135deg,
    rgba(191, 90, 242, 0.1),
    rgba(175, 82, 222, 0.15)
  ) !important;
  position: relative;
}

.notes-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: repeating-linear-gradient(transparent, transparent 21px, rgba(0, 0, 0, 0.02) 21px, rgba(0, 0, 0, 0.02) 22px);
  pointer-events: none;
}

textarea {
  width: 100%;
  height: 100px; /* 减小默认高度 (180px → 100px) */
  border: none;
  background: transparent;
  resize: none;
  font-size: 13px; /* 减小字体大小 (15px → 13px) */
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

/* 添加尺寸特定的样式 */
.card-content.small textarea {
  height: 60px; /* 减小高度 (100px → 60px) */
  font-size: 12px; /* 减小字体大小 */
}

.card-content.medium textarea {
  height: 70px; /* 减小高度 (100px → 70px) */
}

.card-content.large textarea {
  height: 160px; /* 减小高度 (300px → 160px) */
  font-size: 14px; /* 减小字体大小 (16px → 14px) */
}
</style>
