import React, { useState, useEffect } from 'react';
import { Ruler, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseConversions } from '@/hooks/useFirebaseConversions';

interface LengthValues {
  cm: string;
  m: string;
  in: string;
  ft: string;
  yd: string;
}

const conversionFactors = {
  cm: 1,
  m: 0.01,
  in: 0.393701,
  ft: 0.0328084,
  yd: 0.0109361,
};

export const LengthConverter: React.FC = () => {
  const [values, setValues] = useState<LengthValues>({
    cm: '100',
    m: '1',
    in: '39.37',
    ft: '3.28',
    yd: '1.09',
  });
  const [lastChanged, setLastChanged] = useState<string>('cm');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { saveConversion } = useFirebaseConversions();

  const addToFavoritesMutation = useMutation({
    mutationFn: (favorite: any) => apiRequest('POST', '/api/favorites', favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({ title: 'Added to favorites', description: 'Conversion added to your favorites.' });
    },
  });

  const convertFromCm = (cmValue: number): LengthValues => {
    return {
      cm: cmValue.toString(),
      m: (cmValue * conversionFactors.m).toFixed(2),
      in: (cmValue * conversionFactors.in).toFixed(2),
      ft: (cmValue * conversionFactors.ft).toFixed(2),
      yd: (cmValue * conversionFactors.yd).toFixed(2),
    };
  };

  const handleValueChange = (unit: keyof LengthValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLastChanged(unit);

    // Convert input value to cm first
    let cmValue: number;
    switch (unit) {
      case 'cm':
        cmValue = numValue;
        break;
      case 'm':
        cmValue = numValue / conversionFactors.m;
        break;
      case 'in':
        cmValue = numValue / conversionFactors.in;
        break;
      case 'ft':
        cmValue = numValue / conversionFactors.ft;
        break;
      case 'yd':
        cmValue = numValue / conversionFactors.yd;
        break;
      default:
        cmValue = 0;
    }

    const newValues = convertFromCm(cmValue);
    newValues[unit] = value; // Keep the user's input as-is
    setValues(newValues);

    // Save conversion to Firebase if user is authenticated and value is valid
    if (user && numValue > 0) {
      saveConversion({
        type: 'length',
        fromUnit: unit,
        toUnit: 'cm', // Using cm as base unit
        fromValue: numValue,
        toValue: cmValue,
      });
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to save favorites.' });
      return;
    }

    addToFavoritesMutation.mutate({
      type: 'length',
      fromUnit: lastChanged,
      toUnit: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
            <Ruler className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Length Converter</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Convert between metric and imperial units</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddToFavorites}
          disabled={addToFavoritesMutation.isPending}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
        >
          <Heart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Centimeters</label>
          <Input
            type="number"
            placeholder="0"
            value={values.cm}
            onChange={(e) => handleValueChange('cm', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Meters</label>
          <Input
            type="number"
            placeholder="0"
            value={values.m}
            onChange={(e) => handleValueChange('m', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Inches</label>
          <Input
            type="number"
            placeholder="0"
            value={values.in}
            onChange={(e) => handleValueChange('in', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Feet</label>
          <Input
            type="number"
            placeholder="0"
            value={values.ft}
            onChange={(e) => handleValueChange('ft', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Yards</label>
          <Input
            type="number"
            placeholder="0"
            value={values.yd}
            onChange={(e) => handleValueChange('yd', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
