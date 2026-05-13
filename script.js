window.onload = function() {
    // --- 1. LÓGICA DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'planner.html';
        });
    }

    // --- 2. LÓGICA DE CADASTRO ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Conta criada com sucesso! Redirecionando para o login...");
            window.location.href = 'index.html';
        });
    }

    // --- 3. LÓGICA DE RECUPERAÇÃO ---
    const recoverForm = document.getElementById('recover-form');
    if (recoverForm) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Um link de recuperação foi enviado para o seu e-mail!");
            window.location.href = 'index.html';
        });
    }

    // --- 4. LÓGICA DO PLANNER ---
    if (document.getElementById('planner-grid')) {
        renderPlanner();
    }
};

// --- RESTANTE DAS FUNÇÕES DO PLANNER (Mantenha igual) ---
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function renderPlanner() {
    const grid = document.getElementById('planner-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    for (let h = 8; h <= 17; h++) {
        const hourStr = h < 10 ? `0${h}:00` : `${h}:00`;
        const row = document.createElement('div');
        row.className = 'hour-row';
        
        const taskAtHour = tasks.filter(t => t.time.startsWith(hourStr.substring(0,2)));

        let taskHtml = '';
        taskAtHour.forEach(t => {
            taskHtml += `
                <div class="task-item">
                    <span class="${t.done ? 'completed-text' : ''}">${t.name}</span>
                    <div>
                        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${t.id})">
                        <button onclick="deleteTask(${t.id})" style="width:auto; padding:2px 5px; font-size:10px; background:#ff4757; color:white; border:none; border-radius:3px; margin-left:5px;">X</button>
                    </div>
                </div>
            `;
        });

        row.innerHTML = `<div class="time-label">${hourStr}</div><div class="task-slot">${taskHtml}</div>`;
        grid.appendChild(row);
    }
    updateStats();
}

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;
    if (!name || !time) return alert("Preencha o nome e o horário!");
    tasks.push({ id: Date.now(), name, time, done: false });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderPlanner();
    document.getElementById('task-name').value = '';
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderPlanner();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderPlanner();
}

function updateStats() {
    const totalCount = document.getElementById('total-count');
    const pendingCount = document.getElementById('pending-count');
    if (totalCount) totalCount.innerText = tasks.length;
    if (pendingCount) pendingCount.innerText = tasks.filter(t => !t.done).length;
}
