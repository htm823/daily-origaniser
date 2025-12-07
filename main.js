'use strict';

const taskInput   = document.getElementById('task-input');
const addTaskForm = document.getElementById('add-task-form');
const taskList    = document.getElementById('task-list');
const clearAllBtn = document.getElementById('clear-all-btn');

// Memory in a local storage
let tasks = [];

// Save tasks
function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
	const storedTasks = localStorage.getItem('tasks');
	if (!storedTasks) return;

	tasks = JSON.parse(storedTasks);
	tasks.forEach((task) => renderTask(task));
}

// Render tasks
function renderTask(task) {
	// Each task
	const taskItem = document.createElement('li');
	taskItem.classList.add('task__item');
	taskItem.dataset.id = task.id;

	// Checkbox
	const checkbox = document.createElement('input');
	checkbox.type  = 'checkbox';
	checkbox.classList.add('task__checkbox');

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
		// Edit a task
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
	});

	// Build label
	checkLabel.appendChild(customCheckbox);
	checkLabel.appendChild(taskName);

	// Build buttons
	btnGroup.appendChild(editBtn);
	btnGroup.appendChild(deleteBtn);

	// Assemble task item
	taskItem.appendChild(checkbox);
	taskItem.appendChild(checkLabel);
	taskItem.appendChild(btnGroup);

	// Insert into list
	taskList.appendChild(taskItem);
}

addTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const taskText = taskInput.value.trim();

	if (!taskText) {
		alert('Please enter a task.');
		return;
	}

	const newTask = {
		id: crypto.randomUUID(),
		text: taskText,
	}

	tasks.push(newTask);
	saveTasks();

	renderTask(newTask);

	taskInput.value = '';
});

// Clear all
clearAllBtn.addEventListener('click', () => {
	if (!taskList.firstChild) return;

	const confirmed = confirm('Are you sure you want to clear all tasks?');
	if (!confirmed) return;

	tasks = [];
	saveTasks();

	taskList.innerHTML = '';
});

window.addEventListener('DOMContentLoaded', loadTasks);
