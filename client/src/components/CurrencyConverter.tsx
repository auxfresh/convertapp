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
  // Major Currencies
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  
  // Asia Pacific
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'TWD', name: 'Taiwan Dollar' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'LKR', name: 'Sri Lankan Rupee' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
  { code: 'NPR', name: 'Nepalese Rupee' },
  
  // Middle East & Africa
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', name: 'Omani Rial' },
  { code: 'JOD', name: 'Jordanian Dinar' },
  { code: 'LBP', name: 'Lebanese Pound' },
  { code: 'ILS', name: 'Israeli Shekel' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'EGP', name: 'Egyptian Pound' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'GHS', name: 'Ghanaian Cedi' },
  { code: 'MAD', name: 'Moroccan Dirham' },
  { code: 'TND', name: 'Tunisian Dinar' },
  
  // Europe
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'PLN', name: 'Polish Zloty' },
  { code: 'CZK', name: 'Czech Koruna' },
  { code: 'HUF', name: 'Hungarian Forint' },
  { code: 'RON', name: 'Romanian Leu' },
  { code: 'BGN', name: 'Bulgarian Lev' },
  { code: 'HRK', name: 'Croatian Kuna' },
  { code: 'RSD', name: 'Serbian Dinar' },
  { code: 'ISK', name: 'Icelandic Krona' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'UAH', name: 'Ukrainian Hryvnia' },
  { code: 'BYN', name: 'Belarusian Ruble' },
  
  // Americas
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'ARS', name: 'Argentine Peso' },
  { code: 'CLP', name: 'Chilean Peso' },
  { code: 'COP', name: 'Colombian Peso' },
  { code: 'PEN', name: 'Peruvian Sol' },
  { code: 'UYU', name: 'Uruguayan Peso' },
  { code: 'BOB', name: 'Bolivian Boliviano' },
  { code: 'PYG', name: 'Paraguayan Guarani' },
  { code: 'VES', name: 'Venezuelan Bolívar' },
  { code: 'JMD', name: 'Jamaican Dollar' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar' },
  { code: 'BBD', name: 'Barbadian Dollar' },
  
  // Cryptocurrencies
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'USDT', name: 'Tether' },
  { code: 'BNB', name: 'Binance Coin' },
  { code: 'ADA', name: 'Cardano' },
  { code: 'SOL', name: 'Solana' },
  { code: 'XRP', name: 'Ripple' },
  { code: 'DOT', name: 'Polkadot' },
  { code: 'DOGE', name: 'Dogecoin' },
  { code: 'MATIC', name: 'Polygon' },
  
  // Additional World Currencies
  { code: 'AFN', name: 'Afghan Afghani' },
  { code: 'ALL', name: 'Albanian Lek' },
  { code: 'DZD', name: 'Algerian Dinar' },
  { code: 'AOA', name: 'Angolan Kwanza' },
  { code: 'XCD', name: 'East Caribbean Dollar' },
  { code: 'AMD', name: 'Armenian Dram' },
  { code: 'AWG', name: 'Aruban Florin' },
  { code: 'AZN', name: 'Azerbaijan Manat' },
  { code: 'BSD', name: 'Bahamian Dollar' },
  { code: 'BZD', name: 'Belize Dollar' },
  { code: 'BMD', name: 'Bermudian Dollar' },
  { code: 'BTN', name: 'Bhutanese Ngultrum' },
  { code: 'BWP', name: 'Botswana Pula' },
  { code: 'BND', name: 'Brunei Dollar' },
  { code: 'KHR', name: 'Cambodian Riel' },
  { code: 'CVE', name: 'Cape Verdean Escudo' },
  { code: 'KYD', name: 'Cayman Islands Dollar' },
  { code: 'XAF', name: 'Central African CFA Franc' },
  { code: 'XOF', name: 'West African CFA Franc' },
  { code: 'CDF', name: 'Congolese Franc' },
  { code: 'CRC', name: 'Costa Rican Colón' },
  { code: 'DJF', name: 'Djiboutian Franc' },
  { code: 'DOP', name: 'Dominican Peso' },
  { code: 'XPF', name: 'CFP Franc' },
  { code: 'ERN', name: 'Eritrean Nakfa' },
  { code: 'SZL', name: 'Eswatini Lilangeni' },
  { code: 'ETB', name: 'Ethiopian Birr' },
  { code: 'FKP', name: 'Falkland Islands Pound' },
  { code: 'FJD', name: 'Fijian Dollar' },
  { code: 'GMD', name: 'Gambian Dalasi' },
  { code: 'GEL', name: 'Georgian Lari' },
  { code: 'GIP', name: 'Gibraltar Pound' },
  { code: 'GTQ', name: 'Guatemalan Quetzal' },
  { code: 'GGP', name: 'Guernsey Pound' },
  { code: 'GNF', name: 'Guinean Franc' },
  { code: 'GYD', name: 'Guyanese Dollar' },
  { code: 'HTG', name: 'Haitian Gourde' },
  { code: 'HNL', name: 'Honduran Lempira' },
  { code: 'IQD', name: 'Iraqi Dinar' },
  { code: 'IRR', name: 'Iranian Rial' },
  { code: 'JEP', name: 'Jersey Pound' },
  { code: 'KZT', name: 'Kazakhstani Tenge' },
  { code: 'KGS', name: 'Kyrgyzstani Som' },
  { code: 'LAK', name: 'Lao Kip' },
  { code: 'LSL', name: 'Lesotho Loti' },
  { code: 'LRD', name: 'Liberian Dollar' },
  { code: 'LYD', name: 'Libyan Dinar' },
  { code: 'MOP', name: 'Macanese Pataca' },
  { code: 'MKD', name: 'Macedonian Denar' },
  { code: 'MGA', name: 'Malagasy Ariary' },
  { code: 'MWK', name: 'Malawian Kwacha' },
  { code: 'MVR', name: 'Maldivian Rufiyaa' },
  { code: 'IMP', name: 'Manx Pound' },
  { code: 'MRU', name: 'Mauritanian Ouguiya' },
  { code: 'MUR', name: 'Mauritian Rupee' },
  { code: 'MDL', name: 'Moldovan Leu' },
  { code: 'MNT', name: 'Mongolian Tugrik' },
  { code: 'MZN', name: 'Mozambican Metical' },
  { code: 'MMK', name: 'Myanmar Kyat' },
  { code: 'NAD', name: 'Namibian Dollar' },
  { code: 'NIO', name: 'Nicaraguan Córdoba' },
  { code: 'KPW', name: 'North Korean Won' },
  { code: 'PGK', name: 'Papua New Guinean Kina' },
  { code: 'RWF', name: 'Rwandan Franc' },
  { code: 'SHP', name: 'Saint Helena Pound' },
  { code: 'WST', name: 'Samoan Tala' },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra' },
  { code: 'SCR', name: 'Seychellois Rupee' },
  { code: 'SLL', name: 'Sierra Leonean Leone' },
  { code: 'SBD', name: 'Solomon Islands Dollar' },
  { code: 'SOS', name: 'Somali Shilling' },
  { code: 'SSP', name: 'South Sudanese Pound' },
  { code: 'SRD', name: 'Surinamese Dollar' },
  { code: 'SYP', name: 'Syrian Pound' },
  { code: 'TJS', name: 'Tajikistani Somoni' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'TOP', name: 'Tongan Paʻanga' },
  { code: 'TMT', name: 'Turkmenistani Manat' },
  { code: 'TVD', name: 'Tuvaluan Dollar' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'UZS', name: 'Uzbekistani Som' },
  { code: 'VUV', name: 'Vanuatu Vatu' },
  { code: 'YER', name: 'Yemeni Rial' },
  { code: 'ZMW', name: 'Zambian Kwacha' },
  { code: 'ZWL', name: 'Zimbabwean Dollar' },
].sort((a, b) => a.name.localeCompare(b.name));

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
