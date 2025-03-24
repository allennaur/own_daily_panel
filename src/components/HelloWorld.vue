<template>
  <div class="hello">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="logo-title-container">
        <div class="logo">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"></path>
            <circle cx="12" cy="12" r="5" fill="currentColor"></circle>
          </svg>
        </div>
        <h1 class="title">每日面板</h1>
      </div>
      
      <button class="fullscreen-btn" @click="toggleFullscreen">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path v-if="!isFullscreen" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
          <path v-else d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="bento-container" ref="bentoContainer">
        <!-- 时间日期卡片 -->
        <TimeCard 
          :time="currentTime" 
          :date="currentDate" 
          :day="currentDay"
          :lunar="lunarDate"
          :size="cardSizes.timeCard"
          @size-change="changeCardSize('timeCard', $event)"
          @context-menu="showCardSizeMenu('timeCard', $event)"
        />
        
        <!-- 天气卡片 -->
        <WeatherCard 
          :weatherData="weatherData"
          :size="cardSizes.weatherCard"
          @size-change="changeCardSize('weatherCard', $event)"
          @context-menu="showCardSizeMenu('weatherCard', $event)"
        />
        
        <!-- 待办事项卡片 -->
        <TodoCard 
          :initialTodos="todos"
          :size="cardSizes.todoCard"
          @update:todos="updateTodos"
          @size-change="changeCardSize('todoCard', $event)"
          @context-menu="showCardSizeMenu('todoCard', $event)"
        />
        
        <!-- 笔记卡片 -->
        <NoteCard 
          :initialNote="noteContent"
          :size="cardSizes.noteCard"
          @update:note="updateNoteContent"
          @size-change="changeCardSize('noteCard', $event)"
          @context-menu="showCardSizeMenu('noteCard', $event)"
        />
      </div>
    </div>
    
    <!-- 卡片尺寸上下文菜单 -->
    <div class="card-size-menu" v-if="showSizeMenu" :style="menuPosition" @click="hideSizeMenu" @contextmenu.prevent>
      <div class="menu-item" @click="setCardSize(currentCardId, 'small')">
        <span class="menu-icon">S</span>
        <span>小尺寸 (1x1)</span>
      </div>
      <div class="menu-item" @click="setCardSize(currentCardId, 'medium')">
        <span class="menu-icon">M</span>
        <span>中尺寸 (1x2)</span>
      </div>
      <div class="menu-item" @click="setCardSize(currentCardId, 'large')">
        <span class="menu-icon">L</span>
        <span>大尺寸 (2x2)</span>
      </div>
    </div>
  </div>
</template>

<script>
import TimeCard from './cards/TimeCard.vue';
import WeatherCard from './cards/WeatherCard.vue';
import TodoCard from './cards/TodoCard.vue';
import NoteCard from './cards/NoteCard.vue';
import Lunar from 'lunar-javascript'; // 导入农历库

