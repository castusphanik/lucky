import './styles.scss';
import { Button, Typography } from '@mui/material';
import { BsLayoutThreeColumns } from 'react-icons/bs';
import type { TColumns } from '../Table';
import { useEffect, useState } from 'react';
import { GrMenu } from 'react-icons/gr';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { LuColumns3, LuSearch } from 'react-icons/lu';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { AnimatePresence, motion, Reorder } from 'framer-motion';

type TProps = {
  columns: TColumns;
  onApply: (columns: TColumns) => void;
};

function ManageColumns({ columns = [], onApply }: TProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(columns);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const ref = useOnClickOutside<HTMLDivElement>(() => {
    setOpen(false);
    setData(columns);
    setSearch('');
  });

  useEffect(() => {
    setData(columns);
  }, [JSON.stringify(columns)]);

  useEffect(() => {
    if (search) {
      setIsSearching(true);
    } else {
      setTimeout(() => setIsSearching(false), 100);
    }
  }, [search]);

  function handleDragStart(field: string) {
    setDraggedItem(field);
    setSearch('');
  }

  function handleHideColumns(field: string, value: boolean) {
    const updatedColumns = data.map(item => {
      if (field === item.field) {
        return {
          ...item,
          hide: value,
        };
      }

      return item;
    });

    setData(updatedColumns);
  }

  const filteredColumns = search
    ? data.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <div className="manage-columns">
      <div className="manage-columns__select-container" onClick={() => setOpen(true)}>
        <LuColumns3 />
        <Typography variant="body2">Column Selector /12</Typography>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            className="manage-columns__dropdown"
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1, transformOrigin: 'top center' }}
            exit={{ scale: 0.9, opacity: 0.5, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15 }}
          >
            <div className="manage-columns__search-bar">
              <input
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <LuSearch />
            </div>

            <div className="manage-columns__all-columns-checkbox">
              <Typography variant="body2" color="textSecondary">
                All Columns
              </Typography>
              <input type="checkbox" />
            </div>

            <Reorder.Group onReorder={setData} values={data}>
              {filteredColumns.map(item => (
                <Reorder.Item
                  key={item.field}
                  value={item}
                  onDragStart={() => handleDragStart(item.field)}
                  onDragEnd={() => setDraggedItem(null)}
                  style={{
                    position: draggedItem === item.field ? 'relative' : 'static',
                    zIndex: draggedItem === item.field ? 999 : 'auto',
                  }}
                  transition={{ duration: search || isSearching ? 0 : 0.15 }}
                >
                  <div
                    className={`manage-columns__menu-item ${draggedItem === item.field ? 'dragging' : ''
                      }`}
                  >
                    <div className="left-section">
                      <GrMenu size={18} className="menu-icon" />
                      <Typography variant="body2">{item.label}</Typography>
                    </div>

                    {item?.hide ? (
                      <HiOutlineEyeSlash
                        size={22}
                        className="eye-icon"
                        onClick={() => handleHideColumns(item.field, false)}
                        title="View"
                      />
                    ) : (
                      <HiOutlineEye
                        size={22}
                        className="eye-icon"
                        onClick={() => handleHideColumns(item.field, true)}
                        title="Hide"
                      />
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {filteredColumns.length === 0 && (
              <Typography variant="body2" color="textSecondary" className="manage-columns__no-data">
                No Options!
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                onApply(data);
                setOpen(false);
                setSearch('');
              }}
              sx={{ marginTop: 1 }}
            >
              Apply
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageColumns;
