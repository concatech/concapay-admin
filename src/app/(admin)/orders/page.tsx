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
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FilterSection, FilterGroup } from '@/components/filters/FilterSection';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { DateRangeFilter } from '@/components/filters/DateRangeFilter';
import { Search, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TablePagination } from '@/components/shared/TablePagination';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useOrders, OrderFilters } from '@/hooks/useOrders';

export default function OrdersPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState(''); // Email aplicado na busca
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Monta os filtros para o hook
  const filters: OrderFilters = useMemo(() => {
    const f: OrderFilters = {
      page: currentPage,
      limit: pageSize,
    };
    if (selectedStatuses.length > 0) {
      f.status = selectedStatuses[0];
    }
    if (selectedPaymentMethods.length > 0) {
      f.payment_method = selectedPaymentMethods[0];
    }
    if (searchEmail) {
      f.buyer_email = searchEmail;
    }
    if (startDate) {
      f.inserted_at_start = format(startDate, 'yyyy-MM-dd');
    }
    if (endDate) {
      f.inserted_at_end = format(endDate, 'yyyy-MM-dd');
    }
    return f;
  }, [selectedStatuses, selectedPaymentMethods, searchEmail, startDate, endDate, currentPage, pageSize]);

  // Usa o hook React Query
  const { data, isLoading: loading } = useOrders(filters);
  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearchEmail(buyerEmail);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  const statusOptions = [
    { value: 'paid', label: 'Aprovado' },
    { value: 'pending', label: 'Pendente' },
    { value: 'refunded', label: 'Reembolsado' },
    { value: 'expired', label: 'Expirado' },
  ];

  const paymentMethodOptions = [
    { value: 'pix', label: 'PIX' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'boleto', label: 'Boleto' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#20304c] mb-2">Vendas</h1>
        <p className="text-lg text-[#20304c]">Visualize e gerencie todas as vendas da plataforma</p>
      </div>

      <FilterSection>
        <FilterGroup label="Email do Comprador">
          <Input
            placeholder="Buscar por email..."
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
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
        <FilterGroup label="Método de Pagamento">
          <MultiSelectFilter
            options={paymentMethodOptions}
            placeholder="Todos"
            onSelectionChange={setSelectedPaymentMethods}
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
          <CardTitle>Lista de Vendas ({pagination?.total_count ?? 0})</CardTitle>
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
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma venda encontrada</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Vendedor</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contestado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="whitespace-nowrap">{formatDate(order.inserted_at)}</TableCell>
                        <TableCell>{order.buyer_email}</TableCell>
                        <TableCell>
                          <div>
                            <div className="max-w-xs truncate">{order.offer.product.name}</div>
                            <div className="text-xs text-muted-foreground">{order.offer.product.segment}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{order.user.name}</div>
                            <div className="text-xs text-muted-foreground">{order.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.payment_method.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} type="order" />
                        </TableCell>
                        <TableCell>
                          {order.is_contested && (
                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Sim
                            </Badge>
                          )}
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
    </div>
  );
}

