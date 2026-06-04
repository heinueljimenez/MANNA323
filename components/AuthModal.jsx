'use client';

import { useEffect, useState } from 'react';

export default function AuthModal({ open, email, onSubmit, onClose, loading, error }) {
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    if (open) {
      setNombreUsuario('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-panel">
        <h2 id="modal-title">Completa tu registro</h2>
        <p>Necesitamos un nombre de usuario para tu perfil de Manna Studio.</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ nombre_usuario: nombreUsuario.trim() });
          }}
        >
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email ?? ''} readOnly />

          <label htmlFor="nombre_usuario" style={{ marginTop: '1rem' }}>Nombre de usuario</label>
          <input
            id="nombre_usuario"
            type="text"
            value={nombreUsuario}
            onChange={(event) => setNombreUsuario(event.target.value)}
            placeholder="Escribe tu nombre de usuario"
            required
            minLength={3}
            autoComplete="username"
          />

          {error ? <div className="alert">{error}</div> : null}

          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="primary" disabled={loading || nombreUsuario.trim().length < 3}>
              {loading ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
