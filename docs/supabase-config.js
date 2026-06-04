const supabaseUrl = "https://nqiljykeepyojaryyqad.supabase.co";
const supabaseKey = "sb_publishable_JJXFQu9Z_xTNNM6c_UlVcg_nWZGhl9a";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

function updateAuthUI(user) {
    const authGreeting = document.getElementById('authGreeting');
    const loginBtn = document.getElementById('loginBtn');

    if (!authGreeting || !loginBtn) return;

    if (user) {
        const name = user.user_metadata?.full_name || user.email || 'Usuario';
        authGreeting.classList.remove('hidden');
        authGreeting.innerHTML = `
            <span>Hola, ${name}</span>
            <button type="button" onclick="logout()" class="ml-2 rounded-full bg-white px-3 py-1 text-slate-900 font-black uppercase tracking-[0.15em]">Cerrar sesión</button>
        `;
        loginBtn.classList.add('hidden');
    } else {
        authGreeting.classList.add('hidden');
        authGreeting.innerHTML = '';
        loginBtn.classList.remove('hidden');
    }
}

async function loginConGoogle() {
    const currentLocation = window.location.origin + window.location.pathname;
    const isLocalhost = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    const isGithubPages = /github\.io$/.test(window.location.hostname);
    const URL_RED_DIRECCION = isLocalhost
        ? "http://127.0.0.1:5500/index.html"
        : isGithubPages
            ? "https://heinueljimenez.github.io/MANNA323/"
            : currentLocation;

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: URL_RED_DIRECCION }
    });

    if (error) {
        console.error("Error al conectar con Google:", error.message);
        alert('No se pudo iniciar sesión con Google. Intenta nuevamente.');
    }
}

async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Error al cerrar sesión:', error.message);
        return;
    }
    updateAuthUI(null);
}

async function initAuth() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
        console.error('Error obteniendo sesión:', error.message);
    }
    updateAuthUI(data?.session?.user ?? null);

    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateAuthUI(session?.user ?? null);
    });
}

window.loginConGoogle = loginConGoogle;
window.logout = logout;
window.addEventListener('DOMContentLoaded', initAuth);
