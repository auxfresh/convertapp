import React from 'react';
import { Star, Repeat, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Conversion, Favorite } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useFirebaseConversions } from '@/hooks/useFirebaseConversions';
import { ConversionRecord } from '@/lib/firebase';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { conversions, clearHistory, loading } = useFirebaseConversions();

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  const formatConversion = (conversion: ConversionRecord) => {
    const fromSymbol = conversion.type === 'currency' ? '' : ' ';
    const toSymbol = conversion.type === 'currency' ? (conversion.toUnit === 'EUR' ? '€' : '$') : ' ';
    return `${conversion.fromValue}${fromSymbol}${conversion.fromUnit} → ${toSymbol}${conversion.toValue.toFixed(2)}${conversion.toUnit === 'EUR' ? '' : ' ' + conversion.toUnit}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          {favorites.slice(0, 3).map((favorite) => (
            <button
              key={favorite.id}
              className="w-full p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-left transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-primary">
                    {favorite.fromUnit} → {favorite.toUnit}
                  </div>
                  <div className="text-sm text-slate-500">Favorite {favorite.type}</div>
                </div>
                <Star className="h-4 w-4 text-primary" />
              </div>
            </button>
          ))}

          {favorites.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user ? 'No favorites yet. Add some by clicking the heart icon on converters.' : 'Sign in to save favorite conversions.'}
            </p>
          )}
        </div>
      </div>

      {/* Conversion History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Conversions</h3>
          {conversions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              disabled={loading}
              className="text-sm text-primary hover:text-blue-600"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {conversions.slice(0, 5).map((conversion) => (
            <div key={conversion.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white text-sm">
                    {formatConversion(conversion)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatTimeAgo(conversion.timestamp)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                >
                  <Repeat className="h-3 w-3 text-slate-500" />
                </Button>
              </div>
            </div>
          ))}

          {conversions.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user ? 'No conversions yet. Start converting to see your history here.' : 'Sign in to save conversion history.'}
            </p>
          )}
        </div>

        {conversions.length > 5 && (
          <Button
            variant="secondary"
            className="w-full mt-4"
          >
            View All History
          </Button>
        )}
      </div>

      {/* Exchange Rate Trends */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Exchange Rate Trends</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">USD/EUR</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded">
                +0.15%
              </span>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">0.8527</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">USD/GBP</span>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded">
                -0.08%
              </span>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">0.7923</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">USD/JPY</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded">
                +0.32%
              </span>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">149.87</span>
          </div>
        </div>

        {/* Mini Chart Placeholder */}
        <div className="mt-6 h-24 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <TrendingUp className="h-4 w-4" />
            <span>Rate Trends Chart</span>
          </div>
        </div>
      </div>
    </div>
  );
};
