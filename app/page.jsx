'use client';

import { useEffect, useMemo, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import useProfile from '@/lib/useProfile';
import AuthModal from '@/components/AuthModal';

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { profile, loading: profileLoading, error: profileError, isNewUser, createProfile } = useProfile(session);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setAuthLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && !profileLoading && isNewUser) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [session, profileLoading, isNewUser]);

  const greeting = useMemo(() => {
    if (profile?.nombre_usuario) {
      return `Hola, ${profile.nombre_usuario}`;
    }
    if (session?.user?.email) {
      return `Bienvenido, ${session.user.email}`;
    }
    return 'Bienvenido a Manna Studio';
  }, [profile, session]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    } catch (error) {
      setAuthError(error?.message ?? 'Error al iniciar sesión con Google.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleSaveProfile = async ({ nombre_usuario }) => {
    if (!session?.user) {
      return;
    }

    const { error } = await createProfile({
      nombre_usuario,
      email: session.user.email,
    });

    if (!error) {
      setModalOpen(false);
    }
  };

  return (
    <main>
      <header>
        <div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>Manna Studio</p>
          <h1 className="page-title">Autenticación segura con Supabase</h1>
        </div>

        <nav>
          <span className="status-pill">{greeting}</span>
          {session ? (
            <button className="secondary" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <button className="primary" type="button" onClick={handleGoogleLogin} disabled={authLoading}>
              {authLoading ? 'Cargando...' : 'Entrar con Google'}
            </button>
          )}
        </nav>
      </header>

      <section className="section-card">
        <h2>Flujo de login y perfil</h2>
        <p>
          Esta integración usa Supabase Auth + tabla <strong>PERFILES</strong>. Si el usuario inicia sesión y aún no tiene perfil,
          se muestra un modal para registrar <strong>nombre_usuario</strong> y confirmar el email.
        </p>

        <div className="card-grid">
          <div>
            <p>
              Estado de autenticación: <strong>{session ? 'Autenticado' : 'No autenticado'}</strong>
            </p>
            <p>
              Estado del perfil: <strong>{profile ? 'Perfil encontrado' : isNewUser ? 'Nuevo usuario' : 'Pendiente'}</strong>
            </p>
            {profileError ? <div className="alert">{profileError}</div> : null}
            {authError ? <div className="alert">{authError}</div> : null}
          </div>

          <div>
            <h3>Usuario actual</h3>
            <p>Email: {session?.user?.email ?? 'Sin sesión'}</p>
            <p>ID: {session?.user?.id ?? 'Sin sesión'}</p>
          </div>
        </div>
      </section>

      <AuthModal
        open={modalOpen}
        email={session?.user?.email}
        loading={profileLoading}
        error={profileError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveProfile}
      />
    </main>
  );
}
