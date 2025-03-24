// 创建一个可复用的卡片效果混入

export const CardEffectMixin = {
  props: {
    size: {
      type: String,
      default: 'small', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    // 添加一个属性用于标识卡片类型
    cardType: {
      type: String,
      default: 'readonly', // readonly 或 editable
      validator: (value) => ['readonly', 'editable'].includes(value)
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
      
      // 基础效果（所有卡片都需要）
      card.addEventListener('mouseenter', this.handleCardMouseEnter);
      card.addEventListener('mousemove', this.handleCardMouseMove);
      card.addEventListener('mouseleave', this.handleCardMouseLeave);
      
      // 只为只读卡片添加右键菜单事件（可编辑卡片在标题处理）
      if (this.cardType === 'readonly') {
        card.addEventListener('contextmenu', this.handleContextMenu);
      }
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
    
    // 统一的右键菜单处理方法
    handleContextMenu(e) {
      e.preventDefault();
      this.$emit('context-menu', e);
    },
    
    changeSize(newSize) {
      this.$emit('size-change', newSize);
    }
  },
  beforeUnmount() {
    const card = this.$refs.card || this.$el;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
      
      if (this.cardType === 'readonly') {
        card.removeEventListener('contextmenu', this.handleContextMenu);
      }
    }
  }
};
