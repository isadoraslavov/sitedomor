const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');

emailjs.init('J0om68UZr-X2iZqtQ');
const S_ID = 'service_4wdjx3o';
const T_ID = 'template_51imowl';

// NAVEGAÇÃO ENTRE LOGIN E CADASTRO
function trocarAuth(tipo) {
    document.getElementById('card-login').classList.add('hidden');
    document.getElementById('card-cadastro').classList.add('hidden');
    if(tipo === 'login') document.getElementById('card-login').classList.remove('hidden');
    if(tipo === 'cadastro') document.getElementById('card-cadastro').classList.remove('hidden');
}

// FUNÇÃO DE LOGIN
async function executarLogin() {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const msg = document.getElementById('msg-login');

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        msg.innerText = "Erro: " + error.message;
        msg.style.color = "red";
    } else {
        document.getElementById('sessao-auth').classList.add('hidden');
        document.getElementById('tela-dashboard').classList.remove('hidden');
    }
}

// FUNÇÃO DE CADASTRO
async function executarCadastro() {
    const email = document.getElementById('email-cadastro').value;
    const password = document.getElementById('senha-cadastro').value;
    const msg = document.getElementById('msg-cadastro');

    const { data, error } = await _supabase.auth.signUp({ email, password });

    if (error) {
        msg.innerText = "Erro: " + error.message;
        msg.style.color = "red";
    } else {
        msg.innerText = "Sucesso! Verifique seu e-mail para confirmar.";
        msg.style.color = "green";
    }
}

// MUDAR ABAS DO DASHBOARD
function mudarAba(aba) {
    document.getElementById('aba-agendar').classList.add('hidden');
    document.getElementById('aba-agenda').classList.add('hidden');
    if(aba === 'agendar') document.getElementById('aba-agendar').classList.remove('hidden');
    if(aba === 'agenda') {
        document.getElementById('aba-agenda').classList.remove('hidden');
        carregarAgenda();
    }
}

// SALVAR TAREFA
document.getElementById('form-tarefa').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('t-nome').value;
    const horario = document.getElementById('t-hora').value;
    const status = document.getElementById('msg-tarefa');

    const { error } = await _supabase.from('tarefas').insert([{ nome, horario }]);

    if (!error) {
        emailjs.send(S_ID, T_ID, { to_name: "Isa", task_name: nome, task_time: horario });
        status.innerText = "Agendado!";
        document.getElementById('form-tarefa').reset();
    }
});

async function carregarAgenda() {
    const { data } = await _supabase.from('tarefas').select('*').order('horario', { ascending: true });
    const grid = document.getElementById('grid-tarefas');
    grid.innerHTML = data ? data.map(t => `<div class="item-t"><strong>${t.horario}</strong><span>${t.nome}</span></div>`).join('') : '';
}

function sair() { location.reload(); }
