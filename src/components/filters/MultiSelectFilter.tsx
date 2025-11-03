"use client";

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronDown } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  options: FilterOption[];
  placeholder?: string;
  onSelectionChange?: (selected: string[]) => void;
}

export function MultiSelectFilter({ options, placeholder = 'Selecionar', onSelectionChange }: MultiSelectFilterProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const getButtonText = () => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) {
      return options.find((o) => o.value === selected[0])?.label || placeholder;
    }
    return `${selected.length} selecionados`;
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between w-full">
          <span className="truncate">{getButtonText()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start" sideOffset={8} side="bottom">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-3 space-y-2">
          {filteredOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={selected.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <label
                htmlFor={option.value}
                className="text-sm cursor-pointer flex-1"
              >
                {option.label}
              </label>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum resultado encontrado
            </p>
          )}
        </div>
        {selected.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelected([]);
                onSelectionChange?.([]);
              }}
              className="w-full"
            >
              Limpar seleção
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

