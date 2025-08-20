import { colors, Stack, styled, Switch, Typography } from "@mui/material";
import CustomDropdown from "../Form/Dropdown";
import './styles.scss';
import Input from "../Form/Input";

const paymentTypes = [
    {
        id: 1,
        name: 'Credit Card',
        color: '#fcf2eb'
    },
    {
        id: 2,
        name: 'Net Banking',
        color: '#f9f3ff'
    },
    {
        id: 3,
        name: 'PayPal',
        color: '#e5f2fc'
    }]

const currencyData = [{ id: 1, name: 'Current Country Currency' }, { id: 2, name: 'PO Required' }]
const invoiceData = [{ id: 1, label: 'Email' }, { id: 2, label: 'PDF Download' }, { id: 3, label: 'Mail' }, { id: 4, label: 'Contact Email' }]
const settingsData = [{ id: 1, name: 'PO Required for Maintenance' }, { id: 2, name: 'Estimate Approval Required' }, { id: 3, name: 'Authorized Approvers' }]

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 28,
    padding: 0,
    display: 'flex',

    '& .MuiSwitch-switchBase': {
        padding: 2,
        top: '50%',
        transform: 'translateY(-50%)',
        '&.Mui-checked': {
            transform: 'translate(32px, -50%)',
            color: '#1890ff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#fff',
                border: '1.5px solid #2791f4ff',
                '&::before': {
                    color: '#1890ff',
                },
            },
            '& .MuiSwitch-thumb': {
                backgroundColor: '#1890ff',
            },
        },
    },

    '& .MuiSwitch-thumb': {
        width: 20,
        height: 20,
        borderRadius: '50%',
        boxShadow: 'none',
        backgroundColor: '#999', // Default thumb color
    },

    '& .MuiSwitch-track': {
        backgroundColor: '#fff',
        borderRadius: 28 / 2,
        border: '2px solid #999',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        boxSizing: 'border-box',

        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 14,
        },

        '&::before': {
            content: '"Yes"',
            left: 8,
            color: '#999',
        },

        '&::after': {
            content: '"No"',
            right: 8,
            color: '#999',
        },
    },

    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        '&::before': {
            color: '#1890ff',
        },
        '&::after': {
            color: '#999',
        },
    },

    '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
        '&::before': {
            color: '#999',
        },
        '&::after': {
            color: '#999',
        },
    },
}));

const AccountPreferences = () => {
    return (
        <div className="account-preferences">
            <CustomDropdown label="Choose Account Number" value="Select Account Number" />
            <div className="account-preferences__section">
                <h3>Billing Preference</h3>
                <div className="account-preferences__payment">
                    {renderHeading('Payment')}
                    <div className="account-preferences__types">
                        {paymentTypes.map(item => (
                            <div key={item.id} className="account-preferences__payment-item" style={{ background: `${item.color}` }}>{item.name}</div>
                        ))}
                    </div>
                    {renderHeading('Currency & PO Info')}
                    <div className="account-preferences__types">
                        {currencyData.map(item => (
                            <div key={item.id} className="account-preferences__currency-item">
                                {item.name}
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                    <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                                </Stack>
                            </div>
                        ))}
                    </div>
                    {renderHeading('Invoice')}
                    <div className="account-preferences__types">
                        {invoiceData.map(item => (
                            <div key={item.id} className="account-preferences__payment-item">
                                {item.label}
                            </div>
                        ))}
                    </div>
                    {renderHeading('Invoice Email')}
                    <Input placeholder="jhondoe@gmail.com" />
                </div>
            </div>
            <div className="account-preferences__section">
                <h3>Maintenance Preference</h3>
                {renderHeading('Settings')}
                <div className="account-preferences__types">
                    {settingsData.map(item => (
                        <div key={item.id} className="account-preferences__payment-item account-preferences__settings">
                            {item.name}
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                            </Stack>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default AccountPreferences;

const renderHeading = (name) => {
    return <Typography fontWeight={600} color="#54585d">{name}</Typography>
}