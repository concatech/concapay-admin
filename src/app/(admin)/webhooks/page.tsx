"use client";

import { useEffect, useState } from 'react';
import { WebhookEvent } from '@/types';
import { api } from '@/services/api';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TablePagination } from '@/components/shared/TablePagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [orderId, setOrderId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [selectedStatuses, selectedEventTypes, currentPage, pageSize]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (selectedStatuses.length > 0) {
        filters.status = selectedStatuses[0];
      }
      if (selectedEventTypes.length > 0) {
        filters.event_type = selectedEventTypes[0];
      }
      if (orderId) {
        filters.mercado_pago_order_id = orderId;
      }
      const data = await api.getWebhookEvents(filters);
      setEvents(data.data);
      setTotalItems(data.count || data.data.length);
    } catch (error) {
      console.error('Error loading webhook events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadEvents();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedEvents = events.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Webhook Events</h1>
        <p className="text-muted-foreground">Monitore eventos recebidos do Mercado Pago</p>
      </div>

      <FilterSection>
        <FilterGroup label="Order ID (Mercado Pago)">
          <Input
            placeholder="Buscar por Order ID..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
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
        <div className="flex items-end">
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </FilterSection>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos ({totalItems})</CardTitle>
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
                    {paginatedEvents.map((event) => (
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
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
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
            <p>
              <span className="text-gray-600">Status Detail:</span> {events[0]?.status_detail || 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

