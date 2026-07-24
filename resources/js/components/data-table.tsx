import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    Column,
    ColumnDef,
    ColumnFiltersState,
    ColumnSizingState,
    RowSelectionState,
    Table as TanstackTable,
    VisibilityState,
} from '@tanstack/react-table';
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    ChevronDownIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData, TValue> {
        label?: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface TableMeta<TData> {
        sort?: string | null;
        direction?: 'asc' | 'desc' | null;
        onSortChange?: (columnId: string) => void;
    }
}

/**
 * Server-driven sort indicator/toggle. Reads the active sort from
 * `table.options.meta` (plain props from the page) rather than TanStack's
 * own sorting state, since the rows here are already sorted by the backend.
 */
export function DataTableColumnHeader<TData, TValue>({
    column,
    table,
    title,
}: {
    column: Column<TData, TValue>;
    table: TanstackTable<TData>;
    title: string;
}) {
    'use no memo';

    const meta = table.options.meta;

    if (!meta?.onSortChange) {
        return <span>{title}</span>;
    }

    const direction = meta.sort === column.id ? meta.direction : null;

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3"
            onClick={() => meta.onSortChange?.(column.id)}
        >
            {title}
            {direction === 'asc' ? (
                <ArrowUpIcon data-icon="inline-end" />
            ) : direction === 'desc' ? (
                <ArrowDownIcon data-icon="inline-end" />
            ) : (
                <ArrowUpDownIcon data-icon="inline-end" />
            )}
        </Button>
    );
}

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyMessage?: string;
    filterColumn?: { id: string; placeholder?: string };
    sort?: string | null;
    direction?: 'asc' | 'desc' | null;
    onSortChange?: (sort: string, direction: 'asc' | 'desc') => void;
    enableRowSelection?: boolean;
    onSelectedRowsChange?: (rows: TData[]) => void;
    bulkActions?: React.ReactNode;
    tableId?: string;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = 'No results.',
    filterColumn,
    sort = null,
    direction = null,
    onSortChange,
    enableRowSelection = false,
    onSelectedRowsChange,
    bulkActions,
    tableId,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
        if (!tableId) {
return {};
}

        const saved = localStorage.getItem(`table_sizing_${tableId}`);

        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        if (tableId && Object.keys(columnSizing).length > 0) {
            localStorage.setItem(`table_sizing_${tableId}`, JSON.stringify(columnSizing));
        }
    }, [columnSizing, tableId]);

    useEffect(() => {
        setRowSelection({});
    }, [data]);

    function handleSortChange(columnId: string) {
        const nextDirection: 'asc' | 'desc' =
            sort === columnId && direction === 'asc' ? 'desc' : 'asc';
        onSortChange?.(columnId, nextDirection);
    }

    const allColumns = enableRowSelection
        ? [
              {
                  id: 'select',
                  header: ({ table }) => (
                      <Checkbox
                          checked={
                              table.getIsAllPageRowsSelected() ||
                              (table.getIsSomePageRowsSelected() &&
                                  'indeterminate')
                          }
                          onCheckedChange={(value) =>
                              table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Select all"
                      />
                  ),
                  cell: ({ row }) => (
                      <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                          }
                          aria-label="Select row"
                      />
                  ),
                  enableSorting: false,
                  enableHiding: false,
              } as ColumnDef<TData, TValue>,
              ...columns,
          ]
        : columns;

    const table = useReactTable({
        data,
        columns: allColumns,
        manualSorting: true,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: (updater) => {
            setRowSelection((prev) => {
                const next =
                    typeof updater === 'function' ? updater(prev) : updater;

                setTimeout(() => {
                    const selectedRows = table
                        .getSelectedRowModel()
                        .rows.map((r) => r.original);
                    onSelectedRowsChange?.(selectedRows);
                });

                return next;
            });
        },

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        onColumnSizingChange: setColumnSizing,
        meta: {
            sort,
            direction,
            onSortChange: onSortChange ? handleSortChange : undefined,
        },
        state: {
            columnFilters,
            columnVisibility,
            rowSelection,
            columnSizing,
        },
    });

    const selectedCount = Object.keys(rowSelection).length;
    const filterColumnInstance = filterColumn
        ? table.getColumn(filterColumn.id)
        : undefined;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                {filterColumn ? (
                    <Input
                        value={
                            (filterColumnInstance?.getFilterValue() as
                                string | undefined) ?? ''
                        }
                        onChange={(e) =>
                            filterColumnInstance?.setFilterValue(e.target.value)
                        }
                        placeholder={filterColumn.placeholder ?? 'Filter…'}
                        className="max-w-sm"
                    />
                ) : (
                    <div />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Columns
                            <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.columnDef.meta?.label ??
                                            column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {enableRowSelection && selectedCount > 0 && bulkActions && (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
                    <span className="text-sm text-muted-foreground">
                        {selectedCount} row{selectedCount > 1 ? 's' : ''}{' '}
                        selected
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        {bulkActions}
                    </div>
                </div>
            )}

            <div className="overflow-auto rounded-xl border relative w-full">
                <Table style={{ tableLayout: 'fixed', width: table.getTotalSize(), minWidth: '100%' }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead 
                                        key={header.id}
                                        style={{ width: header.getSize(), position: 'relative' }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                onDoubleClick={() => header.column.resetSize()}
                                                className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none touch-none hover:bg-primary/50 ${
                                                    header.column.getIsResizing() ? 'bg-primary' : 'bg-border/50'
                                                }`}
                                            />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
