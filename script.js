const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');
emailjs.init('J0om68UZr-X2iZqtQ');

function toggleCards(modo) {
    document.getElementById('card-login').classList.add('hidden');
    document.getElementById('card-cadastro').classList.add('hidden');
    if(modo === 'login') document.getElementById('card-login').classList.remove('hidden');
    if(modo === 'cadastro') document.getElementById('card-cadastro').classList.remove('hidden');
}

// LOGIN E CADASTRO (MANTIDOS IGUAIS)
document.getElementById('btn-entrar').addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) { alert(error.message); } else {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dash-section').classList.remove('hidden');
    }
});

document.getElementById('btn-cadastrar').addEventListener('click', async () => {
    const email = document.getElementById('email-cad').value;
    const password = document.getElementById('senha-cad').value;
    const { error } = await _supabase.auth.signUp({ email, password });
    if (error) alert(error.message); else alert("Cadastrado! Use seus dados para logar.");
});

function aba(nome) {
    document.getElementById('aba-agendar').classList.add('hidden');
    document.getElementById('aba-lista').classList.add('hidden');
    if(nome === 'agendar') document.getElementById('aba-agendar').classList.remove('hidden');
    if(nome === 'lista') { document.getElementById('aba-lista').classList.remove('hidden'); renderizarPlanner(); }
}

// SALVAR TAREFA (MANTIDO)
document.getElementById('btn-salvar').addEventListener('click', async () => {
    const nome = document.getElementById('task-title').value;
    const horario = document.getElementById('task-hour').value;
    const { error } = await _supabase.from('tarefas').insert([{ nome, horario }]);
    if (!error) {
        emailjs.send('service_4wdjx3o', 'template_51imowl', { to_name: "Isa", task_name: nome, task_time: horario });
        alert("Agendado!");
    }
});

// NOVA FUNÇÃO DE RENDERIZAR O PLANNER
async function renderizarPlanner() {
    const { data } = await _supabase.from('tarefas').select('*').order('horario', { ascending: true });
    const grid = document.getElementById('grid-horarios');
    grid.innerHTML = "";

    for (let i = 8; i <= 17; i++) {
        const hStr = i < 10 ? `0${i}` : `${i}`;
        const tarefas = data ? data.filter(t => t.horario.startsWith(hStr)) : [];
        
        const htmlTarefas = tarefas.map(t => `
            <div class="mini-card">
                <input type="checkbox" onchange="this.parentElement.classList.toggle('concluida')">
                <span>${t.horario} - ${t.nome}</span>
            </div>
        `).join('');

        grid.innerHTML += `
            <div class="linha-hora">
                <div class="hora-txt">${hStr}:00</div>
                <div class="tarefa-slot">${htmlTarefas}</div>
            </div>`;
    }
}

function deslogar() { location.reload(); }
