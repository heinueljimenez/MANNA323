const supabaseUrl = "https://nqiljykeepyojaryyqad.supabase.co";
const supabaseKey = "sb_publishable_JJXFQu9Z_xTNNM6c_UlVcg_nWZGhl9a";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

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
    }
}

window.loginConGoogle = loginConGoogle;
