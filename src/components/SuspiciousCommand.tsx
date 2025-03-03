
import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuspiciousCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SuspiciousCommand: React.FC<SuspiciousCommandProps> = ({ 
  open = false, 
  onOpenChange
}) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(open);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleReport = () => {
    toast({
      title: "⚠️ Suspicious Content Reported",
      description: "This message has been flagged as potentially suspicious and has been reported.",
      variant: "destructive",
      duration: 5000,
    });
    handleOpenChange(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md border-red-200">
          <DialogHeader>
            <div className="mx-auto p-3 bg-red-100 rounded-full mb-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-center">Suspicious Content Detected</DialogTitle>
            <DialogDescription className="text-center">
              We have detected potentially harmful or distressing content. Would you like to report this?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              Our system has flagged this content as potentially containing fear, threats, or harmful language.
            </p>
          </div>
          
          <DialogFooter className="flex sm:justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Dismiss
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReport}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Report Suspicious Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* The button component can be kept for manual triggering if needed */}
      <div className="w-full max-w-lg mx-auto glass p-6 rounded-xl mb-8 animate-fade-up animation-delay-200 border border-red-200">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-medium">Suspicious Content Detected</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This content appears to contain fear, threats, or harmful language
          </p>
          <Button 
            variant="destructive"
            onClick={handleReport}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Report Suspicious Content
          </Button>
        </div>
      </div>
    </>
  );
};

export default SuspiciousCommand;