export default {
  name: 'HelloWorld',
  components: {
    TimeCard,
    WeatherCard,
    TodoCard,
    NoteCard
  },
  props: {
    msg: String
  },
  data() {
    return {
      isFullscreen: false,
      currentTime: '',
      currentDate: '',
      currentDay: '',
      lunarDate: '', // 添加农历日期
      weatherData: {
        location: '北京',
        temperature: 22,
        description: '多云',
        humidity: 45,
        windSpeed: 12,
        icon: 'cloudy'  // sunny, cloudy, rainy
      },
      todos: [
        { text: '完成设计方案', completed: false },
        { text: '回复重要邮件', completed: true },
        { text: '准备会议材料', completed: false }
      ],
      noteContent: '今天要记得：\n\n1. 查阅资料\n2. 联系客户\n3. 整理会议记录',
      // 卡片尺寸管理
      cardSizes: {
        timeCard: 'small',
        weatherCard: 'medium',
        todoCard: 'medium',
        noteCard: 'large'
      },
      showSizeMenu: false,
      menuPosition: {
        top: '0px',
        left: '0px'
      },
      currentCardId: null
    }
  },
  mounted() {
    // 添加全屏监听
    document.addEventListener('fullscreenchange', this.fullscreenChanged);
    document.addEventListener('webkitfullscreenchange', this.fullscreenChanged);
    document.addEventListener('mozfullscreenchange', this.fullscreenChanged);
    document.addEventListener('MSFullscreenChange', this.fullscreenChanged);
    
    // 初始化时间
    this.updateTime();
    setInterval(this.updateTime, 1000);
    
    // 如果存在本地存储数据，加载它
    this.loadLocalData();
    
    // 加载卡片尺寸设置
    this.loadCardSizes();
    
    // 添加全局点击事件隐藏菜单
    document.addEventListener('click', this.hideMenuOnOutsideClick);

    // 监听滚动事件以控制阴影效果
    const panelContent = document.querySelector('.panel-content');
    if (panelContent) {
      panelContent.addEventListener('scroll', this.handleScroll);
    }

    // 监听窗口大小变化，重新布局卡片
    window.addEventListener('resize', this.optimizeBentoLayout);
    
    // 初始布局优化
    this.$nextTick(() => {
      this.optimizeBentoLayout();
    });
  },
  beforeUnmount() {
    // 移除全屏监听
    document.removeEventListener('fullscreenchange', this.fullscreenChanged);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenChanged);
    document.removeEventListener('mozfullscreenchange', this.fullscreenChanged);
    document.removeEventListener('MSFullscreenChange', this.fullscreenChanged);
    
    // 移除全局点击事件
    document.removeEventListener('click', this.hideMenuOnOutsideClick);

    // 移除滚动监听
    const panelContent = document.querySelector('.panel-content');
    if (panelContent) {
      panelContent.removeEventListener('scroll', this.handleScroll);
    }

    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.optimizeBentoLayout);
  },
  methods: {
    toggleFullscreen() {
      if (!this.isFullscreen) {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },
    
    fullscreenChanged() {
      this.isFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      const helloElement = document.querySelector('.hello');
      if (helloElement) {
        if (this.isFullscreen) {
          helloElement.classList.add('fullscreen');
        } else {
          helloElement.classList.remove('fullscreen');
        }
      }
    },
    
    updateTime() {
      const now = new Date();
      
      // 格式化时间 (HH:MM:SS)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0'); // 添加秒数
      this.currentTime = `${hours}:${minutes}:${seconds}`;
      
      // 格式化日期 (YYYY年MM月DD日)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
      
      // 获取星期
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      this.currentDay = days[now.getDay()];

      // 计算农历日期 - 改进格式为"乙巳年二月廿五"
      try {
        const solar = Lunar.Solar.fromDate(now);
        const lunar = solar.getLunar();
        this.lunarDate = `${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
      } catch (error) {
        console.error('计算农历日期出错:', error);
        this.lunarDate = '农历日期获取失败';
      }
    },
    
    updateTodos(newTodos) {
      this.todos = newTodos;
      this.saveLocalData();
    },
    
    updateNoteContent(newContent) {
      this.noteContent = newContent;
      this.saveLocalData();
    },
    
    saveLocalData() {
      localStorage.setItem('daily-panel-todos', JSON.stringify(this.todos));
      localStorage.setItem('daily-panel-notes', this.noteContent);
      this.saveCardSizes(); // 同时保存卡片尺寸
    },
    
    loadLocalData() {
      const savedTodos = localStorage.getItem('daily-panel-todos');
      const savedNotes = localStorage.getItem('daily-panel-notes');
      
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
      
      if (savedNotes) {
        this.noteContent = savedNotes;
      }
    },
    
    // 卡片尺寸管理方法
    showCardSizeMenu(cardId, event) {
      // 防止默认右键菜单
      event.preventDefault();
      
      // 设置菜单位置
      this.menuPosition = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`
      };
      
      // 显示菜单
      this.showSizeMenu = true;
      this.currentCardId = cardId;
    },
    
    hideSizeMenu() {
      this.showSizeMenu = false;
    },
    
    hideMenuOnOutsideClick(event) {
      const menu = document.querySelector('.card-size-menu');
      if (menu && !menu.contains(event.target) && this.showSizeMenu) {
        this.hideSizeMenu();
      }
    },
    
    setCardSize(cardId, size) {
      if (this.cardSizes[cardId] !== size) {
        this.changeCardSize(cardId, size);
      }
      this.hideSizeMenu();
    },
    
    changeCardSize(cardId, size) {
      this.cardSizes[cardId] = size;
      this.saveCardSizes();
      
      // 当卡片尺寸变化时重新优化布局
      this.$nextTick(() => {
        this.optimizeBentoLayout();
      });
    },
    
    updateCardsLayout() {
      // 这里可以添加额外的布局调整逻辑，如有需要
      // 例如重新排序卡片以更好地适应不同尺寸
    },
    
    saveCardSizes() {
      localStorage.setItem('daily-panel-card-sizes', JSON.stringify(this.cardSizes));
    },
    
    loadCardSizes() {
      const savedSizes = localStorage.getItem('daily-panel-card-sizes');
      if (savedSizes) {
        try {
          const sizes = JSON.parse(savedSizes);
          // 确保所有的卡片都有尺寸
          this.cardSizes = {
            ...this.cardSizes,
            ...sizes
          };
        } catch (e) {
          console.error('加载卡片尺寸失败:', e);
        }
      }
    },

    handleScroll(e) {
      const target = e.target;
      if (target.scrollTop > 10) {
        target.classList.add('scrolled');
      } else {
        target.classList.remove('scrolled');
      }
    },

    // 改进 Bento 布局算法，增加垂直居中和动效
    optimizeBentoLayout() {
      const container = this.$refs.bentoContainer;
      if (!container) return;
      
      // 获取所有卡片元素
      const cards = Array.from(container.children);
      if (!cards.length) return;
      
      // 获取容器宽度和高度
      const containerWidth = container.clientWidth;
      const containerHeight = container.parentElement.clientHeight - 32; // 减去内边距
      
      // 根据容器宽度决定列数和单元格大小
      const gridGap = 16; // 卡片间距
      const columns = containerWidth >= 1200 ? 8 : (containerWidth >= 768 ? 6 : 4);
      const cellSize = Math.floor((containerWidth - (columns - 1) * gridGap) / columns);
      
      // 初始化布局网格
      const heights = Array(columns).fill(0);
      
      // 卡片尺寸映射
      const sizeMap = {
        small: { width: 1, height: 1 },
        medium: { width: 2, height: 1 },
        large: { width: 2, height: 2 }
      };
      
      // 排序卡片：优先放置大卡片
      const sortedCards = [...cards].sort((a, b) => {
        const aSize = a.classList.contains('card-large') ? 3 : 
                     (a.classList.contains('card-medium') ? 2 : 1);
        const bSize = b.classList.contains('card-large') ? 3 : 
                     (b.classList.contains('card-medium') ? 2 : 1);
        return bSize - aSize;
      });
      
      // 第一轮：计算布局所需的总高度（不应用样式）
      sortedCards.forEach(card => {
        // 获取卡片尺寸
        let cardSize = 'small';
        if (card.classList.contains('card-medium')) cardSize = 'medium';
        if (card.classList.contains('card-large')) cardSize = 'large';
        
        const { width, height } = sizeMap[cardSize];
        
        // 找到最佳位置
        const position = this.findBestPosition(heights, width, columns);
        
        // 更新网格高度
        for (let i = 0; i < width; i++) {
          heights[position + i] += height;
        }
      });
      
      // 计算布局总高度
      const totalLayoutHeight = Math.max(...heights) * (cellSize + gridGap) - gridGap;
      
      // 计算垂直方向的偏移量，实现垂直居中
      let verticalOffset = 0;
      if (totalLayoutHeight < containerHeight) {
        verticalOffset = Math.floor((containerHeight - totalLayoutHeight) / 2);
      }
      
      // 重置高度数组用于第二轮布局
      heights.fill(0);
      
      // 第二轮：应用布局样式
      sortedCards.forEach((card, index) => {
        // 获取卡片尺寸
        let cardSize = 'small';
        if (card.classList.contains('card-medium')) cardSize = 'medium';
        if (card.classList.contains('card-large')) cardSize = 'large';
        
        const { width, height } = sizeMap[cardSize];
        
        // 找到最佳位置
        const position = this.findBestPosition(heights, width, columns);
        
        // 更新网格高度
        for (let i = 0; i < width; i++) {
          heights[position + i] += height;
        }
        
        // 应用卡片样式
        const cardLeft = position * (cellSize + gridGap);
        const cardTop = Math.min(...heights.slice(position, position + width)) - height;
        const cardWidth = width * cellSize + (width - 1) * gridGap;
        const cardHeight = height * cellSize + (height - 1) * gridGap;
        
        // 设置卡片的过渡延迟，创建级联效果
        const transitionDelay = `${index * 0.05}s`;
        
        // 应用定位样式
        card.style.position = 'absolute';
        card.style.left = `${cardLeft}px`;
        card.style.top = `${cardTop * (cellSize + gridGap) + verticalOffset}px`;
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.transitionDelay = transitionDelay;
        
        // 添加动画类，使卡片可见
        setTimeout(() => {
          card.classList.add('card-visible');
        }, 50);
      });
      
      // 设置容器高度，考虑垂直居中
      const maxHeight = Math.max(Math.max(...heights) * (cellSize + gridGap), containerHeight);
      container.style.height = `${maxHeight}px`;
    },
    
    // 找最佳位置(居中优先策略)
    findBestPosition(heights, width, columns) {
      if (width > columns) return 0;
      
      // 计算可能的位置
      const positions = [];
      for (let i = 0; i <= columns - width; i++) {
        positions.push({
          position: i,
          height: Math.max(...heights.slice(i, i + width))
        });
      }
      
      // 按高度排序
      positions.sort((a, b) => a.height - b.height);
      
      // 如果高度相同，优先选择居中的位置
      const minHeight = positions[0].height;
      const sameHeightPositions = positions.filter(pos => pos.height === minHeight);
      
      if (sameHeightPositions.length > 1) {
        const center = columns / 2 - width / 2;
        return sameHeightPositions.sort((a, b) => 
          Math.abs(a.position - center) - Math.abs(b.position - center)
        )[0].position;
      }
      
      return positions[0].position;
    },
  }
}
</script>

