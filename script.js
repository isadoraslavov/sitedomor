// ... (Mantenha o início do script igual com suas credenciais)

async function renderizarAgenda() {
    const { data } = await _supabase.from('tarefas').select('*').order('horario', { ascending: true });
    const grid = document.getElementById('grid-horarios');
    grid.innerHTML = "";

    // Gerar horários das 08:00 às 17:00
    for (let h = 8; h <= 17; h++) {
        const horaFormatada = h < 10 ? `0${h}:00` : `${h}:00`;
        
        // Filtrar tarefas que batem com esta hora (ex: 08:30 cai na linha das 08h)
        const tarefasDaHora = data ? data.filter(t => t.horario.startsWith(h < 10 ? `0${h}` : `${h}`)) : [];

        let htmlTarefas = tarefasDaHora.map(t => `
            <div class="card-tarefa">
                <input type="checkbox" onchange="marcar(this)">
                <span><strong>${t.horario}</strong> - ${t.nome}</span>
            </div>
        `).join('');

        grid.innerHTML += `
            <div class="linha-hora">
                <div class="hora-label">${horaFormatada}</div>
                <div class="tarefa-slot">${htmlTarefas}</div>
            </div>
        `;
    }
}

// Função para o Check nas tarefas
function marcar(el) {
    const span = el.nextElementSibling;
    if(el.checked) {
        span.classList.add('concluida');
    } else {
        span.classList.remove('concluida');
    }
}

// Mantenha todas as outras funções (login, cadastro, deslogar, etc) exatamente como estão.
