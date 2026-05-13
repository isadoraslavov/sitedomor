// --- FUNÇÃO PARA GARANTIR QUE O SITE CARREGOU TUDO ---
window.onload = function() {

    // --- LÓGICA DE LOGIN (Só roda se o formulário existir na página) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log("Sistema de Login Ativo");
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email && password) {
                window.location.href = 'planner.html';
            } else {
                alert("Por favor, preencha todos os campos.");
            }
        });
    }

    // --- LÓGICA DO PLANNER (Só roda se a lista de tarefas existir na página) ---
    const taskListElement = document.getElementById('task-list');
    if (taskListElement) {
        console.log("Sistema de Planner Ativo");
        renderTasks(); // Carrega as tarefas salvas assim que entra na página
    }
};

// --- FUNÇÕES GERAIS DO PLANNER ---
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function addTask() {
    const nameInput = document.getElementById('task-name');
    const timeInput = document.getElementById('task-time');

    if (!nameInput.value || !timeInput.value) {
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
    
    // Limpa os campos após adicionar
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

    // Ordena por horário e renderiza
    tasks.sort((a, b) => a.time.localeCompare(b.time)).forEach(task => {
        if (!task.done) pending++;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="${task.done ? 'completed' : ''}"><strong>${task.time}</strong> - ${task.name}</span>
            </div>
            <button onclick="deleteTask(${task.id})" style="width: auto; background: #eee; color: #333; padding: 5px 10px; margin: 0; border: 1px solid #ccc;">Excluir</button>
        `;
        list.appendChild(li);
    });

    // Atualiza os contadores na tela
    const totalEl = document.getElementById('total-count');
    const pendingEl = document.getElementById('pending-count');
    
    if(totalEl) totalEl.innerText = tasks.length;
    if(pendingEl) pendingEl.innerText = pending;
}
