// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (email) {
            window.location.href = 'planner.html';
        }
    });
}

// --- LÓGICA DO PLANNER ---
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function addTask() {
    const nameInput = document.getElementById('task-name');
    const timeInput = document.getElementById('task-time');

    if (nameInput.value === '' || timeInput.value === '') {
        alert("Preencha o nome e o horário!");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: nameInput.value,
        time: timeInput.value,
        done: false
    };

    tasks.push(newTask);
    saveAndRefesh();
    nameInput.value = '';
    timeInput.value = '';
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    saveAndRefesh();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRefesh();
}

function saveAndRefesh() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    if (!list) return;

    list.innerHTML = '';
    let pending = 0;

    tasks.sort((a, b) => a.time.localeCompare(b.time)).forEach(task => {
        if (!task.done) pending++;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="${task.done ? 'completed' : ''}"><strong>${task.time}</strong> - ${task.name}</span>
            </div>
            <button onclick="deleteTask(${task.id})" style="width: auto; background: #eee; color: #333; padding: 5px 10px; margin: 0;">Excluir</button>
        `;
        list.appendChild(li);
    });

    document.getElementById('total-count').innerText = tasks.length;
    document.getElementById('pending-count').innerText = pending;
}

// Inicia a lista ao carregar a página
if (document.getElementById('task-list')) {
    renderTasks();
}
