<template>
  <BaseCard 
    :size="size" 
    type="editable" 
    title="今日待办"
    @context-menu="$emit('context-menu', $event)">
    
    <template v-slot:header-actions>
      <button class="add-btn" @click="addNewTodo">+</button>
    </template>
    
    <div class="todo-content" :class="size">
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
  </BaseCard>
</template>

<script>
import BaseCard from './BaseCard.vue';

export default {
  name: 'TodoCard',
  components: { BaseCard },
  props: {
    size: {
      type: String,
      default: 'small'
    },
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
        small: 1,
        medium: 2,
        large: 5
      };
      
      return this.todos.slice(0, maxItems[this.size] || 2);
    },
    hasMoreTodos() {
      return this.todos.length > this.visibleTodos.length;
    }
  },
  methods: {
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
  }
}
</script>

<style scoped>
:deep(.card) {
  background: linear-gradient(
    135deg,
    rgba(255, 159, 10, 0.1),
    rgba(255, 179, 64, 0.15)
  ) !important;
}

.add-btn {
  width: 24px;
  height: 24px;
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
  padding: 8px 12px;
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
  margin-right: 8px;
  width: 16px;
  height: 16px;
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
  font-size: 13px;
  color: var(--visionos-text);
  cursor: pointer;
  letter-spacing: -0.01em;
}

.delete-btn {
  opacity: 0;
  width: 20px;
  height: 20px;
  font-size: 16px;
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
  padding: 20px;
  color: var(--visionos-text-secondary);
  font-size: 13px;
  opacity: 0.6;
}

.add-todo-form {
  padding: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

.add-todo-form input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 12px;
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

/* 尺寸特定样式 */
.todo-content {
  max-height: calc(100% - 45px);
  overflow-y: auto;
}

.more-todos {
  text-align: center;
  padding: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.2);
  margin-top: 5px;
  border-radius: 8px;
}

/* 特定尺寸下的样式调整 */
.todo-content.small .todo-item {
  padding: 6px 10px;
}

.todo-content.small .todo-item label {
  font-size: 12px;
}

.todo-content.large .todo-item {
  padding: 10px 15px;
}
</style>
