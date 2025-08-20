import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import './styles.scss'
import { styled, Tooltip, tooltipClasses, type TooltipProps } from '@mui/material';

const StatusCard = ({ item, isPMTab }: { item: any, isPMTab: boolean }) => {
    return (
        <div className='status-card'>
            <div className='status-card__head'>
                <CustomTooltip title={item.title}>
                    <p style={{ width: isPMTab ? '90%' : '60%' }}>{item.title}</p>
                </CustomTooltip>
                <div className='status-card__chat-icon' style={{ background: item.color }}>
                    <ChatBubbleOutlineIcon style={{ color: '#fff' }} />
                </div>
            </div>
            <h3>{item.value}</h3>
        </div>
    )
}

export default StatusCard;

interface CustomTooltipProps extends TooltipProps {
    fontColor?: string;
    bgColor?: string;
}

export const CustomTooltip = styled(({ className, ...props }: CustomTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} placement="top" />
))<CustomTooltipProps>(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: '#07124d',
        boxShadow: theme.shadows[1],
        fontSize: 13,
        padding: '6px 12px',
    },
}));