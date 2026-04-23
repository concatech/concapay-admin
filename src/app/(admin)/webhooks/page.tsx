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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FilterSection, FilterGroup } from '@/components/filters/FilterSection';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { DateRangeFilter } from '@/components/filters/DateRangeFilter';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TablePagination } from '@/components/shared/TablePagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useWebhookEvents, WebhookFilters } from '@/hooks/useWebhooks';

export default function WebhooksPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filters: WebhookFilters = useMemo(() => {
    const f: WebhookFilters = {
      page: currentPage,
      limit: pageSize,
    };
    if (selectedStatuses.length > 0) f.status = selectedStatuses[0];
    if (selectedEventTypes.length > 0) f.event_type = selectedEventTypes[0];
    if (searchOrderId) f.order_id = searchOrderId;
    if (startDate) f.inserted_at_start = format(startDate, 'yyyy-MM-dd');
    if (endDate) f.inserted_at_end = format(endDate, 'yyyy-MM-dd');
    return f;
  }, [selectedStatuses, selectedEventTypes, searchOrderId, startDate, endDate, currentPage, pageSize]);

  const { data, isLoading: loading } = useWebhookEvents(filters);
  const events = data?.data ?? [];
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const statusOptions = [
    { value: 'processed', label: 'Processado' },
    { value: 'action_required', label: 'Ação Necessária' },
    { value: 'failed', label: 'Falhou' },
  ];

  const eventTypeOptions = [
    { value: 'order', label: 'Pedido' },
    { value: 'payment', label: 'Pagamento' },
    { value: 'unknown', label: 'Desconhecido' },
  ];

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: 'Pedido',
      payment: 'Pagamento',
      unknown: 'Desconhecido',
    };
    return labels[type] || type;
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#20304c] mb-2">Webhook Events</h1>
        <p className="text-lg text-[#20304c]">Monitore eventos recebidos do Mercado Pago</p>
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
        <FilterGroup label="Status">
          <MultiSelectFilter
            options={statusOptions}
            placeholder="Todos"
            onSelectionChange={setSelectedStatuses}
          />
        </FilterGroup>
        <FilterGroup label="Tipo de Evento">
          <MultiSelectFilter
            options={eventTypeOptions}
            placeholder="Todos"
            onSelectionChange={setSelectedEventTypes}
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
          <CardTitle>Lista de Eventos ({pagination?.total_count ?? 0})</CardTitle>
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
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhum evento encontrado</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recebido em</TableHead>
                        <TableHead>Processado em</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>ID Mercado Pago</TableHead>
                        <TableHead>Oferta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(event.webhook_received_at)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {event.processed_at ? formatDate(event.processed_at) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {event.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getEventTypeLabel(event.event_type)}</Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={event.status} type="webhook" />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatCurrency(event.total_amount)}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <div className="text-muted-foreground">Pedido:</div>
                              <div className="font-mono">{event.mercado_pago_order_id}</div>
                              <div className="text-muted-foreground mt-1">Pagamento:</div>
                              <div className="font-mono">{event.mercado_pago_payment_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {event.offer_id}
                            </code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <TablePagination
                currentPage={pagination?.page ?? currentPage}
                totalPages={pagination?.total_pages ?? 1}
                pageSize={pagination?.limit ?? pageSize}
                totalCount={pagination?.total_count}
                hasNext={pagination?.has_next}
                hasPrev={pagination?.has_prev}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">Eventos de Pedido:</span> Relacionados ao ciclo de vida do pedido
            </p>
            <p>
              <span className="text-gray-600">Eventos de Pagamento:</span> Relacionados ao processamento de
              pagamentos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
