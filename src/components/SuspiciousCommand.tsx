
import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SuspiciousCommand: React.FC = () => {
  const { toast } = useToast();

  const handleSuspiciousCommand = () => {
    toast({
      title: "⚠️ Suspicious Command Detected",
      description: "This message has been flagged as potentially suspicious and has been reported.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto glass p-6 rounded-xl mb-8 animate-fade-up animation-delay-200 border border-red-200">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-3 bg-red-100 rounded-full">
          <ShieldAlert className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-lg font-medium">Suspicious Command Center</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Report text that appears to contain suspicious content, threats, or harmful language
        </p>
        <Button 
          variant="destructive"
          onClick={handleSuspiciousCommand}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Report Suspicious Content
        </Button>
      </div>
    </div>
  );
};

export default SuspiciousCommand;
