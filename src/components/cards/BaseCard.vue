<template>
  <div 
    :class="['card', cardTypeClass, cardSizeClass]" 
    ref="card"
    @contextmenu="handleCardContextMenu">
    <!-- 卡片头部 -->
    <div 
      v-if="showHeader" 
      class="card-header" 
      @contextmenu="handleHeaderContextMenu">
      <h3><slot name="header-title">{{ title }}</slot></h3>
      <slot name="header-actions"></slot>
    </div>
    
    <!-- 卡片内容 -->
    <div :class="['card-content', size, { 'no-header': !showHeader }]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    // 卡片尺寸：小(1x1)、中(2x1)、大(2x2)
    size: {
      type: String,
      default: 'small',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    // 卡片类型：只读(整卡右键菜单)或可编辑(仅头部右键菜单)
    type: {
      type: String,
      default: 'readonly',
      validator: (value) => ['readonly', 'editable'].includes(value)
    },
    // 是否显示标题栏
    showHeader: {
      type: Boolean,
      default: true
    },
    // 卡片标题
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    cardSizeClass() {
      return `card-${this.size}`;
    },
    cardTypeClass() {
      return `card-${this.type}`;
    }
  },
  mounted() {
    // 延迟设置卡片效果，确保DOM已完全挂载
    this.$nextTick(() => {
      this.setupCardEffect();
    });
  },
  methods: {
    setupCardEffect() {
      const card = this.$refs.card;
      if (!card) return;
      
      // 基础交互效果
      card.addEventListener('mouseenter', this.handleMouseEnter);
      card.addEventListener('mousemove', this.handleMouseMove);
      card.addEventListener('mouseleave', this.handleMouseLeave);
    },
    
    handleMouseEnter(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.2s ease-out';
    },
    
    handleMouseMove(e) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const cardMoveX = (e.clientX - cardCenterX) / (rect.width / 2) * 5;
      const cardMoveY = (e.clientY - cardCenterY) / (rect.height / 2) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${-cardMoveY}deg) rotateY(${cardMoveX}deg)`;
    },
    
    handleMouseLeave(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    },
    
    // 右键菜单处理 - 根据卡片类型决定行为
    handleCardContextMenu(e) {
      // 只有只读卡片允许整卡右键菜单
      if (this.type === 'readonly') {
        e.preventDefault();
        this.$emit('context-menu', e);
      }
    },
    
    // 标题区域右键菜单 - 所有卡片类型都可用
    handleHeaderContextMenu(e) {
      e.preventDefault();
      this.$emit('context-menu', e);
    },
    
    // 切换卡片尺寸
    changeSize(newSize) {
      this.$emit('size-change', newSize);
    }
  },
  beforeUnmount() {
    const card = this.$refs.card;
    if (card) {
      card.removeEventListener('mouseenter', this.handleMouseEnter);
      card.removeEventListener('mousemove', this.handleMouseMove);
      card.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }
}
</script>

<style scoped>
/* 基础卡片样式 - 透明背景，美观边框 */
.card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6); /* 轻微的白色背景，提供对比度 */
  backdrop-filter: blur(15px); /* 毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.03),
    0 1px 6px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;
  transition: all 0.3s ease;
}

/* 卡片悬停效果 */
.card:hover {
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

/* 卡片悬停光效 */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1), 
    rgba(255, 255, 255, 0.8), 
    rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}

/* 卡片类型样式 */
.card-readonly {
  cursor: context-menu; /* 提示右键菜单可用 */
}

.card-editable .card-header {
  cursor: context-menu; /* 只在标题栏显示上下文菜单提示 */
}

/* 卡片标题栏 - 精致设计 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 10;
}

.card-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.01em;
  color: rgba(0, 0, 0, 0.75);
}

/* 卡片内容区域 */
.card-content {
  padding: 14px;
  height: calc(100% - 45px);
  position: relative;
  z-index: 5;
}

/* 无标题栏卡片的内容区域 */
.card-content.no-header {
  height: 100%;
}

/* 不同尺寸内容样式 */
.card-content.small {
  padding: 10px;
}

.card-content.medium {
  padding: 12px;
}

.card-content.large {
  padding: 16px;
}
</style>
