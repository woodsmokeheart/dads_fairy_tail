'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

interface BackButtonProps {
  title?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  title = "Вернуться назад",
  className = ""
}) => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Button
      variant="ghost"
      size="small"
      onClick={handleBack}
      title={title}
      className={className}
    >
      <ArrowLeft className="w-4 h-4" />
      Назад
    </Button>
  );
};

export default BackButton;
