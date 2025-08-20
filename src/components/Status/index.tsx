import { STATUS_TYPES } from "@/helpers/constants";
import { Circle } from "lucide-react";
import './styles.scss';

const { SCHEDULED, COMPLETED } = STATUS_TYPES;

const Status = ({ value }: { value: string }) => {
    const isCompleted = value == COMPLETED
    const isScheduled = value == SCHEDULED
    const activeColor = isCompleted ? "#3DB00D" : isScheduled ? "#E28221" : '#820909'
    const activeBgColor = isCompleted ? "#D9F2CE" : isScheduled ? "#F2E3D4" : '#f9bebe'

    return (
        <div
            className="dot-pm-status-container"
            style={{ backgroundColor: activeBgColor }}
        >
            <Circle size={10} style={{ fill: activeColor, color: activeColor }} />
            <p style={{ color: activeColor }}>
                {isCompleted ? "Completed" : isScheduled ? "Scheduled" : "Overdue"}
            </p>
        </div>
    );
}

export default Status;