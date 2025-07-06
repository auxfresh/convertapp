import React, { useState } from 'react';
import { Shirt, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SizeConversions {
  [key: string]: { US: string; UK: string; EU: string; };
}

const clothingSizes: SizeConversions = {
  'XS': { US: 'XS', UK: '6', EU: '32' },
  'S': { US: 'S', UK: '8', EU: '34' },
  'M': { US: 'M', UK: '10', EU: '36' },
  'L': { US: 'L', UK: '12', EU: '38' },
  'XL': { US: 'XL', UK: '14', EU: '40' },
  'XXL': { US: 'XXL', UK: '16', EU: '42' },
};

const shoeSizes: SizeConversions = {
  '6': { US: '6', UK: '5.5', EU: '39' },
  '6.5': { US: '6.5', UK: '6', EU: '39.5' },
  '7': { US: '7', UK: '6.5', EU: '40' },
  '7.5': { US: '7.5', UK: '7', EU: '40.5' },
  '8': { US: '8', UK: '7.5', EU: '41' },
  '8.5': { US: '8.5', UK: '8', EU: '42' },
  '9': { US: '9', UK: '8.5', EU: '42.5' },
  '9.5': { US: '9.5', UK: '9', EU: '43' },
  '10': { US: '10', UK: '9.5', EU: '44' },
  '10.5': { US: '10.5', UK: '10', EU: '44.5' },
  '11': { US: '11', UK: '10.5', EU: '45' },
  '11.5': { US: '11.5', UK: '11', EU: '45.5' },
  '12': { US: '12', UK: '11.5', EU: '46' },
};

export const ClothingConverter: React.FC = () => {
  const [type, setType] = useState<'clothing' | 'shoes'>('clothing');
  const [selectedSize, setSelectedSize] = useState('M');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveConversionMutation = useMutation({
    mutationFn: (conversion: any) => apiRequest('POST', '/api/conversions', conversion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversions/count'] });
    },
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: (favorite: any) => apiRequest('POST', '/api/favorites', favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({ title: 'Added to favorites', description: 'Conversion added to your favorites.' });
    },
  });

  const getCurrentSizes = () => {
    const sizeData = type === 'clothing' ? clothingSizes : shoeSizes;
    return sizeData[selectedSize] || { US: '', UK: '', EU: '' };
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    
    // Save conversion if user is authenticated
    if (user) {
      const currentSizes = type === 'clothing' ? clothingSizes[size] : shoeSizes[size];
      if (currentSizes) {
        saveConversionMutation.mutate({
          type: 'clothing',
          fromUnit: `US-${type}`,
          toUnit: `UK-EU-${type}`,
          fromValue: parseFloat(size) || 0,
          toValue: parseFloat(currentSizes.EU) || 0,
        });
      }
    }
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to save favorites.' });
      return;
    }

    addToFavoritesMutation.mutate({
      type: 'clothing',
      fromUnit: `US-${type}`,
      toUnit: `UK-EU-${type}`,
    });
  };

  const sizes = getCurrentSizes();
  const availableSizes = type === 'clothing' ? Object.keys(clothingSizes) : Object.keys(shoeSizes);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Shirt className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Clothing Size Converter</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Convert clothing and shoe sizes</p>
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

      <div className="space-y-6">
        {/* Type Selector */}
        <div className="flex space-x-4">
          <Button
            variant={type === 'clothing' ? 'default' : 'outline'}
            onClick={() => {
              setType('clothing');
              setSelectedSize('M');
            }}
            className={type === 'clothing' ? 'bg-primary text-white' : ''}
          >
            Clothing
          </Button>
          <Button
            variant={type === 'shoes' ? 'default' : 'outline'}
            onClick={() => {
              setType('shoes');
              setSelectedSize('9');
            }}
            className={type === 'shoes' ? 'bg-primary text-white' : ''}
          >
            Shoes
          </Button>
        </div>

        {/* Size Conversions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">US Size</label>
            <Select value={selectedSize} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">UK Size</label>
            <div className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
              {sizes.UK}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">EU Size</label>
            <div className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white">
              {sizes.EU}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
