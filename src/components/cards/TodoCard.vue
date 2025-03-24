<template>
  <div :class="['card', 'todo-card', cardSizeClass]" ref="todoCard">
    <div class="card-header">
      <h3>今日待办</h3>
      <button class="add-btn" @click="addNewTodo">+</button>
    </div>
    <div class="card-content todo-content" :class="size">
      <!-- 不同尺寸下显示不同数量的待办项 -->
      <div v-if="visibleTodos.length === 0" class="empty-state">暂无待办事项</div>
      <ul class="todo-list" v-else>
        <li v-for="(todo, index) in visibleTodos" :key="index" class="todo-item" :class="{ 'completed': todo.completed }">
          <input type="checkbox" :id="'todo-' + index" v-model="todo.completed" @change="updateTodo">
          <label :for="'todo-' + index">{{ todo.text }}</label>
          <button class="delete-btn" @click="deleteTodo(todos.indexOf(todo))">×</button>
        </li>
      </ul>
      
      <!-- 如果还有更多项目 -->
      <div v-if="hasMoreTodos" class="more-todos">
        还有 {{ todos.length - visibleTodos.length }} 项
      </div>
      
      <div v-if="isAddingTodo" class="add-todo-form">
        <input v-model="newTodoText" type="text" placeholder="输入新的待办事项" @keyup.enter="saveTodo">
        <div class="form-buttons">
          <button @click="cancelAddTodo">取消</button>
          <button @click="saveTodo" class="save-btn">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CardEffectMixin } from './CardBase.js';

export default {
  name: 'TodoCard',
  mixins: [CardEffectMixin],
  props: {
    initialTodos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      todos: this.initialTodos,
      isAddingTodo: false,
      newTodoText: ''
    };
  },
  computed: {
    visibleTodos() {
      // 根据卡片尺寸显示不同数量的待办项
      const maxItems = {
        small: 2,
        medium: 4,
        large: 8
      };
      
      return this.todos.slice(0, maxItems[this.size] || 3);
    },
    hasMoreTodos() {
      return this.todos.length > this.visibleTodos.length;
    }
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
        this.$emit('update:todos', [...this.todos]);
      }
      this.isAddingTodo = false;
    },
    
    cancelAddTodo() {
      this.newTodoText = '';
      this.isAddingTodo = false;
    },
    
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.$emit('update:todos', [...this.todos]);
    },
    
    updateTodo() {
      this.$emit('update:todos', [...this.todos]);
    }
  },
  beforeUnmount() {
    const card = this.$refs.todoCard;
    if (card) {
      card.removeEventListener('mouseenter', this.handleCardMouseEnter);
      card.removeEventListener('mousemove', this.handleCardMouseMove);
      card.removeEventListener('mouseleave', this.handleCardMouseLeave);
    }
  }
}
</script>

<style scoped>
.todo-card {
  background: linear-gradient(
    135deg,
    rgba(255, 159, 10, 0.1),
    rgba(255, 179, 64, 0.15)
  ) !important;
  position: relative;
}

.add-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: var(--visionos-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.todo-content {
  padding: 0;
}

.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  transition: background-color 0.2s ease;
}

.todo-item:hover {
  background-color: rgba(0, 0, 0, 0.01);
}

.todo-item.completed {
  background-color: rgba(0, 0, 0, 0.02);
}

.todo-item.completed label {
  text-decoration: line-through;
  opacity: 0.5;
}

.todo-item input[type="checkbox"] {
  margin-right: 12px;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.todo-item input[type="checkbox"]:checked {
  background-color: var(--visionos-accent);
  border-color: transparent;
}

.todo-item input[type="checkbox"]:checked::after {
  content: "✓";
  color: white;
  font-size: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.todo-item label {
  flex: 1;
  font-size: 15px;
  color: var(--visionos-text);
  cursor: pointer;
  letter-spacing: -0.01em;
}

.delete-btn {
  opacity: 0;
  width: 24px;
  height: 24px;
  font-size: 18px;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: rgba(0, 0, 0, 0.6);
  transform: scale(1.1);
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: var(--visionos-text-secondary);
  font-size: 15px;
  opacity: 0.6;
}

.add-todo-form {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

.add-todo-form input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 15px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-buttons button {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.05);
  color: var(--visionos-text);
  transition: all 0.2s;
}

.form-buttons button.save-btn {
  background: var(--visionos-accent);
  color: white;
}

.form-buttons button:hover {
  transform: translateY(-1px);
  background: rgba(0, 0, 0, 0.08);
}

.form-buttons button.save-btn:hover {
  background: rgba(10, 132, 255, 0.9);
}

/* 添加尺寸特定的样式 */
.todo-content.small {
  max-height: calc(100% - 60px);
  overflow-y: auto;
}

.todo-content.medium {
  max-height: calc(100% - 60px);
  overflow-y: auto;
}

.todo-content.large {
  max-height: calc(100% - 60px);
  overflow-y: auto;
}

.more-todos {
  text-align: center;
  padding: 10px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.2);
  margin-top: 5px;
  border-radius: 8px;
}
</style>
