'use strict';

// DOM Elements
const titleInput  = document.getElementById('task-title');
const dateInput   = document.getElementById('task-date');
const labelSelect = document.getElementById('task-label');
const addBtn      = document.getElementById('add-task-btn');
const taskList    = document.getElementById('task-list');
const filterItems = document.querySelectorAll('.filter__list-item');

// Stores all task objects
let tasks = [];


// Add task
addBtn.addEventListener('click', () => {
	const title = titleInput.value.trim();
	const date  = dateInput.value;
	const label = labelSelect.value;

	if (!title) return;

	const newTask = {
		id: Date.now(),
		title: title,
		date: date,
		label: label,
		important: false,
		createAt: Date.now(),
	};

	tasks.push(newTask);
	renderTasks(tasks);

	titleInput.value  = '';
	dateInput.value   = '';
	labelSelect.value = '';
});

// Generates a task card based on a task object
function createTaskHTML(task) {
	const hasValue = task.date || task.label;
	return `
		<li class="task-board__list-item" data-id="${task.id}">
			<div class="task-board__card">
				<h3>${task.title}</h3>
				${
					hasValue
						? `
					<p>
						${task.date ? `<span class="task-board__card-date">${task.date}</span>` : ''}
						${task.label ? `<span class="task-board__card-label">${task.label}</span>` : ''}
					</p>`
						: ''
				}
			</div>
			<div class="task-board__card-actions">
				<button class="task-board__important-btn">
					<i class="bi bi-star${task.important ? '-fill' : ''}"></i>
				</button>
				<button class="task-board__edit-btn"><i class="bi bi-pencil"></i></button>
				<button class="task-board__delete-btn"><i class="bi bi-trash"></i></button>
			</div>
		</li>
	`;
}

// Clears the list and inserts task HTML
function renderTasks(list) {
	taskList.innerHTML = '';

	list.forEach((task) => {
		taskList.insertAdjacentHTML('beforeend', createTaskHTML(task));
	});

	addCardEvents();
}

// Attach events to each task card
function addCardEvents() {
	const deleteBtns    = document.querySelectorAll('.task-board__delete-btn');
	const importantBtns = document.querySelectorAll('.task-board__important-btn');
	const editBtns      = document.querySelectorAll('.task-board__edit-btn');

	// Delete task
	deleteBtns.forEach((deleteBtn) => {
		deleteBtn.addEventListener('click', (e) => {
			const targetId = getTaskId(e.target);
			tasks          = tasks.filter((task) => task.id != targetId);
			renderTasks(tasks);
		});
	});

	// Toggle important
	importantBtns.forEach((importantBtn) => {
		importantBtn.addEventListener('click', (e) => {
			const targetId       = getTaskId(e.target);
			const targetTask     = tasks.find((task) => task.id == targetId);
			targetTask.important = !targetTask.important;
			renderTasks(tasks);
		});
	});

	// Edit task (to be implemented)
	editBtns.forEach((editBtn) => {
		editBtn.addEventListener('click', () => {
			const targetId = getTaskId(e.target);
			console.log('edit:', targetId);
		});
	});
}

// Get task id from clicked element
function getTaskId(el) {
	return el.closest('.task-board__list-item').dataset.id;
}

// Filter tasks
filterItems.forEach((item) => {
	item.addEventListener('click', () => {
		const filter = item.dataset.filter;

		let filtered = tasks;

		if (filter === 'today') {
			const today = new Date().toISOString().split('T')[0];
			filtered = tasks.filter((task) => task.date === today);
		}

		if (filter === 'important') {
			filtered = tasks.filter((task) => task.important);
		}

		renderTasks(filtered);
	});
});
