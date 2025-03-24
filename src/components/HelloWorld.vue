<template>
  <div class="hello">
    <div class="panel">
      <div class="panel-header">
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
      <div class="panel-content">
        <div class="cards-container">
          <!-- 时间日期卡片 -->
          <TimeCard 
            :time="currentTime" 
            :date="currentDate" 
            :day="currentDay"
            :lunar="lunarDate"
          />
          
          <!-- 天气卡片 -->
          <WeatherCard 
            :weatherData="weatherData"
          />
          
          <!-- 待办事项卡片 -->
          <TodoCard 
            :initialTodos="todos"
            @update:todos="updateTodos"
          />
          
          <!-- 笔记卡片 -->
          <NoteCard 
            :initialNote="noteContent"
            @update:note="updateNoteContent"
          />
        </div>
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
      noteContent: '今天要记得：\n\n1. 查阅资料\n2. 联系客户\n3. 整理会议记录'
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
  },
  beforeUnmount() {
    // 移除全屏监听
    document.removeEventListener('fullscreenchange', this.fullscreenChanged);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenChanged);
    document.removeEventListener('mozfullscreenchange', this.fullscreenChanged);
    document.removeEventListener('MSFullscreenChange', this.fullscreenChanged);
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
    }
  }
}
</script>

<style>
/* 只保留面板和全局样式，卡片特定样式已移到各自组件中 */
:root {
  /* VisionOS 风格颜色变量 */
  --visionos-bg: rgba(245, 245, 247, 0.01);
  --visionos-panel: rgba(255, 255, 255, 0.7);  /* 半透明面板 */
  --visionos-border: rgba(255, 255, 255, 0.2);
  --visionos-shadow: rgba(0, 0, 0, 0.05);
  --visionos-text: rgb(29, 29, 31);
  --visionos-text-secondary: rgba(29, 29, 31, 0.7);
  --visionos-accent: rgba(10, 132, 255, 0.8);
  
  /* 更新卡片颜色以更贴近 VisionOS 风格 */
  --card-time-bg: rgba(10, 132, 255, 0.15);
  --card-weather-bg: rgba(48, 209, 88, 0.15);
  --card-todo-bg: rgba(255, 159, 10, 0.15);
  --card-notes-bg: rgba(191, 90, 242, 0.15);
}

.hello {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--visionos-text);
  z-index: 1;
}

.panel {
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  max-width: 1600px;
  margin: 24px;
  border-radius: 32px;
  background-color: #ffffff !important; /* 确保应用纯白色背景 */
  border: 1px solid var(--visionos-border);
  box-shadow: 
    0 10px 30px var(--visionos-shadow),
    0 0 0 1px rgba(0, 0, 0, 0.02) inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: none !important;
  position: relative;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

.panel-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

/* 卡片容器 */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  width: 100%;
}

/* 通用卡片样式 - VisionOS 风格 */
.card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(30px);
  border: 1px solid var(--visionos-border);
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  height: 100%;
  min-height: 200px;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;
}

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

.card:hover {
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.05),
    0 2px 5px rgba(0, 0, 0, 0.03);
}

.card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.card-header h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: var(--visionos-text);
  letter-spacing: -0.01em;
}

.card-content {
  padding: 20px;
}

/* VisionOS 风格的滚动条 */
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

/* 适应全屏模式 */
.hello.fullscreen .panel {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .panel {
    width: calc(100% - 24px);
    height: calc(100% - 24px);
    margin: 12px;
    border-radius: 24px;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
  }
  
  .panel-header {
    padding: 12px 16px;
  }
  
  .panel-content {
    padding: 16px;
  }
}
</style>