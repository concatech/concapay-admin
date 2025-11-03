"use client";

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format, subDays, startOfMonth, startOfYear, startOfQuarter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateRangeFilterProps {
  onDateChange?: (start: Date | undefined, end: Date | undefined) => void;
}

export function DateRangeFilter({ onDateChange }: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(startDate, endDate);
    }
  }, [startDate, endDate, onDateChange]);

  const presetRanges = [
    {
      label: 'Últimos 7 dias',
      getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }),
    },
    {
      label: 'Últimos 30 dias',
      getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }),
    },
    {
      label: 'Últimos 3 meses',
      getValue: () => ({ start: subDays(new Date(), 90), end: new Date() }),
    },
    {
      label: 'Últimos 12 meses',
      getValue: () => ({ start: subDays(new Date(), 365), end: new Date() }),
    },
    {
      label: 'Este mês',
      getValue: () => ({ start: startOfMonth(new Date()), end: new Date() }),
    },
    {
      label: 'Este trimestre',
      getValue: () => ({ start: startOfQuarter(new Date()), end: new Date() }),
    },
    {
      label: 'Este ano',
      getValue: () => ({ start: startOfYear(new Date()), end: new Date() }),
    },
  ];

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const { start, end } = preset.getValue();
    setStartDate(start);
    setEndDate(end);
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Selecionar período';
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
    }
    if (startDate) {
      return format(startDate, 'dd/MM/yyyy');
    }
    return 'Selecionar período';
  };

  return (
    <div className="flex gap-2 w-full">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal flex-1">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={8} side="bottom">
        <div className="flex">
          <div className="border-r p-4 space-y-1">
            <div className="mb-2 px-2">
              <p className="text-sm">Hoje</p>
            </div>
            {presetRanges.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-4">
            <div className="flex gap-4">
              <div>
                <p className="text-sm mb-2 text-center">
                  {startDate ? format(startDate, 'MMMM yyyy', { locale: ptBR }) : 'Início'}
                </p>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => setStartDate(date)}
                  locale={ptBR}
                />
              </div>
              <div>
                <p className="text-sm mb-2 text-center">
                  {endDate ? format(endDate, 'MMMM yyyy', { locale: ptBR }) : 'Fim'}
                </p>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => setEndDate(date)}
                  disabled={(date) => (startDate ? date < startDate : false)}
                  locale={ptBR}
                />
              </div>
            </div>
          </div>
        </div>
        </PopoverContent>
      </Popover>
      {(startDate || endDate) && (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClear}
        className="shrink-0"
        title="Limpar filtro"
      >
        <X className="h-4 w-4" />
      </Button>
    )}
    </div>
  );
}

