import React, { useState } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstValue: number, secondValue: number, operator: string): number => {
    switch (operator) {
      case '+': return firstValue + secondValue;
      case '−': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=': return secondValue;
      default: return secondValue;
    }
  };

  const clearCalculator = () => {
    setDisplay('0');
    setOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display);
    }
  };

  const inputPercent = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <CalculatorIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Calculator</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Basic arithmetic operations</p>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto">
        {/* Calculator Display */}
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div className="text-right text-2xl font-mono text-slate-900 dark:text-white overflow-hidden">
            {display}
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="secondary"
            onClick={clearCalculator}
            className="p-4 font-medium"
          >
            C
          </Button>
          <Button
            variant="secondary"
            onClick={toggleSign}
            className="p-4 font-medium"
          >
            ±
          </Button>
          <Button
            variant="secondary"
            onClick={inputPercent}
            className="p-4 font-medium"
          >
            %
          </Button>
          <Button
            onClick={() => inputOperator('÷')}
            className="p-4 bg-primary hover:bg-blue-600 text-white font-medium"
          >
            ÷
          </Button>

          <Button
            variant="ghost"
            onClick={() => inputNumber('7')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            7
          </Button>
          <Button
            variant="ghost"
            onClick={() => inputNumber('8')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            8
          </Button>
          <Button
            variant="ghost"
            onClick={() => inputNumber('9')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            9
          </Button>
          <Button
            onClick={() => inputOperator('×')}
            className="p-4 bg-primary hover:bg-blue-600 text-white font-medium"
          >
            ×
          </Button>

          <Button
            variant="ghost"
            onClick={() => inputNumber('4')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            4
          </Button>
          <Button
            variant="ghost"
            onClick={() => inputNumber('5')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            5
          </Button>
          <Button
            variant="ghost"
            onClick={() => inputNumber('6')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            6
          </Button>
          <Button
            onClick={() => inputOperator('−')}
            className="p-4 bg-primary hover:bg-blue-600 text-white font-medium"
          >
            −
          </Button>

          <Button
            variant="ghost"
            onClick={() => inputNumber('1')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            1
          </Button>
          <Button
            variant="ghost"
            onClick={() => inputNumber('2')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            2
          </Button>
          <Button
            variant="ghost"
            onClick={() => inputNumber('3')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            3
          </Button>
          <Button
            onClick={() => inputOperator('+')}
            className="p-4 bg-primary hover:bg-blue-600 text-white font-medium"
          >
            +
          </Button>

          <Button
            variant="ghost"
            onClick={() => inputNumber('0')}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium col-span-2"
          >
            0
          </Button>
          <Button
            variant="ghost"
            onClick={inputDecimal}
            className="p-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium"
          >
            .
          </Button>
          <Button
            onClick={() => inputOperator('=')}
            className="p-4 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
};
