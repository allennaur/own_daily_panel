export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      isFullscreen: false,
      currentTime: '',
      currentDate: '',
      currentDay: '',
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
      isAddingTodo: false,
      newTodoText: '',
      noteContent: '今天要记得：\n\n1. 查阅资料\n2. 联系客户\n3. 整理会议记录'
    }
  },
  mounted() {
    // 添加视差效果和全屏监听
    document.addEventListener('mousemove', this.handleMouseMove);
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
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('fullscreenchange', this.fullscreenChanged);
    document.removeEventListener('webkitfullscreenchange', this.fullscreenChanged);
    document.removeEventListener('mozfullscreenchange', this.fullscreenChanged);
    document.removeEventListener('MSFullscreenChange', this.fullscreenChanged);
  },
  methods: {
    handleMouseMove(e) {
      // 获取鼠标位置相对于窗口中心的偏移量
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX * 1;  // 减小倾斜幅度
      const moveY = (e.clientY - centerY) / centerY * 1;
      
      // 应用轻微的视差效果到面板
      const panel = document.querySelector('.panel');
      if (panel) {
        panel.style.transform = `translateZ(0) perspective(2000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
      }
      
      // 对卡片应用不同程度的视差效果
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        const factor = 1 + (index * 0.1);
        card.style.transform = `translateY(-5px) scale(1.01) translateZ(${index * 5}px) rotateX(${-moveY * factor}deg) rotateY(${moveX * factor}deg)`;
      });
    },
    
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
      
      // 格式化时间 (HH:MM)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.currentTime = `${hours}:${minutes}`;
      
      // 格式化日期 (YYYY年MM月DD日)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.currentDate = `${year}年${month}月${day}日`;
      
      // 获取星期
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      this.currentDay = days[now.getDay()];
    },
    
    addNewTodo() {
      this.isAddingTodo = true;
      this.$nextTick(() => {
        const input = document.querySelector('.add-todo-form input');
        if (input) input.focus();
      });
    },
    
    saveTodo() {
      if (this.newTodoText.trim()) {
        this.todos.push({
          text: this.newTodoText,
          completed: false
        });
        this.newTodoText = '';
        this.saveLocalData();
      }
      this.isAddingTodo = false;
    },
    
    cancelAddTodo() {
      this.newTodoText = '';
      this.isAddingTodo = false;
    },
    
    deleteTodo(index) {
      this.todos.splice(index, 1);
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
  },
  watch: {
    noteContent() {
      this.saveLocalData();
    },
    'todos.length'() {
      this.saveLocalData();
    },
    todos: {
      handler() {
        this.saveLocalData();
      },
      deep: true
    }
  }
}
