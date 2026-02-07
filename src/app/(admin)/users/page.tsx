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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterSection, FilterGroup } from '@/components/filters/FilterSection';
import { Search, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TablePagination } from '@/components/shared/TablePagination';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { useUsers, UserFilters } from '@/hooks/useUsers';

export default function UsersPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [searchEmail, setSearchEmail] = useState(''); // Email aplicado na busca
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Monta os filtros para o hook
  const filters: UserFilters = useMemo(() => ({
    email: searchEmail || undefined,
    page: currentPage,
    limit: pageSize,
  }), [searchEmail, currentPage, pageSize]);

  // Usa o hook React Query
  const { data, isLoading: loading } = useUsers(filters);
  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearchEmail(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#20304c] mb-2">Usuários</h1>
        <p className="text-lg text-[#20304c]">Gerencie todos os usuários da plataforma</p>
      </div>

      <FilterSection>
        <FilterGroup label="Email">
          <Input
            placeholder="Buscar por email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
          <CardTitle>Lista de Usuários ({pagination?.total_count ?? 0})</CardTitle>
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
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-100">
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Nome</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Email</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Tipo</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Cadastrado em</TableHead>
                        <TableHead className="text-right text-base font-bold text-gray-900 px-6 py-3">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={user.id} className={index % 2 === 1 ? "bg-[#f5f9fe]" : "bg-white"}>
                          <TableCell className="px-6 py-4">{user.name}</TableCell>
                          <TableCell className="px-6 py-4">{user.email}</TableCell>
                          <TableCell className="px-6 py-4">
                            {user.is_admin ? (
                              <Badge variant="destructive">Admin</Badge>
                            ) : (
                              <Badge variant="secondary">Usuário</Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4">{formatDate(user.inserted_at)}</TableCell>
                          <TableCell className="text-right px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/users/${user.id}`)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver detalhes
                            </Button>
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

