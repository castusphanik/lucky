import type { IconType } from 'react-icons';
import './styles.scss';
import { Stack, Typography } from '@mui/material';

type TOptionPrimary = {
  label: string;
  value: string;
  count?: string | number;
};

type TOptionSecondary = {
  label: string;
  value: string;
  icon: IconType;
};

type TVariant =
  | { variant?: 'primary'; options: TOptionPrimary[] }
  | { variant?: 'secondary'; options: TOptionSecondary[] };

type TProps = TVariant & {
  activeTab: string;
  className?: string;
  onChange?: (value: string) => void;
};

function Tabs({ options = [], activeTab, onChange, className = '', variant = 'primary' }: TProps) {
  const variants = {
    primary: 'tab-primary',
    secondary: 'tab-secondary',
  };

  return (
    <div className={`tabs ${className} ${variants[variant]}`}>
      {options.map((item, index) => (
        <div
          key={index}
          className={`tab-option ${activeTab === item.value ? 'active' : ''}`}
          onClick={() => onChange && onChange(item.value)}
        >
          {variant === 'secondary' && 'icon' in item && (
            <item.icon color={activeTab === item.value ? '#fff' : '#9D9D9D'} size={20} />
          )}

          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="body2">{item.label}</Typography>

            {variant === 'primary' && 'count' in item && (
              <Typography variant="caption" lineHeight={1.43}>
                {item.count}
              </Typography>
            )}
          </Stack>
        </div>
      ))}
    </div>
  );
}

export default Tabs;
