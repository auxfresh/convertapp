
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  ConversionRecord, 
  saveConversionToLocalStorage, 
  getConversionsFromLocalStorage, 
  clearConversionHistory as clearLocalConversionHistory 
} from '@/lib/localStorage';

export const useFirebaseConversions = () => {
  const { user } = useAuth();
  const [conversions, setConversions] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load conversions from localStorage
      const savedConversions = getConversionsFromLocalStorage();
      setConversions(savedConversions);
    } else {
      setConversions([]);
    }
  }, [user]);

  const saveConversion = async (conversion: Omit<ConversionRecord, 'id' | 'timestamp'>) => {
    if (!user) return;

    try {
      setLoading(true);
      const id = saveConversionToLocalStorage(conversion);
      
      // Update local state
      const updatedConversions = getConversionsFromLocalStorage();
      setConversions(updatedConversions);
      
      return id;
    } catch (error) {
      console.error('Error saving conversion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearConversionHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      clearLocalConversionHistory();
      setConversions([]);
    } catch (error) {
      console.error('Error clearing conversion history:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    conversions,
    loading,
    saveConversion,
    clearConversionHistory,
  };
};

// Keep the same export name for compatibility
export const useLocalStorageConversions = useFirebaseConversions;
