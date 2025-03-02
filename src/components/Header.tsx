
import React from 'react';
import { Camera, Mic, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="w-full px-6 py-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-2">
        <Camera className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-medium tracking-tight">Emotion-Detection</h1>
      </div>
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
          <Camera className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Visual</span>
        </Link>
        <Link to="/audio-emotion" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
          <Mic className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Audio</span>
        </Link>
        <Link to="/text-emotion" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
          <MessageCircle className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Text</span>
        </Link>
        <div className="hidden sm:flex items-center space-x-6">
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
      </div>
    </header>
  );
};

export default Header;
