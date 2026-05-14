// CONFIGURAÇÕES (MANTIDAS)
const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');
emailjs.init('J0om68UZr-X2iZqtQ');

let diaSelecionado = new Date().toISOString().split('T')[0];
let dataNavegacao = new Date();

// AUTH
function toggleCards(modo) {
    document.getElementById('card-login').classList.add('hidden');
    document.getElementById('card-cadastro').classList.add('hidden');
    document.getElementById(`card-${modo}`).classList.remove('hidden');
}

document.getElementById('btn-entrar').addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message); else {
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

// NAVEGAÇÃO ABAS
function aba(nome) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`aba-${nome}`).classList.remove('hidden');
    if(nome === 'lista') renderizarCalendario();
}

// SALVAR TAREFA (Envia o false e a data automaticamente)
document.getElementById('btn-salvar').addEventListener('click', async () => {
    const nome = document.getElementById('task-title').value;
    const data = document.getElementById('task-date').value;
    const horario = document.getElementById('task-hour').value;

    const { error } = await _supabase.from('tarefas').insert([{ 
        nome: nome, 
        data: data, 
        horario: horario, 
        concluida: false 
    }]);

    if (!error) {
        emailjs.send('service_4wdjx3o', 'template_51imowl', { to_name: "Isa", task_name: nome, task_time: horario });
        alert("Agendado com sucesso!");
        document.getElementById('task-title').value = "";
    } else {
        alert("Erro ao salvar. Verifique se as colunas 'data' e 'concluida' existem no seu Supabase.");
    }
});

// LÓGICA DO CALENDÁRIO
async function renderizarCalendario() {
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = "";
    const ano = dataNavegacao.getFullYear();
    const mes = dataNavegacao.getMonth();
    document.getElementById('mes-nome').innerText = dataNavegacao.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // Busca dias que têm tarefas para marcar no calendário
    const { data: tarefas } = await _supabase.from('tarefas').select('data');
    const diasComTarefa = tarefas ? tarefas.map(t => t.data) : [];

    const totalDias = new Date(ano, mes + 1, 0).getDate();
    for (let d = 1; d <= totalDias; d++) {
        const dIso = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const temClasse = diasComTarefa.includes(dIso) ? 'tem-task' : '';
        const selClasse = dIso === diaSelecionado ? 'sel' : '';
        grid.innerHTML += `<div class="dia-c ${temClasse} ${selClasse}" onclick="selecionarDia('${dIso}')">${d}</div>`;
    }
    renderizarGrade();
}

function selecionarDia(d) { diaSelecionado = d; renderizarCalendario(); }
function mudarMes(v) { dataNavegacao.setMonth(dataNavegacao.getMonth() + v); renderizarCalendario(); }

// GRADE DE HORÁRIOS (08:00 - 17:00)
async function renderizarGrade() {
    const { data: tarefas } = await _supabase.from('tarefas').select('*').eq('data', diaSelecionado).order('horario');
    const gridCorpo = document.getElementById('grade-corpo');
    document.getElementById('titulo-dia-selecionado').innerText = diaSelecionado.split('-').reverse().join('/');
    gridCorpo.innerHTML = "";

    for (let h = 8; h <= 17; h++) {
        const hFormat = h < 10 ? `0${h}:00` : `${h}:00`;
        const tFiltradas = tarefas ? tarefas.filter(t => t.horario.startsWith(h < 10 ? `0${h}` : `${h}`)) : [];
        
        gridCorpo.innerHTML += `
            <div class="linha-h">
                <div class="h-label">${hFormat}</div>
                <div class="t-area">
                    ${tFiltradas.map(t => `
                        <div class="t-card">
                            <input type="checkbox" onchange="this.parentElement.classList.toggle('riscado')">
                            <span>${t.horario} - ${t.nome}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }
}

function deslogar() { location.reload(); }
