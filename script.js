// --- 1. LÓGICA DE LOGIN (VALIDANDO DADOS) ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        // Busca o usuário que foi salvo no LocalStorage
        const savedUser = JSON.parse(localStorage.getItem('userAccount'));

        if (savedUser && savedUser.email === emailInput && savedUser.password === passwordInput) {
            alert("Login realizado com sucesso!");
            window.location.href = 'planner.html';
        } else {
            alert("E-mail ou senha incorretos! (Ou conta não existe)");
        }
    });
}

// --- 2. LÓGICA DE CADASTRO (SALVANDO DADOS) ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Pega os dados dos campos (ajuste os IDs se necessário no seu HTML)
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            return alert("As senhas não coincidem!");
        }

        // Salva os dados no navegador
        const userData = { email: email, password: password };
        localStorage.setItem('userAccount', JSON.stringify(userData));

        alert("Conta criada! Agora você pode fazer login.");
        window.location.href = 'index.html';
    });
}
