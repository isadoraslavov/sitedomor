const _supabase = supabase.createClient('https://qbizialhpifperuvueqv.supabase.co', 'sb_publishable_i8-8p1E4Ia36CmFcUIcdrA_P92HMq74');

let diaFoco = new Date().toISOString().split('T')[0];
let dataNav = new Date();

function toggleCards(m) {
    document.getElementById('card-login').classList.add('hidden');
    document.getElementById('card-cadastro').classList.add('hidden');
    document.getElementById(`card-${m}`).classList.remove('hidden');
}

// LOGIN (MANTIDO)
document.getElementById('btn-entrar').addEventListener('click', async () => {
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('senha-login').value;
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    if (!error) {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dash-section').classList.remove('hidden');
    } else alert("Erro no login!");
});

// NAVEGAÇÃO
function aba(n) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`aba-${n}`).classList.remove('hidden');
    if(n === 'lista') renderizarTudo();
}

// SALVAR (Agora envia a data certinha)
document.getElementById('btn-salvar').addEventListener('click', async () => {
    const nome = document.getElementById('task-title').value;
    const data = document.getElementById('task-date').value;
    const horario = document.getElementById('task-hour').value;
    const { error } = await _supabase.from('tarefas').insert([{ nome, data, horario, concluida: false }]);
    if(!error) alert("Agendado!");
});

// DESENHAR TUDO
async function renderizarTudo() {
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = "";
    
    const mes = dataNav.getMonth();
    const ano = dataNav.getFullYear();
    document.getElementById('mes-nome').innerText = dataNav.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    // Pega datas do Supabase
    const { data: dbData } = await _supabase.from('tarefas').select('data');
    const datasOcupadas = dbData ? dbData.map(t => t.data) : [];

    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    for (let d = 1; d <= ultimoDia; d++) {
        const dIso = `${ano}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const hasTask = datasOcupadas.includes(dIso) ? 'tem-compromisso' : '';
        const isSel = dIso === diaFoco ? 'selecionado' : '';

        const div = document.createElement('div');
        div.className = `dia-box ${hasTask} ${isSel}`;
        div.innerText = d;
        div.onclick = () => { diaFoco = dIso; renderizarTudo(); };
        grid.appendChild(div);
    }
    renderizarGrade();
}

async function renderizarGrade() {
    const { data } = await _supabase.from('tarefas').select('*').eq('data', diaFoco).order('horario');
    const grade = document.getElementById('grade-horarios');
    document.getElementById('titulo-dia').innerText = diaFoco.split('-').reverse().join('/');
    grade.innerHTML = "";

    for (let h = 8; h <= 17; h++) {
        const hS = h < 10 ? `0${h}:00` : `${h}:00`;
        const tasks = data ? data.filter(t => t.horario.startsWith(h < 10 ? `0${h}` : `${h}`)) : [];
        
        grade.innerHTML += `
            <div class="linha-horario">
                <div class="hora-label">${hS}</div>
                <div class="tarefa-caixa">
                    ${tasks.length > 0 ? tasks.map(t => `<input type="checkbox"> ${t.nome}`).join('') : '--'}
                </div>
            </div>`;
    }
}

function mudarMes(v) { dataNav.setMonth(dataNav.getMonth() + v); renderizarTudo(); }
function deslogar() { location.reload(); }
