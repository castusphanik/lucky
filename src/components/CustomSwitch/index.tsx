import React from 'react';
import { Switch, Typography, styled, Box } from '@mui/material';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 64,
    height: 30,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
        padding: 3,
        color: '#999',
        '&.Mui-checked': {
            transform: 'translateX(26px)',
            color: '#1976d2',
            '& + .MuiSwitch-track': {
                backgroundColor: '#e7f5ffff',
                border: '1px solid #1976d2',
                opacity: 1,
            },
            paddingLeft: '10px',
            paddingTop: '4px'
        },
        paddingTop: '4px'
    },
    '& .MuiSwitch-thumb': {
        width: 22,
        height: 22,
        boxShadow: 'none',
    },
    '& .MuiSwitch-track': {
        borderRadius: 32 / 2,
        backgroundColor: '#e4f0f8ff',
        border: '1px solid #999',
        opacity: 1,
        transition: theme.transitions.create(['background-color']),
    },
}));

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled }) => {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Box display="flex" alignItems="center" gap={1} position='relative'>
                {checked && (
                    <Typography variant="body2" sx={{ color: '#1976d2', position: 'absolute', top: 5, left: 5, zIndex: 100, fontWeight: 600, minWidth: 24 }}>
                        Yes
                    </Typography>
                )}
                <CustomSwitch checked={checked} onChange={onChange} disabled={disabled} />
                {!checked && (
                    <Typography variant="body2" sx={{ color: '#888', position: 'absolute', top: 4, right: 3, zIndex: 1, fontWeight: 600, minWidth: 24 }}>
                        No
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ToggleSwitch;
