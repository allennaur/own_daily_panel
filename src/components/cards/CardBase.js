// 创建一个可复用的卡片效果混入

export const CardEffectMixin = {
  props: {
    size: {
      type: String,
      default: 'small', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    cardSizeClass() {
      return `card-${this.size}`;
    }
  },
  methods: {
    setupCardEffect(card) {
      if (!card) return;
      
      card.addEventListener('mouseenter', this.handleCardMouseEnter);
      card.addEventListener('mousemove', this.handleCardMouseMove);
      card.addEventListener('mouseleave', this.handleCardMouseLeave);
      
      // 下面这行代码根据具体组件决定是否需要
      // card.addEventListener('contextmenu', this.handleContextMenu);
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
    
    // 更新右键处理方法以接受不同的元素来源
    handleContextMenu(e) {
      // 触发上下文菜单事件
      this.$emit('context-menu', e);
    },
    
    changeSize(newSize) {
      this.$emit('size-change', newSize);
    }
  },
  beforeUnmount() {
    const card = this.$refs.card;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
      // card.removeEventListener('contextmenu', this.handleContextMenu);
    }
  }
};
