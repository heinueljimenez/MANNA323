const supabaseUrl = "https://nqiljykeepyojaryyqad.supabase.co";
const supabaseKey = "sb_publishable_JJXFQu9Z_xTNNM6c_UlVcg_nWZGhl9a";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loginConGoogle() {
    const URL_RED_DIRECCION = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5500/index.html"
        : window.location.origin + window.location.pathname;

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: URL_RED_DIRECCION }
    });

    if (error) {
        console.error("Error al conectar con Google:", error.message);
    }
}

window.loginConGoogle = loginConGoogle;
