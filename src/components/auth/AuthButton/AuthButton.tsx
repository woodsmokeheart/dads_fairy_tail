'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../AuthProvider/AuthProvider';
import styles from './AuthButton.module.css';

interface User {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
  };
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? {
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata || {}
      } : null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user;
        setUser(user ? {
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata || {}
        } : null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          window.location.href = '/';
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleSignIn = () => {
    openAuthModal();
  };

  if (loading) {
    return (
      <Button variant="ghost" size="small" disabled title="Загрузка...">
        <User className="w-4 h-4" />
      </Button>
    );
  }

  if (user) {
    return (
      <div className={styles.userMenu}>
        <Link href="/profile">
          <Button variant="ghost" size="small" title="Профиль">
            <User className="w-5 h-5" />
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="small" 
          onClick={handleSignOut}
          title="Выйти"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="small" onClick={handleSignIn} title="Войти">
      <LogIn className="w-5 h-5" />
    </Button>
  );
}
