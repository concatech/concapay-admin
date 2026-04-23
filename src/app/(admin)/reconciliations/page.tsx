"use client";

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterSection, FilterGroup } from '@/components/filters/FilterSection';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { DateRangeFilter } from '@/components/filters/DateRangeFilter';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TablePagination } from '@/components/shared/TablePagination';
import { formatDate } from '@/lib/utils';
import { format } from 'date-fns';
import { useReconciliations, ReconciliationFilters } from '@/hooks/useReconciliations';

export default function ReconciliationsPage() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filters: ReconciliationFilters = useMemo(() => {
    const f: ReconciliationFilters = {
      page: currentPage,
      page_size: pageSize,
    };
    if (searchOrderId) f.order_id = searchOrderId;
    if (selectedTypes.length > 0) f.reconciled_by_type = selectedTypes[0];
    if (startDate) f.from = format(startDate, "yyyy-MM-dd'T'00:00:00'Z'");
    if (endDate) f.to = format(endDate, "yyyy-MM-dd'T'23:59:59'Z'");
    return f;
  }, [searchOrderId, selectedTypes, startDate, endDate, currentPage, pageSize]);

  const { data, isLoading: loading } = useReconciliations(filters);
  const reconciliations = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearchOrderId(orderIdInput);
    setCurrentPage(1);
  };

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  const typeOptions = [
    { value: 'system_worker', label: 'Sistema (Worker)' },
    { value: 'admin_manual', label: 'Admin (Manual)' },
    { value: 'api_call', label: 'API Call' },
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      system_worker: 'Sistema',
      admin_manual: 'Manual',
      api_call: 'API',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#20304c] mb-2">Reconciliações</h1>
        <p className="text-lg text-[#20304c]">Histórico de reconciliações de pedidos</p>
      </div>

      <FilterSection>
        <FilterGroup label="Order ID">
          <Input
            placeholder="Buscar por Order ID..."
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </FilterGroup>
        <FilterGroup label="Tipo de Reconciliação">
          <MultiSelectFilter
            options={typeOptions}
            placeholder="Todos"
            onSelectionChange={setSelectedTypes}
          />
        </FilterGroup>
        <FilterGroup label="Período">
          <DateRangeFilter onDateChange={handleDateChange} />
        </FilterGroup>
        <div className="flex items-end">
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </FilterSection>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reconciliações ({pagination?.total ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              {reconciliations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma reconciliação encontrada</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Status Anterior</TableHead>
                        <TableHead>Novo Status</TableHead>
                        <TableHead>Status MP</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Motivo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliations.map((rec) => (
                        <TableRow key={rec.id}>
                          <TableCell className="whitespace-nowrap">{formatDate(rec.reconciled_at)}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {rec.order_id.substring(0, 8)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(rec.previous_status)} variant="outline">
                              {rec.previous_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(rec.new_status)} variant="outline">
                              {rec.new_status}
                            </Badge>
                          </TableCell>
                          <TableCell>{rec.mp_status || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getTypeLabel(rec.reconciled_by_type)}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{rec.reconciliation_reason || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <TablePagination
                currentPage={pagination?.page ?? currentPage}
                totalPages={pagination?.total_pages ?? 1}
                pageSize={pagination?.page_size ?? pageSize}
                totalCount={pagination?.total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
