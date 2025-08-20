import './styles.scss';
import React, { useEffect } from 'react';
import { MenuItem, Pagination, Select, styled } from '@mui/material';
import {
  resetTableData,
  updateLimit,
  updatePage,
  updateSelectedRows,
  updateSortBy,
} from '@/features/table/tableSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from 'react-icons/ti';
import PageLoader from '../PageLoader';
import { motion } from 'framer-motion';

export type TColumns = {
  label: string;
  field: string;
  width?: number;
  maxWidth?: number;
  textOverflow?: 'nowrap' | 'break-word';
  disableSortBy?: boolean;
  renderComponent?: (props: any) => React.JSX.Element;
  hide?: boolean;
  filterType?: 'textInput' | 'select' | 'dateSelect' | 'radioGroup' | 'autocomplete';
}[];

type TRows = Record<string, any>;

type tableProps = {
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
  onClickRow?: (id: string) => void;
};

const limitOptions = [10, 20, 30, 40, 50];

function Table({
  columns = [],
  rows = [],
  totalRecords = 0,
  checkboxSelection = true,
  disableSortBy = false,
  cellPadding = '',
  height,
  isLoading = false,
  clickableField = '',
  onClick,
  renderExpandedContent,
  onClickRow,
}: tableProps) {
  const dispatch = useAppDispatch();
  const { page, limit, selectedRows, sortBy } = useAppSelector(state => state.table);
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);

  const totalPages = Math.ceil(totalRecords / limit);
  const startIndex = page * limit - limit + 1;
  const endIndex = page * limit;

  useEffect(() => {
    dispatch(resetTableData());
  }, []);

  const customPadding = { paddingTop: cellPadding, paddingBottom: cellPadding };

  function THead() {
    function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
      const isChecked = e.target.checked;

      if (isChecked) {
        dispatch(updateSelectedRows(rows));
      } else {
        dispatch(updateSelectedRows([]));
      }
    }

    function handleSortBy(value: string) {
      if (!sortBy?.sortOrder || !sortBy?.sortField || sortBy?.sortField !== value) {
        dispatch(updateSortBy({ sortField: value, sortOrder: 'asc' }));
      } else if (sortBy?.sortOrder === 'asc') {
        dispatch(updateSortBy({ sortField: value, sortOrder: 'desc' }));
      } else {
        dispatch(updateSortBy({}));
      }
    }

    function RenderSortByIcon({ onClick, value }: { onClick: () => void; value: string }) {
      return sortBy?.sortOrder === 'desc' && sortBy?.sortField === value ? (
        <TiArrowSortedDown
          title="Unsort"
          className="sort-icon"
          onClick={onClick}
          style={{ marginTop: 3.5 }}
        />
      ) : sortBy?.sortOrder === null || sortBy?.sortField !== value ? (
        <TiArrowUnsorted
          title="Sort by Ascending Order"
          className="sort-icon"
          onClick={onClick}
          color="#00000040"
        />
      ) : (
        <TiArrowSortedUp
          title="Sort by Descending Order"
          className="sort-icon"
          onClick={onClick}
          style={{ marginBottom: 3.5 }}
        />
      );
    }

    return (
      <thead>
        <tr>
          {/* checkbox select all */}
          {rows.length !== 0 && checkboxSelection && (
            <th>
              <input
                className="custom-checkbox"
                type="checkbox"
                checked={rows?.length === selectedRows?.length}
                onChange={handleSelectAll}
              />
            </th>
          )}

          {/* Mapping columns  */}
          {columns?.map((column, index) => (
            <th key={index}>
              <div className="table__cell-title-container">
                {/* column title */}
                {column?.label}

                {/* sort by */}
                {rows?.length !== 0 && !disableSortBy && !column?.disableSortBy && (
                  <RenderSortByIcon
                    key={index}
                    onClick={() => handleSortBy(column?.field)}
                    value={column?.field}
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  function handleRowsSelection(value: TRows) {
    const existingItem = selectedRows?.some(item => item?.id === value?.id);

    if (existingItem) {
      const updatedRows = selectedRows?.filter(item => item?.id !== value?.id);
      dispatch(updateSelectedRows(updatedRows));
    } else {
      dispatch(updateSelectedRows([...selectedRows, value]));
    }
  }

  return (
    <div className="table-wrapper">
      <div className="table-container" style={{ height: height ?? '' }}>
        <div className="table" style={{ height: totalRecords === 0 ? '100%' : '' }}>
          <table>
            <THead />

            <tbody>
              {rows?.map((row, index) => (
                <>
                  <tr key={index}>
                    {checkboxSelection && (
                      <td style={customPadding}>
                        <input
                          className="custom-checkbox"
                          type="checkbox"
                          checked={selectedRows?.some(item => item?.id === row?.id)}
                          onChange={() => handleRowsSelection(row)}
                        />
                      </td>
                    )}

                    {columns?.map((column, columnIndex) => {
                      const isClickable = clickableField === column.field;
                      return (
                        <td
                          key={columnIndex}
                          onClick={() => {
                            if (isClickable && onClick) {
                              onClick?.(row);
                            }

                            if (renderExpandedContent) {
                              if (!expandedRow || expandedRow !== row?.id) {
                                setExpandedRow(row?.id);
                                if (onClickRow) {
                                  onClickRow(row?.id);
                                }
                              } else {
                                setExpandedRow(null);
                              }
                            }
                          }}
                          style={{
                            maxWidth: column?.maxWidth,
                            ...customPadding,
                            ...(column?.width && {
                              minWidth: column?.width,
                              maxWidth: column?.width,
                            }),
                            ...(column?.textOverflow === 'break-word' && {
                              whiteSpace: 'initial',
                              overflowWrap: 'break-word',
                            }),
                            cursor: isClickable || renderExpandedContent ? 'pointer' : 'default',
                            color: isClickable ? 'rgb(80 125 212)' : '',
                          }}
                        >
                          {typeof row?.[column?.field] !== 'object'
                            ? row?.[column?.field]
                            : column?.renderComponent && (
                              <column.renderComponent {...(row?.[column?.field] as object)} />
                            )}
                        </td>
                      );
                    })}
                  </tr>

                  <td
                    key={row?.id}
                    className="table__expandable-content-cell"
                    colSpan={columns.length + (checkboxSelection ? 1 : 0)}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: row?.id === expandedRow ? 'auto' : 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {renderExpandedContent}
                    </motion.div>
                  </td>
                </>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && <h2 className="table__no-data">No data available!</h2>}
          <PageLoader isLoading={isLoading} className="table__spinner-wrapper" />
        </div>
        {/* pagination */}
        {totalRecords !== 0 && rows.length !== 0 && (
          <div className="pagination-container">
            <Pagination
              count={totalPages}
              shape="rounded"
              size="small"
              onChange={(_, value) => dispatch(updatePage(value))}
              page={page}
            />

            <div className="right-section">
              <p>
                Results: {startIndex} - {endIndex > totalRecords ? totalRecords : endIndex} of{' '}
                {totalRecords}
              </p>

              <CustomSelect
                value={limit}
                onChange={e => {
                  dispatch(updatePage(1));
                  dispatch(updateLimit(e.target.value));
                }}
              >
                {limitOptions?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </CustomSelect>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;

const CustomSelect = styled(Select)({
  border: '2px solid #eee',
  borderRadius: 5,
  backgroundColor: '#fff',

  fieldset: {
    border: 'none',
  },

  '.MuiInputBase-input': {
    padding: '5px 8px',
  },
});
