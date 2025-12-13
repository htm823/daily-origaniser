'use strict';

// DOM element references
const taskInput      = document.getElementById('task-input');
const categoryInput  = document.getElementById('category-input');
const addTaskForm    = document.getElementById('add-task-form');
const taskList       = document.getElementById('task-list');
const filterAll      = document.getElementById('filter-all');
const filterWork     = document.getElementById('filter-work');
const filterPersonal = document.getElementById('filter-personal');
const clearAllBtn    = document.getElementById('clear-all-btn');

// Application state
let tasks         = [];
let currentFilter = 'all';

// Generate HTML markup for a task item
function createTaskHTML(task) {
	return `
		<li class="task__item" data-id="${task.id}">
			<label class="task__label">
				<input type="checkbox" class="task__checkbox" ${task.completed ? 'checked' : ''}>
				<span class="task__custom-checkbox"></span>
				<span class="task__name">${task.text}</span>
			</label>
			<div class="task__btns">
				<button class="task__btn-edit">
					<i class="bi bi-pencil-square"></i>
				</button>
				<button class="task__btn-delete">
					<i class="bi bi-trash3"></i>
				</button>
			</div>
		</li>
	`;
}

// Create a new task object
function createTask(taskText, category) {
	return {
		id: crypto.randomUUID(),
		text: taskText,
		category: category,
		completed: false,
	};
}

// Render a task to the DOM
function renderTask(task) {
	taskList.insertAdjacentHTML('beforeend', createTaskHTML(task));
}

// Save tasks to local storage
function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
	const storedTasks = localStorage.getItem('tasks');
	if (!storedTasks) return;

	tasks = JSON.parse(storedTasks);
	filterTasks(currentFilter);
}

// Filter and display tasks based on category
function filterTasks(filter) {
	taskList.innerHTML = '';

	tasks.forEach((task) => {
		if (filter === 'all' || filter === task.category) {
			renderTask(task);
		}
	});
}

// Update visibility of the "Clear All" button
function updateClearAllVisibility() {
	let visibleTaskCount = 0;

	if (currentFilter === 'all') {
		visibleTaskCount = tasks.length;
	} else if (currentFilter === 'work') {
		const visibleTaskWork = tasks.filter((task) => task.category === 'work');
		visibleTaskCount = visibleTaskWork.length;
	} else if (currentFilter === 'personal') {
		const visibleTaskPersonal = tasks.filter((task) => task.category === 'personal');
		visibleTaskCount = visibleTaskPersonal.length;
	}

	if (visibleTaskCount === 0) {
		clearAllBtn.style.display = 'none';
	} else {
		clearAllBtn.style.display = 'block';
	}
}

// Initialise the application
function init() {
	loadTasks();
	updateClearAllVisibility();
}

// Handle task item interactions (delete and edit)
taskList.addEventListener('click', (e) => {
	const taskItem = e.target.closest('.task__item');
	if (!taskItem) return;

	const taskId = taskItem.dataset.id;

	// Delete task
	if (e.target.closest('.task__btn-delete')) {
		const confirmed = confirm('Are you sure you want to delete this task?');
		if (!confirmed) return;

		tasks = tasks.filter(task => task.id !== taskId);
		saveTasks();

		taskItem.remove();
		updateClearAllVisibility();
	}

	// Edit task
	if (e.target.closest('.task__btn-edit')) {
		const taskNameSpan = taskItem.querySelector('.task__name');
		const currentText = taskNameSpan.textContent;

		const editInput = document.createElement('input');
		editInput.type = 'text';
		editInput.value = currentText;
		editInput.classList.add('task__edit-input');

		taskNameSpan.replaceWith(editInput);
		editInput.focus();

		// Save the edited task
		function finishEditing() {
			const newValue = editInput.value.trim();

			if (!newValue) {
				cancelEditing();
				return;
			}

			if (newValue !== currentText) {
				tasks = tasks.map(task =>
					task.id === taskId ? {...task, text: newValue } : task
				);
				saveTasks();
			}

			taskNameSpan.textContent = newValue;
			editInput.replaceWith(taskNameSpan);
		}

		// Cancel editing and restore original text
		function cancelEditing() {
			taskNameSpan.textContent = currentText;
			editInput.replaceWith(taskNameSpan);
		}

		editInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') finishEditing();
			if (e.key === 'Escape') cancelEditing();
		});

		editInput.addEventListener('blur', finishEditing);
	}
});

// Handle checkbox state changes
taskList.addEventListener('change', (e) => {
	if (e.target.classList.contains('task__checkbox')) {
		const taskItem = e.target.closest('.task__item');
		const taskId = taskItem.dataset.id;

		tasks = tasks.map(task =>
			task.id === taskId ? { ...task, completed: e.target.checked } : task
		);
		saveTasks();
	}
});

// Handle form submission to add a new task
addTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const taskText = taskInput.value.trim();

	if (!taskText) {
		alert('Please enter a task.');
		return;
	}

	const category = categoryInput.value || 'all';
	const newTask = createTask(taskText, category);

	tasks.push(newTask);
	saveTasks();

	if (currentFilter === 'all' || newTask.category === currentFilter) {
		renderTask(newTask);
	}

	updateClearAllVisibility();

	taskInput.value = '';
});

// Filter: Show all tasks
filterAll.addEventListener('change', () => {
	currentFilter = 'all';
	filterTasks('all');
	updateClearAllVisibility();
});

// Filter: Show work tasks only
filterWork.addEventListener('change', (e) => {
	currentFilter = 'work';
	filterTasks('work');
	updateClearAllVisibility();
});

// Filter: Show personal tasks only
filterPersonal.addEventListener('change', () => {
	currentFilter = 'personal';
	filterTasks('personal');
	updateClearAllVisibility();
});

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
	if (taskList.childElementCount === 0) return;

	const confirmed = confirm('Are you sure you want to clear all tasks?');
	if (!confirmed) return;

	tasks = [];
	saveTasks();
	updateClearAllVisibility();
	taskList.innerHTML = '';
});

// Initialise app when DOM is ready
window.addEventListener('DOMContentLoaded', init);