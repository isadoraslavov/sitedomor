window.onload = function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'planner.html';
        });
    }

    if (document.getElementById('planner-grid')) {
        renderPlanner();
    }
};

let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function renderPlanner() {
    const grid = document.getElementById('planner-grid');
    grid.innerHTML = '';
    
    // Criar linhas das 08:00 às 17:00
    for (let h = 8; h <= 17; h++) {
        const hourStr = h < 10 ? `0${h}:00` : `${h}:00`;
        
        const row = document.createElement('div');
        row.className = 'hour-row';
        
        // Filtrar tarefas desse horário
        const taskAtHour = tasks.filter(t => t.time.startsWith(hourStr.substring(0,2)));

        let taskHtml = '';
        taskAtHour.forEach(t => {
            taskHtml += `
                <div class="task-item">
                    <span class="${t.done ? 'completed-text' : ''}">${t.name}</span>
                    <div>
                        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${t.id})">
                        <button onclick="deleteTask(${t.id})" style="width:auto; padding:2px 5px; font-size:10px; background:red;">X</button>
                    </div>
                </div>
            `;
        });

        row.innerHTML = `
            <div class="time-label">${hourStr}</div>
            <div class="task-slot">${taskHtml}</div>
        `;
        grid.appendChild(row);
    }
    updateStats();
}

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;

    if (!name || !time) return alert("Preencha tudo!");

    tasks.push({ id: Date.now(), name, time, done: false });
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderPlanner();
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
    document.getElementById('total-count').innerText = tasks.length;
    document.getElementById('pending-count').innerText = tasks.filter(t => !t.done).length;
}
