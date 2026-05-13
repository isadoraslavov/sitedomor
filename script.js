// Configuração Supabase
const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');

// Configuração EmailJS
emailjs.init('J0om68UZr-X2iZqtQ');

// Alternar entre Login e Cadastro
function toggleCards(modo) {
    document.getElementById('card-login').classList.add('hidden');
    document.getElementById('card-cadastro').classList.add('hidden');
    if(modo === 'login') document.getElementById('card-login').classList.remove('hidden');
    if(modo === 'cadastro') document.getElementById('card-cadastro').classList.remove('hidden');
}

// LOGIN
document.getElementById('btn-entrar').addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const feedback = document.getElementById('feedback-login');

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

    if (error) {
        feedback.innerText = "Erro: " + error.message;
        feedback.style.color = "red";
    } else {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dash-section').classList.remove('hidden');
    }
});

// CADASTRO
document.getElementById('btn-cadastrar').addEventListener('click', async () => {
    const email = document.getElementById('email-cad').value;
    const password = document.getElementById('senha-cad').value;
    const feedback = document.getElementById('feedback-cad');

    const { data, error } = await _supabase.auth.signUp({ email, password });

    if (error) {
        feedback.innerText = "Erro: " + error.message;
    } else {
        feedback.innerText = "Sucesso! Verifique seu e-mail.";
        feedback.style.color = "green";
    }
});

// NAVEGAÇÃO ABAS
function aba(nome) {
    document.getElementById('aba-agendar').classList.add('hidden');
    document.getElementById('aba-lista').classList.add('hidden');
    if(nome === 'agendar') document.getElementById('aba-agendar').classList.remove('hidden');
    if(nome === 'lista') {
        document.getElementById('aba-lista').classList.remove('hidden');
        renderizarAgenda();
    }
}

// SALVAR TAREFA
document.getElementById('btn-salvar').addEventListener('click', async () => {
    const nome = document.getElementById('task-title').value;
    const horario = document.getElementById('task-hour').value;
    const msg = document.getElementById('msg-agendar');

    const { error } = await _supabase.from('tarefas').insert([{ nome, horario }]);

    if (!error) {
        emailjs.send('service_4wdjx3o', 'template_51imowl', { to_name: "Isa", task_name: nome, task_time: horario });
        msg.innerText = "Agendado!";
        document.getElementById('task-title').value = "";
    } else {
        msg.innerText = "Erro ao salvar.";
    }
});

async function renderizarAgenda() {
    const { data } = await _supabase.from('tarefas').select('*').order('horario', { ascending: true });
    const container = document.getElementById('lista-render');
    container.innerHTML = data ? data.map(t => `<div class="item-lista"><strong>${t.horario}</strong> <span>${t.nome}</span></div>`).join('') : '<p>Vazio</p>';
}

function deslogar() { location.reload(); }
