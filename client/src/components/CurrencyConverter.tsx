import React, { useState, useEffect } from 'react';
import { DollarSign, Repeat, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseConversions } from '@/hooks/useFirebaseConversions';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyOption {
  code: string;
  name: string;
}

const currencies: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
];

export const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [fromAmount, setFromAmount] = useState<string>('100');
  const [convertedAmount, setConvertedAmount] = useState<string>('0');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { saveConversion } = useFirebaseConversions();

  const { data: exchangeRates, isLoading } = useQuery<ExchangeRates>({
    queryKey: ['/api/exchange-rates', fromCurrency],
    refetchInterval: 60000, // Refresh every minute
  });

  const addToFavoritesMutation = useMutation({
    mutationFn: (favorite: any) => apiRequest('POST', '/api/favorites', favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({ title: 'Added to favorites', description: 'Conversion added to your favorites.' });
    },
  });

  useEffect(() => {
    if (exchangeRates && fromAmount) {
      const rate = exchangeRates[toCurrency] || 0;
      const amount = parseFloat(fromAmount) || 0;
      const converted = amount * rate;
      setConvertedAmount(converted.toFixed(2));

      // Save conversion to Firebase if user is authenticated
      if (user && amount > 0) {
        saveConversion({
          type: 'currency',
          fromUnit: fromCurrency,
          toUnit: toCurrency,
          fromValue: amount,
          toValue: converted,
          exchangeRate: rate,
        });
      }
    }
  }, [exchangeRates, fromAmount, fromCurrency, toCurrency, user, saveConversion]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAddToFavorites = () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to save favorites.' });
      return;
    }

    addToFavoritesMutation.mutate({
      type: 'currency',
      fromUnit: fromCurrency,
      toUnit: toCurrency,
    });
  };

  const getCurrentExchangeRate = () => {
    if (!exchangeRates) return 0;
    return exchangeRates[toCurrency] || 0;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Currency Converter</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Real-time exchange rates</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Currency */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
          <div className="space-y-3">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter amount"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-xl"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="hidden md:flex items-center justify-center">
          <Button
            onClick={handleSwapCurrencies}
            className="p-3 rounded-full bg-primary text-white hover:bg-blue-600"
          >
            <Repeat className="h-5 w-5" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
          <div className="space-y-3">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-xl font-medium">
              {isLoading ? 'Loading...' : convertedAmount}
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Exchange Rate</span>
          <span className="font-medium text-slate-900 dark:text-white">
            1 {fromCurrency} = {getCurrentExchangeRate().toFixed(4)} {toCurrency}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-600 dark:text-slate-400">Last Updated</span>
          <span className="text-slate-500 dark:text-slate-400">
            {isLoading ? 'Updating...' : 'Just now'}
          </span>
        </div>
      </div>
    </div>
  );
};
