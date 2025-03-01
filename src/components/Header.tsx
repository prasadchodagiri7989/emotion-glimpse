
import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full px-6 py-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-2">
        <Camera className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-medium tracking-tight">Emotion-Detection</h1>
      </div>
      <div className="hidden sm:flex items-center space-x-8">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          About
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Team
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Contact
        </a>
      </div>
    </header>
  );
};

export default Header;