<style>
:root {
  /* VisionOS 风格颜色变量 */
  --visionos-bg: rgba(245, 245, 247, 0.01);
  --visionos-panel: rgba(255, 255, 255, 0.7);
  --visionos-border: rgba(255, 255, 255, 0.2);
  --visionos-shadow: rgba(0, 0, 0, 0.05);
  --visionos-text: rgb(29, 29, 31);
  --visionos-text-secondary: rgba(29, 29, 31, 0.7);
  --visionos-accent: rgba(10, 132, 255, 0.8);
}

/* 页面基础样式 */
.hello {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--visionos-bg);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--visionos-text);
  overflow: hidden;
}

/* 顶部导航栏 */
.top-nav {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.logo-title-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border-radius: 12px;
  color: white;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
  color: var(--visionos-text);
}

.fullscreen-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid var(--visionos-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--visionos-text);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.fullscreen-btn:active {
  transform: scale(0.98);
}

/* 主内容区域 */
.main-content {
  flex: 1;
  width: 100%;
  height: calc(100% - 60px);
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

/* Bento卡片容器 */
.bento-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  min-height: 400px;
  height: auto;
  padding: 20px;
  margin: auto;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片基础样式 */
.card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(30px);
  border: 1px solid var(--visionos-border);
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              left 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              top 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform, left, top, width, height, opacity;
  position: absolute;
  margin: 0;
  z-index: 1;
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* 卡片可见状态动画 */
.card.card-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.card:hover {
  z-index: 2;
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px) scale(1.01);
}

/* 卡片尺寸菜单样式 */
.card-size-menu {
  position: fixed;
  min-width: 180px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 1000;
  overflow: hidden;
  transform-origin: top left;
  animation: menu-appear 0.15s ease-out;
}

@keyframes menu-appear {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 全屏模式调整 */
.hello.fullscreen .top-nav {
  background: rgba(255, 255, 255, 0.8);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .top-nav {
    padding: 0 15px;
    height: 50px;
  }
  
  .main-content {
    height: calc(100% - 50px);
    margin-top: 50px;
  }
  
  .bento-container {
    padding: 10px;
  }
  
  .logo {
    width: 32px;
    height: 32px;
  }
  
  .title {
    font-size: 16px;
  }
}

/* 保留卡片菜单相关样式 */
.menu-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.15s;
  user-select: none;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.menu-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--visionos-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: 500;
  font-size: 14px;
}
</style>