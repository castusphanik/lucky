import React, { useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import ToggleSwitch from '../CustomSwitch';
import { CustomTooltip } from '../StatusCard';
import './styles.scss';

const DetailedOverview = ({ data, className = '' }) => {
  return (
    <div className={`detailed-overview ${className}`}>
      <div className="detailed-overview__overview-card">
        <div className="detailed-overview__card-details">
          {data?.map((group: any, groupIdx: any) => (
            <Box className="data-section-column" key={groupIdx}>
              {group.items.map((item: any, idx: number) => (
                <Box className="data-section-row" key={idx}>
                  <Typography variant="body2" className="label" sx={{ fontWeight: 500 }}>
                    {item.label}:
                  </Typography>

                  {item.type === 'switch' ? (
                    <ToggleSwitch
                      checked={item.value}
                      onChange={item.onChange}
                      disabled={item.disabled}
                    />
                  ) :
                    item.isLink && item.href ? (
                      <Link href={item.href} underline="hover" className="value-link">
                        {item.value}
                      </Link>
                    ) : (
                      item.label === 'Description' ?
                        <CustomTooltip title={item.value}>
                          <Typography variant="body2" className="detailed-overview__value" sx={{ fontWeight: 500 }}>
                            {item.value}
                          </Typography>
                        </CustomTooltip> :
                        <Typography variant="body2" className="detailed-overview__value" sx={{ fontWeight: 500 }}>
                          {item.value}
                        </Typography>
                    )
                  }
                </Box>
              ))}
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedOverview;

type Account = {
  account_id: number;
  account_name: string;
  account_number: string;
  [key: string]: any;
};

export const renderAccounts = (accountsObj: Record<string, Account> | null | undefined): React.ReactElement => {
  if (!accountsObj || Object.keys(accountsObj).length === 0) {
    return <span>-</span>;
  }

  const accounts = Object.values(accountsObj);
  const accountNumbers = accounts.map(acc => acc.account_number);

  if (accountNumbers.length === 1) {
    return <span>{accountNumbers[0]}</span>;
  }

  const firstAccount = accountNumbers[0];
  const hiddenCount = accountNumbers.length - 1;
  const hiddenAccounts = accountNumbers.slice(1);
  const tooltipContent = hiddenAccounts.join('\n');

  return (
    <CustomTooltip title={<pre style={{ whiteSpace: 'pre-line', margin: 0 }}>{tooltipContent}</pre>}>
      <span>
        {firstAccount}, +{hiddenCount} more
      </span>
    </CustomTooltip>
  );
};

