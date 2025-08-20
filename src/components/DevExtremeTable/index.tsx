import React, { useRef } from 'react';
import DataGrid, {
  Column,
  Selection,
  FilterRow,
  Paging,
  Pager,
  Export,
  type DataGridTypes,
  type DataGridRef,
} from 'devextreme-react/data-grid';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setFilterForRouteField } from '@/features/tableFilters/tableFiltersSlice';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

import './styles.scss';

export type TColumns = {
  label: string;
  field: string;
  width?: number;
  maxWidth?: number;
  textOverflow?: 'nowrap' | 'break-word';
  disableSortBy?: boolean;
  renderComponent?: (props: Record<string, unknown>) => React.JSX.Element;
  hide?: boolean;
  filterType?: 'textInput' | 'select' | 'dateSelect' | 'radioGroup' | 'autocomplete';
}[];

type TRows = Record<string, unknown>;

type DevExtremeTableProps = {
  columns: TColumns;
  rows: TRows[];
  totalRecords?: number;
  checkboxSelection?: boolean;
  disableSearch?: boolean;
  disableSortBy?: boolean;
  cellPadding?: string | number;
  height?: string | number;
  isLoading?: boolean;
  clickableField?: string;
  onClick?: (row: TRows) => void;
  renderExpandedContent?: React.ReactNode;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
};

const exportFormats = ['pdf', 'xlsx'];

const onExporting = (e: DataGridTypes.ExportingEvent) => {
  if (e.format === 'xlsx') {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Fleet Data');

    exportToExcel({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'FleetData.xlsx');
      });
    });
  } else if (e.format === 'pdf') {
    const doc = new jsPDF();

    exportToPdf({
      jsPDFDocument: doc,
      component: e.component,
      indent: 5,
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    }).then(() => {
      doc.save('FleetData.pdf');
    });
  }
};

function DevExtremeTable({
  columns = [],
  rows = [],
  checkboxSelection = true,
  disableSearch = false,
  height,
  clickableField = '',
  onClick,
  onPageChange,
  onLimitChange,
}: DevExtremeTableProps) {
  console.log('table rows', rows);

  // Filter out hidden columns
  const visibleColumns = columns.filter(col => !col.hide);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const routeFilters = useAppSelector(state => state.tableFilters[location.pathname] ?? {});
  const dataGridRef = useRef<DataGridRef<TRows, string | number> | null>(null);
  const handleRowClick = (e: { data: Record<string, unknown> }) => {
    if (onClick && clickableField) {
      onClick(e.data);
    }
  };

  const HeaderWithMenu = ({ title }: { title: string }) => {
    // Check if there are any active filters for this route
    const hasActiveFilters = Object.values(routeFilters).some(
      value => value !== undefined && value !== null && value !== ''
    );

    return (
      <div className="dx-header-menu" onClick={e => e.stopPropagation()}>
        <span className="dx-header-menu__title">{title}</span>

        {/* Clear All Filters Icon - only show when there are active filters */}
        {hasActiveFilters && (
          <span
            className="dx-header-menu__clear-filters"
            title="Clear all filters"
            onClick={e => {
              e.stopPropagation();
              // Clear all filters for this route
              Object.keys(routeFilters).forEach(field => {
                dispatch(
                  setFilterForRouteField({
                    route: location.pathname,
                    field,
                    value: undefined,
                  })
                );
              });
            }}
          >
            <FilterAltOffIcon fontSize="small" />
          </span>
        )}
      </div>
    );
  };

  const handleOptionChanged = (e: DataGridTypes.OptionChangedEvent) => {
    if (typeof e.fullName !== 'string') return;

    // Detect filter row editor changes: columns[N].filterValue
    const match = e.fullName.match(/^columns\[(\d+)\]\.filterValue$/);
    if (match) {
      const columnIndex = Number(match[1]);
      const dataField = e.component.columnOption(columnIndex, 'dataField') as string | undefined;
      if (!dataField) return;
      const value = e.value as unknown;
      dispatch(setFilterForRouteField({ route: location.pathname, field: dataField, value }));
    }
  };

  return (
    <div className="dev-extreme-table-container" style={{ height: height ?? '100%' }}>
      <DataGrid
        dataSource={rows}
        showBorders={false}
        keyExpr="id"
        onExporting={onExporting}
        onRowClick={handleRowClick}
        onOptionChanged={handleOptionChanged}
        ref={dataGridRef}
        height="100%"
        showColumnLines={false}
        showRowLines={false}
        rowAlternationEnabled={false}
        hoverStateEnabled={false}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        remoteOperations={true}
      >
        {checkboxSelection && (
          <Selection
            mode="multiple"
            showCheckBoxesMode="always"
            selectAllMode="allPages"
            allowSelectAll={true}
          />
        )}

        <FilterRow visible={!disableSearch} />

        <Paging
          defaultPageSize={10}
          onPageSizeChange={onLimitChange}
          onPageIndexChange={onPageChange}
        />
        <Pager
          visible={true}
          showPageSizeSelector={true}
          allowedPageSizes={[10, 20, 30, 40, 50]}
          showInfo={true}
          infoText={`Page {0} of {1} ({2} items)`}
          displayMode="full"
          showNavigationButtons={true}
        />

        <Export enabled={true} formats={exportFormats} allowExportSelectedData={true} />

        {visibleColumns.map((column, index) => {
          const isLast = index === visibleColumns.length - 1;
          return (
            <Column
              key={index}
              dataField={column.field}
              caption={column.label}
              width={column.width}
              allowSorting={false}
              headerCellRender={isLast ? () => <HeaderWithMenu title={column.label} /> : undefined}
              cellRender={
                column.renderComponent
                  ? (cellInfo: DataGridTypes.ColumnCellTemplateData) => {
                      const RenderComponent = column.renderComponent!;
                      const componentProps = cellInfo.data[column.field];
                      if (typeof componentProps === 'object' && componentProps !== null) {
                        return <RenderComponent {...(componentProps as object)} />;
                      }
                      return <RenderComponent {...cellInfo.data} />;
                    }
                  : undefined
              }
            />
          );
        })}
      </DataGrid>
    </div>
  );
}

export default DevExtremeTable;
