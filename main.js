'use strict';

const taskInput = document.getElementById('task-input');
const addTaskForm = document.getElementById('add-task-form');
const taskList = document.getElementById('task-list');
const clearAllBtn = document.getElementById('clear-all-btn');

addTaskForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const taskText = taskInput.value.trim();

	if (!taskText) {
		alert('Please enter a task.');
		return;
	}

	// Each task
	const taskItem = document.createElement('li');
	taskItem.classList.add('task__item')

	// Checkbox
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.classList.add('task__checkbox');

	// Label
	const checkLabel = document.createElement('label');
	checkLabel.classList.add('task__label')

	// Custom checkbox
	const customCheckbox = document.createElement('span');
	customCheckbox.classList.add('task__custom-checkbox');

	// Task name
	const taskName = document.createElement('span');
	taskName.classList.add('task__name')
	taskName.textContent = taskText;

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
		taskItem.remove();
	});

	checkLabel.appendChild(customCheckbox);
	checkLabel.appendChild(taskName);

	btnGroup.appendChild(editBtn);
	btnGroup.appendChild(deleteBtn);

	taskItem.appendChild(checkbox);
	taskItem.appendChild(checkLabel);
	taskItem.appendChild(btnGroup);

	taskList.appendChild(taskItem);

	taskInput.value = '';
});

// Clear all
clearAllBtn.addEventListener('click', () => {
	if (!taskList.firstChild) return;

	const confirmed = confirm('Are you sure you want to clear all tasks?');
	if (!confirmed) return;

	taskList.innerHTML = '';
});