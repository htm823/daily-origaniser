'use strict';

const titleInput = document.getElementById('task-title');
const dateInput = document.getElementById('task-date');
const labelSelect = document.getElementById('task-label');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterItems = document.querySelectorAll('.filter__list-item');

let tasks = [];

addBtn.addEventListener('click', () => {
	const title = titleInput.value.trim();
	const date = dateInput.value;
	const label = labelSelect.value;

	if (!title) return;

	const newTask = {
		id: Date.now(),
		title: title,
		date: date,
		label: label,
		important: false,
		createdAt: Date.now(),
	};

	tasks.push(newTask);
	renderTasks(tasks);

	titleInput.value = '';
	dateInput.value = '';
	labelSelect.value = '';
});

// Task Card Template
function createTaskHTML(task) {
	return `
		<li class="task-board__list-item" data-id="${task.id}">
			<div class="task-board__card">
				<h3>${task.title}</h3>
				<span class="task-board__card-text">
					<span class="task-board__card-date">${task.date || ''}</span>
					<span class="task-board__card-label">${task.label || ''}</span>
				</span>
			</div>
			<div class="task-board__actions">
				<button class="task-board__task-important">
					<i class="bi bi-star${task.important ? '-fill' : ''}"></i>
				</button>
				<button class="task-board__task-edit"><i class="bi bi-pencil"></i></button>
        		<button class="task-board__task-delete"><i class="bi bi-trash"></i></button>
			</div>
		</li>`;
}

function renderTasks(list) {
	taskList.innerHTML = '';

	list.forEach(task => {
		taskList.insertAdjacentHTML('beforeend', createTaskHTML(task));
	});

	addCardEvents();
}

function addCardEvents() {
	const deleteBtns = document.querySelectorAll('.task-board__task-delete');
	const importantBtns = document.querySelectorAll('.task-board__task-important');
	const editBtns = document.querySelectorAll('.task-board__task-edit');

	deleteBtns.forEach(btn => {
		btn.addEventListener('click', (e) => {
			const id = getTaskId(e.target);
			tasks = tasks.filter(task => task.id != id);
			renderTasks(tasks);
		});
	});

	importantBtns.forEach(btn => {
		btn.addEventListener('click', (e) => {
			const id = getTaskId(e.target);
			const task = tasks.find(t => t.id == id);
			task.important = !task.important;
			renderTasks(tasks);
		});
	});

	editBtns.forEach(btn => {
		btn.addEventListener('click', (e) => {
			const id = getTaskId(e.target);
			console.log('edit:', id);
			// Implement inline editting later
		});
	});

	function getTaskId(el) {
		return el.closest('.task-board__list-item').dataset.id
	}
}

filterItems.forEach(item => {
	item.addEventListener('click', () => {
		const filter = item.dataset.filter;

		let filtered = tasks;

		if (filter === 'today') {
			const today = new Date().toISOString().split('T')[0];
			filtered = tasks.filter(task => task.date === today);
		}

		if (filter === 'important') {
			filtered = tasks.filter(task => task.important);
		}

		renderTasks(filtered);
	});
});