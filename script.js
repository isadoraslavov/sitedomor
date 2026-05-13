const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');

// DADOS PRESERVADOS DO EMAILJS
emailjs.init('J0om68UZr-X2iZqtQ');
const SERVICE_ID = 'service_4wdjx3o';
const TEMPLATE_ID = 'template_51imowl';

// LOGIN (Botão Funcional)
async function executarLogin() {
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    const msgErro = document.getElementById('erro-login');

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
        msgErro.innerText = "Falha: " + error.message;
    } else {
        document.getElementById('tela-login').classList.add('hidden');
        document.getElementById('tela-dashboard').classList.remove('hidden');
    }
}

// MUDAR ABAS (Botão Funcional)
function mudarAba(aba) {
    document.getElementById('aba-agendar').classList.add('hidden');
    document.getElementById('aba-visualizar').classList.add('hidden');

    if (aba === 'agendar') {
        document.getElementById('aba-agendar').classList.remove('hidden');
    } else {
        document.getElementById('aba-visualizar').classList.remove('hidden');
        carregarDados();
    }
}

// SALVAR TAREFA E ENVIAR EMAIL
document.getElementById('form-agendar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('task-name').value;
    const horario = document.getElementById('task-time').value;
    const status = document.getElementById('status-envio');

    const { error } = await _supabase.from('tarefas').insert([{ nome, horario }]);

    if (error) {
        status.innerText = "Erro ao salvar no banco.";
    } else {
        // Envio do EmailJS
        emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_name: "Isa", task_name: nome, task_time: horario })
            .then(() => {
                status.innerText = "Sucesso! Agendado e Notificado.";
                document.getElementById('form-agendar').reset();
            });
    }
});

// CARREGAR LISTA
async function carregarDados() {
    const { data } = await _supabase.from('tarefas').select('*').order('horario', { ascending: true });
    const lista = document.getElementById('lista-tarefas');
    lista.innerHTML = "";
    document.getElementById('contagem').innerText = data ? data.length : 0;
    
    if (data) {
        data.forEach(t => {
            lista.innerHTML += `<div class="tarefa-row"><strong>${t.horario}</strong> <span>${t.nome}</span></div>`;
        });
    }
}

function sair() { location.reload(); }
