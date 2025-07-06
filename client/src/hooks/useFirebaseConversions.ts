import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  saveConversionToFirebase, 
  getRecentConversions, 
  clearConversionHistory, 
  ConversionRecord 
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseConversions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversions, setConversions] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setConversions([]);
      return;
    }

    setLoading(true);
    const unsubscribe = getRecentConversions(user.uid, 50, (newConversions) => {
      setConversions(newConversions);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  const saveConversion = async (conversion: Omit<ConversionRecord, 'id' | 'timestamp'>) => {
    if (!user?.uid) return;

    try {
      await saveConversionToFirebase(user.uid, conversion);
    } catch (error) {
      console.error('Error saving conversion:', error);
      toast({
        title: 'Error',
        description: 'Failed to save conversion to history.',
        variant: 'destructive',
      });
    }
  };

  const clearHistory = async () => {
    if (!user?.uid) return;

    try {
      await clearConversionHistory(user.uid);
      toast({
        title: 'History cleared',
        description: 'Your conversion history has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear conversion history.',
        variant: 'destructive',
      });
    }
  };

  return {
    conversions,
    loading,
    saveConversion,
    clearHistory,
    count: conversions.length,
  };
};