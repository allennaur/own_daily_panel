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
          <div class="card time-card" style="background: linear-gradient(135deg, rgba(111, 66, 193, 0.95), rgba(181, 52, 113, 0.9));">
            <div class="card-content">
              <div class="time">{{ currentTime }}</div>
              <div class="date">{{ currentDate }}</div>
              <div class="day">{{ currentDay }}</div>
            </div>
          </div>
          
          <!-- 天气卡片 -->
          <div class="card weather-card" style="background: linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(64, 196, 255, 0.85));">
            <div class="card-header">
              <h3 style="color: white !important;">天气</h3>
              <span class="location" style="color: white !important;">{{ weatherData.location }}</span>
            </div>
            <div class="card-content weather-content">
              <div class="weather-icon" :class="weatherData.icon"></div>
              <div class="weather-info">
                <div class="temperature" style="color: white !important;">{{ weatherData.temperature }}°</div>
                <div class="weather-desc" style="color: white !important;">{{ weatherData.description }}</div>
              </div>
              <div class="weather-details">
                <div class="weather-detail">
                  <div class="detail-label" style="color: white !important;">湿度</div>
                  <div class="detail-value" style="color: white !important;">{{ weatherData.humidity }}%</div>
                </div>
                <div class="weather-detail">
                  <div class="detail-label" style="color: white !important;">风速</div>
                  <div class="detail-value" style="color: white !important;">{{ weatherData.windSpeed }} km/h</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 待办事项卡片 -->
          <div class="card todo-card" style="background: linear-gradient(135deg, rgba(46, 176, 134, 0.85), rgba(96, 221, 142, 0.75));">
            <div class="card-header">
              <h3>今日待办</h3>
              <button class="add-btn" @click="addNewTodo">+</button>
            </div>
            <div class="card-content todo-content">
              <div v-if="todos.length === 0" class="empty-state">暂无待办事项</div>
              <ul class="todo-list" v-else>
                <li v-for="(todo, index) in todos" :key="index" class="todo-item" :class="{ 'completed': todo.completed }">
                  <input type="checkbox" :id="'todo-' + index" v-model="todo.completed">
                  <label :for="'todo-' + index">{{ todo.text }}</label>
                  <button class="delete-btn" @click="deleteTodo(index)">×</button>
                </li>
              </ul>
              <div v-if="isAddingTodo" class="add-todo-form">
                <input v-model="newTodoText" type="text" placeholder="输入新的待办事项" @keyup.enter="saveTodo">
                <div class="form-buttons">
                  <button @click="cancelAddTodo">取消</button>
                  <button @click="saveTodo" class="save-btn">保存</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 笔记卡片 -->
          <div class="card notes-card" style="background: linear-gradient(135deg, rgba(255, 153, 0, 0.75), rgba(255, 183, 77, 0.7));">
            <div class="card-header">
              <h3>快速笔记</h3>
            </div>
            <div class="card-content">
              <textarea v-model="noteContent" placeholder="在这里记录一些想法..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../assets/js/HelloWorld.js"></script>
<style src="../assets/css/HelloWorld.css"></style>
