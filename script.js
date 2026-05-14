const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');
emailjs.init('J0om68UZr-X2iZqtQ');

let diaSelecionado = new Date().toISOString().split('T')[0];
let dataNavegacao = new Date();

// --- SISTEMA DE LOGIN ---
function toggleCards(modo) {
    document.getElementById('card-login').classList.add('hidden');
    document.getElementById('card-cadastro').classList.add('hidden');
    document.getElementById(`card-${modo}`).classList.remove('hidden');
}

document.getElementById('btn-entrar').addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erro: " + error.message);
    else {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dash-section').classList.remove('hidden');
    }
});

document.getElementById('btn-cadastrar').addEventListener('click', async () => {
    const email = document.getElementById('email-cad').value;
    const password = document.getElementById('senha-cad').value;
    const { error } = await _supabase.auth.signUp({ email, password });
    if (error) alert(error.message); else alert("Conta criada! Pode logar.");
});

// --- NAVEGAÇÃO ---
function aba(nome) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`aba-${nome}`).classList.remove('hidden');
    if(nome === 'lista') renderizarTudo();
}

// --- SALVAR TAREFA ---
document.getElementById('btn-salvar').addEventListener('click', async () => {
    const nome = document.getElementById('task-title').value;
    const data = document.getElementById('task-date').value;
    const horario = document.getElementById('task-hour').value;

    if(!nome || !data || !horario) return alert("Preencha tudo!");

    const { error } = await _supabase.from('tarefas').insert([{ 
        nome, data, horario, concluida: false 
    }]);

    if (!error) {
        emailjs.send('service_4wdjx3o', 'template_51imowl', { to_name: "Isa", task_name: nome, task_time: horario });
        alert("Agendado!");
        document.getElementById('task-title').value = "";
    } else alert("Erro ao salvar: " + error.message);
});

// --- RENDERIZAÇÃO DO CALENDÁRIO E GRADE ---
async function renderizarTudo() {
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = "Carregando...";
    
    const ano = dataNavegacao.getFullYear();
    const mes = dataNavegacao.getMonth();
    document.getElementById('mes-nome').innerText = dataNavegacao.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // 1. Puxa todas as datas que têm tarefas no Supabase
    const { data: tarefasExistentes } = await _supabase.from('tarefas').select('data');
    const datasComTarefa = tarefasExistentes ? tarefasExistentes.map(t => t.data) : [];

    grid.innerHTML = "";
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let d = 1; d <= totalDias; d++) {
        const dIso = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const temTask = datasComTarefa.includes(dIso) ? 'tem-task' : '';
        const selecionado = dIso === diaSelecionado ? 'sel' : '';

        const divDia = document.createElement('div');
        divDia.className = `dia-c ${temTask} ${selecionado}`;
        divDia.innerText = d;
        divDia.onclick = () => { diaSelecionado = dIso; renderizarTudo(); };
        grid.appendChild(divDia);
    }

    renderizarGrade();
}

async function renderizarGrade() {
    const { data: tarefasDia } = await _supabase.from('tarefas').select('*').eq('data', diaSelecionado).order('horario');
    const corpo = document.getElementById('grade-corpo');
    document.getElementById('titulo-dia').innerText = diaSelecionado.split('-').reverse().join('/');
    corpo.innerHTML = "";

    for (let h = 8; h <= 17; h++) {
        const hFormat = h < 10 ? `0${h}:00` : `${h}:00`;
        const tarefasHora = tarefasDia ? tarefasDia.filter(t => t.horario.startsWith(h < 10 ? `0${h}` : `${h}`)) : [];
        
        corpo.innerHTML += `
            <div class="linha-h">
                <div class="h-label">${hFormat}</div>
                <div class="t-area">
                    ${tarefasHora.map(t => `
                        <div class="t-card">
                            <input type="checkbox" onchange="this.parentElement.classList.toggle('riscado')">
                            <span>${t.horario} - ${t.nome}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }
}

function mudarMes(v) { dataNavegacao.setMonth(dataNavegacao.getMonth() + v); renderizarTudo(); }
function deslogar() { location.reload(); }
