"use client";

import { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const notify = (start: Date | undefined, end: Date | undefined) => {
    onDateChange?.(start, end);
  };

  const presetRanges = [
    { label: 'Últimos 7 dias',   getValue: () => ({ start: subDays(new Date(), 7),   end: new Date() }) },
    { label: 'Últimos 30 dias',  getValue: () => ({ start: subDays(new Date(), 30),  end: new Date() }) },
    { label: 'Últimos 3 meses',  getValue: () => ({ start: subDays(new Date(), 90),  end: new Date() }) },
    { label: 'Últimos 12 meses', getValue: () => ({ start: subDays(new Date(), 365), end: new Date() }) },
    { label: 'Este mês',         getValue: () => ({ start: startOfMonth(new Date()),   end: new Date() }) },
    { label: 'Este trimestre',   getValue: () => ({ start: startOfQuarter(new Date()), end: new Date() }) },
    { label: 'Este ano',         getValue: () => ({ start: startOfYear(new Date()),    end: new Date() }) },
  ];

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    const { start, end } = preset.getValue();
    setStartDate(start);
    setEndDate(end);
    notify(start, end);
    setOpen(false);
  };

  const handleStartSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate && date > endDate) setEndDate(undefined);
  };

  const handleEndSelect = (date: Date | undefined) => {
    setEndDate(date);
    notify(startDate, date);
    if (date) setOpen(false);
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    notify(undefined, undefined);
  };

  const formatDateRange = () => {
    if (startDate && endDate)
      return `${format(startDate, 'dd/MM/yy')} - ${format(endDate, 'dd/MM/yy')}`;
    if (startDate)
      return `${format(startDate, 'dd/MM/yy')} - Fim`;
    return 'Selecionar período';
  };

  return (
    <div className="flex gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal flex-1 min-w-0">
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{formatDateRange()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[min(95vw,700px)] max-h-[85vh] p-0 flex flex-col"
          align="start"
          sideOffset={8}
          side="bottom"
          collisionPadding={8}
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Área scrollável */}
          <div className="flex flex-col sm:flex-row overflow-y-auto flex-1 min-h-0">
            {/* Presets: horizontal wrapping no mobile, coluna no desktop */}
            <div className="shrink-0 border-b sm:border-b-0 sm:border-r p-3">
              <p className="hidden sm:block text-xs font-medium text-muted-foreground px-2 mb-2">
                Períodos
              </p>
              <div className="flex flex-row flex-wrap gap-1 sm:flex-col">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs sm:text-sm whitespace-nowrap shrink-0"
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendários: empilhados no mobile, lado a lado no desktop */}
            <div className="flex flex-col sm:flex-row">
              <div className="shrink-0 p-3">
                <p className="text-xs font-medium text-muted-foreground text-center mb-1">Início</p>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartSelect}
                  locale={ptBR}
                />
              </div>
              <div className="shrink-0 border-t p-3 sm:border-t-0 sm:border-l">
                <p className="text-xs font-medium text-muted-foreground text-center mb-1">Fim</p>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndSelect}
                  disabled={(date) => (startDate ? date < startDate : false)}
                  locale={ptBR}
                />
              </div>
            </div>
          </div>

          {/* Footer fixo no fundo */}
          <div className="shrink-0 flex justify-end border-t bg-popover px-3 py-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Fechar
            </Button>
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
