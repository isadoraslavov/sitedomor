const SUPABASE_URL = 'https://qbizialhpifperuvueqv.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const EMAIL_PUBLIC_KEY = 'J0om68UZr-X2iZqtQ'; 
const EMAIL_SERVICE_ID = 'service_4wdjx3o';
const EMAIL_TEMPLATE_ID = 'template_51imowl';

emailjs.init(EMAIL_PUBLIC_KEY);

// --- FUNÇÃO DE LOGIN ---
async function login() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const status = document.getElementById('auth-status');

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (error) {
        status.innerText = "Erro: " + error.message;
        status.style.color = "red";
    } else {
        // Sucesso! Esconde login e mostra o resto
        document.getElementById('pag-login').classList.add('hidden');
        document.getElementById('main-nav').classList.remove('hidden');
        mostrarPagina('agendar');
    }
}

// --- NAVEGAÇÃO ---
function mostrarPagina(pagina) {
    document.getElementById('pag-agendar').classList.add('hidden');
    document.getElementById('pag-agenda-view').classList.add('hidden');
    
    if(pagina === 'agendar') {
        document.getElementById('pag-agendar').classList.remove('hidden');
    } else {
        document.getElementById('pag-agenda-view').classList.remove('hidden');
        carregarTarefas();
    }
}

// --- SALVAR TAREFA (Sua lógica preservada) ---
const form = document.getElementById('form-planner');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-tarefa').value;
    const horario = document.getElementById('horario-tarefa').value;
    const statusMsg = document.getElementById('mensagem-status');

    const { error } = await _supabase.from('tarefas').insert([{ nome, horario }]);

    if (error) {
        statusMsg.innerText = "Erro no Banco: " + error.message;
    } else {
        // Envia Email
        emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, { to_name: "Isa", task_name: nome, task_time: horario });
        statusMsg.innerText = "Tarefa salva e e-mail enviado!";
        form.reset();
    }
});

// --- CARREGAR TAREFAS ---
async function carregarTarefas() {
    const { data } = await _supabase.from('tarefas').select('*').order('horario', { ascending: true });
    const grid = document.getElementById('planner-grid');
    grid.innerHTML = "";
    document.getElementById('total-count').innerText = data ? data.length : 0;
    data.forEach(t => {
        grid.innerHTML += `<div class="tarefa-item"><strong>${t.horario}</strong> - ${t.nome}</div>`;
    });
}

function logout() {
    location.reload(); // Jeito mais rápido de deslogar e voltar pro início
}
