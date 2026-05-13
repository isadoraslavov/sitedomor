let tasks = [];

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;

    if (name && time) {
        const newTask = {
            id: Date.now(),
            name: name,
            time: time,
            done: false
        };
        tasks.push(newTask);
        updateUI();
        // Limpar campos
        document.getElementById('task-name').value = '';
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    updateUI();
}

function updateUI() {
    const list = document.getElementById('task-list');
    const totalSpan = document.getElementById('total-count');
    const pendingSpan = document.getElementById('pending-count');
    
    list.innerHTML = '';
    let pending = 0;

    tasks.forEach(task => {
        if (!task.done) pending++;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.done ? 'completed' : ''}">${task.time} - ${task.name}</span>
            <input type="checkbox" ${task.done ? 'checked' : ''} onclick="toggleTask(${task.id})">
        `;
        list.appendChild(li);
    });

    totalSpan.innerText = tasks.length;
    pendingSpan.innerText = pending;
}
