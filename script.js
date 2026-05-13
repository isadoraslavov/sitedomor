// CONFIGURAÇÕES DO SUPABASE
const SUPABASE_URL = 'https://qbizialhpifperuvueqv.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- SUBSTITUA ESSES 3 CAMPOS COM SEUS DADOS DO EMAILJS ---
const EMAIL_PUBLIC_KEY = 'J0om68UZr-X2iZqtQ'; 
const EMAIL_SERVICE_ID = 'service_4wdjx3o';
const EMAIL_TEMPLATE_ID = 'template_51imowl';

// Inicializa o EmailJS
emailjs.init(EMAIL_PUBLIC_KEY);

const form = document.getElementById('form-planner');
const status = document.getElementById('mensagem-status');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome-tarefa').value;
    const horario = document.getElementById('horario-tarefa').value;
    const btn = document.getElementById('btn-salvar');

    btn.disabled = true;
    status.innerText = "Processando...";
    status.className = "";

    // 1. SALVAR NO SUPABASE (Tabela: tarefas)
    const { error } = await _supabase
        .from('tarefas')
        .insert([{ nome: nome, horario: horario }]);

    if (error) {
        status.className = "erro";
        status.innerText = "Erro no Banco: " + error.message;
        btn.disabled = false;
        return;
    }

    // 2. ENVIAR E-MAIL
    const templateParams = {
        to_name: "Isa", 
        task_name: nome,
        task_time: horario
    };

    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(() => {
            status.className = "sucesso";
            status.innerText = "Tarefa salva e e-mail enviado!";
            form.reset();
        })
        .catch((err) => {
            status.className = "erro";
            status.innerText = "Salvo no banco, mas o e-mail falhou.";
            console.error(err);
        })
        .finally(() => {
            btn.disabled = false;
        });
});
