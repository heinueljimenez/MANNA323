'use client';

import { useCallback, useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setIsNewUser(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('PERFILES')
      .select('id, nombre_usuario, email')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setProfile(null);
      setIsNewUser(false);
    } else {
      setProfile(data ?? null);
      setIsNewUser(!data);
    }

    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const createProfile = async ({ nombre_usuario, email }) => {
    if (!session?.user?.id) {
      const err = new Error('No se encontró sesión activa.');
      setError(err.message);
      return { data: null, error: err };
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('PERFILES')
      .insert({ id: session.user.id, nombre_usuario, email })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return { data: null, error };
    }

    setProfile(data);
    setIsNewUser(false);
    setLoading(false);
    return { data, error: null };
  };

  return {
    profile,
    loading,
    error,
    isNewUser,
    createProfile,
    refreshProfile: fetchProfile,
  };
}
