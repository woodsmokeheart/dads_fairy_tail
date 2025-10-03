'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLogin(true); 
      setEmail('');
      setPassword('');
      setUsername('');
      setShowPassword(false);
      setLoading(false);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      } else {
        const { data: existingUser } = await supabase.auth.getUser();
        if (existingUser.user) {
          throw new Error('Вы уже авторизованы. Выйдите из аккаунта для регистрации нового пользователя.');
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            }
          }
        });
        
        if (error) throw error;
        
        if (!data.user) {
          throw new Error('Не удалось создать пользователя');
        }
        
        if (data.user.email_confirmed_at !== null) {
          throw new Error('Пользователь с таким email уже существует');
        }
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: username,
            }
          ]);
        
        if (profileError) {
          if (profileError.code === '23505') {
            if (profileError.message.includes('username')) {
              throw new Error('Пользователь с таким именем уже существует');
            } else {
              throw new Error('Пользователь с таким email уже существует');
            }
          }
          console.error('Ошибка создания профиля:', profileError);
          throw new Error('Ошибка создания профиля пользователя');
        }
      }
      
      onClose();
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setEmail('');
    setPassword('');
    setUsername('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Имя пользователя</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите имя пользователя"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Пароль</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              magic
            >
              {loading 
                ? 'Загрузка...' 
                : isLogin 
                  ? 'Войти' 
                  : 'Зарегистрироваться'
              }
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.switchText}>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          </p>
          <button
            className={styles.switchButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
