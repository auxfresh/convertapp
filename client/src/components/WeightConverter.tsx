import React, { useState } from 'react';
import { Scale, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseConversions } from '@/hooks/useFirebaseConversions';

interface WeightValues {
  kg: string;
  lb: string;
  g: string;
  oz: string;
}

const conversionFactors = {
  kg: 1,
  lb: 2.20462,
  g: 1000,
  oz: 35.274,
};

export const WeightConverter: React.FC = () => {
  const [values, setValues] = useState<WeightValues>({
    kg: '70',
    lb: '154.32',
    g: '70000',
    oz: '2469.17',
  });
  const [lastChanged, setLastChanged] = useState<string>('kg');
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

  const convertFromKg = (kgValue: number): WeightValues => {
    return {
      kg: kgValue.toString(),
      lb: (kgValue * conversionFactors.lb).toFixed(2),
      g: (kgValue * conversionFactors.g).toString(),
      oz: (kgValue * conversionFactors.oz).toFixed(2),
    };
  };

  const handleValueChange = (unit: keyof WeightValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLastChanged(unit);

    // Convert input value to kg first
    let kgValue: number;
    switch (unit) {
      case 'kg':
        kgValue = numValue;
        break;
      case 'lb':
        kgValue = numValue / conversionFactors.lb;
        break;
      case 'g':
        kgValue = numValue / conversionFactors.g;
        break;
      case 'oz':
        kgValue = numValue / conversionFactors.oz;
        break;
      default:
        kgValue = 0;
    }

    const newValues = convertFromKg(kgValue);
    newValues[unit] = value; // Keep the user's input as-is
    setValues(newValues);

    // Save conversion to Firebase if user is authenticated and value is valid
    if (user && numValue > 0) {
      saveConversion({
        type: 'weight',
        fromUnit: unit,
        toUnit: 'kg', // Using kg as base unit
        fromValue: numValue,
        toValue: kgValue,
      });
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to save favorites.' });
      return;
    }

    addToFavoritesMutation.mutate({
      type: 'weight',
      fromUnit: lastChanged,
      toUnit: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
            <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Weight Converter</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Convert between different weight units</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Kilograms</label>
          <Input
            type="number"
            placeholder="0"
            value={values.kg}
            onChange={(e) => handleValueChange('kg', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pounds</label>
          <Input
            type="number"
            placeholder="0"
            value={values.lb}
            onChange={(e) => handleValueChange('lb', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Grams</label>
          <Input
            type="number"
            placeholder="0"
            value={values.g}
            onChange={(e) => handleValueChange('g', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ounces</label>
          <Input
            type="number"
            placeholder="0"
            value={values.oz}
            onChange={(e) => handleValueChange('oz', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
