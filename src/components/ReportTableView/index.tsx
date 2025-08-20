
import './styles.scss';
import type { TColumns } from '@/components/Table';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';


function ReportsTableView() {
 

  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    col1: '------',
    col2: '------',
    col3: '------',
    col4: '------',
    col5: '------',
  }));


 

  const initialColumns: TColumns = [
    { label: 'Column 1', field: 'col1'  },
    { label: 'Column 2', field: 'col2' },
    { label: 'Column 3', field: 'col3' },
    { label: 'Column 4', field: 'col4' },
    { label: 'Column 5', field: 'col5' },
  ];

  return (
    <div className="report-table-view">
          <div className="report-table-view__actions-container">
            <div className="flex-align-center right-section">         
              <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
                Download as CSV
              </Button>
            </div>
          </div>

          <Table
            columns={initialColumns.filter((item) => !item?.hide)}
            rows={rows}
            cellPadding={'0.5em'}
          />
    </div>
  );
}

export default ReportsTableView;