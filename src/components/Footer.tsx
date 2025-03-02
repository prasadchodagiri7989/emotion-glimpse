
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full px-6 py-8 mt-auto animate-fade-in">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          © {new Date().getFullYear()} EmotionDetection. All rights reserved.
        </p>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Visual
          </Link>
          <Link to="/audio-emotion" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Audio
          </Link>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
