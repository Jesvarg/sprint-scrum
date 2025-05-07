let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "todas";

// Elementos del DOM
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter-buttons button");
const taskText = document.getElementById("taskText");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

// Event Listeners
form.addEventListener("submit", handleFormSubmit);
filters.forEach((btn) => btn.addEventListener("click", handleFilterClick));
taskList.addEventListener("click", handleTaskClick);

// Funciones principales
function handleFormSubmit(e) {
  e.preventDefault();
  const text = taskText.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;

  if (!text) return;

  if (!isValidDate(date)) {
    alert("Fecha inválida, elige una diferente");
    return;
  }

  
  const newTask = {
    id: Date.now(),
    text,
    date,
    priority,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
}

function handleFilterClick(e) {
  currentFilter = e.target.dataset.filter;
  filters.forEach((btn) => btn.classList.toggle("active", btn === e.target));
  renderTasks();
}

function handleTaskClick(e) {
  const row = e.target.closest("tr");
  if (!row) return;
  const id = Number(row.dataset.id);

  if (e.target.matches("input[type='checkbox']")) {
    handleToggleComplete(row, id);
  }
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Verificar si es una fecha válida
  if (!(date instanceof Date) || isNaN(date)) return false;

  // Verificar si la fecha es futura (desde mañana)
  return date >= today;
}

function handleToggleComplete(row, id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }


// Funciones de persistencia
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Funciones de renderizado
function renderTasks() {
  taskList.innerHTML = "";
  let filtered = tasks;

  if (currentFilter === "completadas") {
    filtered = tasks.filter((t) => t.completed);
  } else if (currentFilter === "pendientes") {
    filtered = tasks.filter((t) => !t.completed);
  }

  filtered.forEach((task) => {
    const row = document.createElement("tr");
    row.className = "task-row";
    row.dataset.id = task.id;
    row.innerHTML = `
      <td>
        <input type="checkbox" ${task.completed ? "checked" : ""}>
      </td>
      <td class="task-text">${task.text}</td>
      <td class="task-priority">${getPriorityIcon(task.priority)}</td>
      <td>${new Date(task.date).toLocaleDateString()}</td>
    `;
    taskList.appendChild(row);
  });

  updateTaskCounter();
}

function getPriorityIcon(priority) {
  const icons = {
    alta: "🔥",
    media: "🔔",
    baja: "⏰",
  };
  return icons[priority];
}

function updateTaskCounter() {
  const remaining = tasks.filter((t) => !t.completed).length;
  document.querySelector(
    ".task-counter"
  ).textContent = `Tareas restantes: ${remaining}`;
}

renderTasks();
