import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { LengthConverter } from '@/components/LengthConverter';
import { WeightConverter } from '@/components/WeightConverter';
import { ClothingConverter } from '@/components/ClothingConverter';
import { Calculator } from '@/components/Calculator';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const [activeTab, setActiveTab] = useState('currency');

  const renderConverter = () => {
    switch (activeTab) {
      case 'currency':
        return <CurrencyConverter />;
      case 'length':
        return <LengthConverter />;
      case 'weight':
        return <WeightConverter />;
      case 'clothing':
        return <ClothingConverter />;
      case 'calculator':
        return <Calculator />;
      default:
        return <CurrencyConverter />;
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {renderConverter()}
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
