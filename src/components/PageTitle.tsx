
import React from 'react';

interface PageTitleProps {
  title: string;
  description: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-12 space-y-2 animate-blur-in">
      <div className="mb-3">
        <span className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground font-medium">
          Video Analysis
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 font-heading">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default PageTitle;
