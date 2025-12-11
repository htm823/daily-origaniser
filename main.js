'use strict';

const taskInput = document.getElementById('task-input');
const categoryInput = document.getElementById('category-input');
const addTaskForm = document.getElementById('add-task-form');
const taskList = document.getElementById('task-list');
const filterAll = document.getElementById('filter-all');
const filterWork = document.getElementById('filter-work');
const filterPersonal = document.getElementById('filter-personal');
const clearAllBtn = document.getElementById('clear-all-btn');

// Store task data in localStorage
let tasks = [];

// Save all tasks to localStorage
function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load saved tasks from localStorage
function loadTasks() {
	const storedTasks = localStorage.getItem('tasks');
	if (!storedTasks) return;

	tasks = JSON.parse(storedTasks);
	tasks.forEach((task) => renderTask(task));

	filterTasks('all');
}

// Render a task item
function renderTask(task) {
	// Create a list item for the task
	const taskItem = document.createElement('li');
	taskItem.classList.add('task__item');
	taskItem.dataset.id = task.id;

	// Checkbox
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.classList.add('task__checkbox');
	checkbox.checked = task.completed;

	checkbox.addEventListener('change', () => {
		const itemId = taskItem.dataset.id;
		tasks = tasks.map((task) => (task.id === itemId ? { ...task, completed: checkbox.checked } : task));

		saveTasks();
	});

	// Label
	const checkLabel = document.createElement('label');
	checkLabel.classList.add('task__label');

	// Custom checkbox
	const customCheckbox = document.createElement('span');
	customCheckbox.classList.add('task__custom-checkbox');

	// Task name
	const taskName = document.createElement('span');
	taskName.classList.add('task__name');
	taskName.textContent = task.text;

	// Edit & delete buttons
	const btnGroup = document.createElement('div');
	btnGroup.classList.add('task__btns');

	// Edit button
	const editBtn = document.createElement('button');
	editBtn.classList.add('task__btn-edit');

	const pencilIcon = document.createElement('i');
	pencilIcon.classList.add('bi', 'bi-pencil-square');

	editBtn.appendChild(pencilIcon);

	editBtn.addEventListener('click', () => {
		const currentText = taskName.textContent;

		// Create input for editing
		const editInput = document.createElement('input');
		editInput.type = 'text';
		editInput.value = currentText;
		editInput.classList.add('task__edit-input');

		// Replace the text span with input
		taskName.replaceWith(editInput);
		editInput.focus();

		// Save on Enter
		editInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				finishEditing();
			}

			// Cancel with Escape
			if (e.key === 'Escape') {
				cancelEditing();
			}
		});

		// Save when focus is lost
		editInput.addEventListener('blur', finishEditing);

		function finishEditing() {
			const newValue = editInput.value.trim();

			if (!newValue) {
				cancelEditing();
				return;
			}

			if (newValue !== currentText) {
				tasks = tasks.map((task) => (task.id === taskItem.dataset.id ? { ...task, text: newValue } : task));
				saveTasks();
			}

			taskName.textContent = newValue;
			editInput.replaceWith(taskName);
		}

		function cancelEditing() {
			taskName.textContent = currentText;
			editInput.replaceWith(taskName);
		}
	});

	// Delete button
	const deleteBtn = document.createElement('button');
	deleteBtn.classList.add('task__btn-delete');

	const trashIcon = document.createElement('i');
	trashIcon.classList.add('bi', 'bi-trash3');

	deleteBtn.appendChild(trashIcon);

	deleteBtn.addEventListener('click', () => {
		const itemId = taskItem.dataset.id;

		const confirmed = confirm('Are you sure you want to delete this task?');
		if (!confirmed) return;

		tasks = tasks.filter((task) => task.id !== itemId);
		saveTasks();

		taskItem.remove();

		updateClearAllVisibility();
	});

	// Build label
	checkLabel.appendChild(checkbox);
	checkLabel.appendChild(customCheckbox);
	checkLabel.appendChild(taskName);

	// Build buttons
	btnGroup.appendChild(editBtn);
	btnGroup.appendChild(deleteBtn);

	// Assemble task item
	taskItem.appendChild(checkLabel);
	taskItem.appendChild(btnGroup);

	// Insert into list
	taskList.appendChild(taskItem);
}

// Filter tasks
function filterTasks(filter) {
	taskList.innerHTML = '';

	tasks.forEach(task => {
		if (filter === 'all' || task.category === filter) {
			renderTask(task);
		}
	});
}

// Update Clear All button visibility
function updateClearAllVisibility() {
	let visibleTasks = 0;

	// All tab
	if (currentFilter === 'all') {
		visibleTasks = tasks.length;
	}

	// Work tab
	else if (currentFilter === 'work') {
		visibleTasks = tasks.filter(t => t.category === 'work').length;
	}

	// Personal tab
	else if (currentFilter === 'personal') {
		visibleTasks = tasks.filter(t => t.category === 'personal').length;
	}

	// Change visibility
	if (visibleTasks === 0) {
		clearAllBtn.style.display = 'none';
	} else {
		clearAllBtn.style.display = 'block';
	}
}

// Initialize the app
function init() {
	loadTasks();
	updateClearAllVisibility();
}

// Create a task
function createTask(taskText, category) {
	return {
		id: crypto.randomUUID(),
		text: taskText,
		category: category,
		completed: false,
	};
}

// Add a task
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

	renderTask(newTask);

	updateClearAllVisibility();

	taskInput.value = '';
});

// Current filter
let currentFilter = 'all';

filterAll.addEventListener('change', () => {
	currentFilter = 'all';
	filterTasks('all');
	updateClearAllVisibility();
});

filterWork.addEventListener('change', () => {
	currentFilter = 'work';
	filterTasks('work');
	updateClearAllVisibility();
});

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

// Run init() when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', init);
