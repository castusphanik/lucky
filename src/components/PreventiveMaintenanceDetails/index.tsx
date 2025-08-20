import { PMDetailsColumns } from "@/helpers/columns";
import Table from "../Table";
import HorizontalStepper from "../HorizontalStepper";
import './styles.scss'

const pmDetailsRows = [
    { id: 1, date_of_service: 'June 25, 2025', work_performed: 'Brake Inspection', location: 'In-shop', vendor_technician: 'Jhon Doe', time_taken: '1 hr', parts_replaced: 'Brakes Worn' },
    { id: 2, date_of_service: 'June 25, 2025', work_performed: 'Brake Inspection', location: 'In-shop', vendor_technician: 'Jhon Doe', time_taken: '1 hr', parts_replaced: 'Brakes Worn' },
    { id: 3, date_of_service: 'June 25, 2025', work_performed: 'Brake Inspection', location: 'In-shop', vendor_technician: 'Jhon Doe', time_taken: '1 hr', parts_replaced: 'Brakes Worn' },
    { id: 4, date_of_service: 'June 25, 2025', work_performed: 'Brake Inspection', location: 'In-shop', vendor_technician: 'Jhon Doe', time_taken: '1 hr', parts_replaced: 'Brakes Worn' },
    { id: 5, date_of_service: 'June 25, 2025', work_performed: 'Brake Inspection', location: 'In-shop', vendor_technician: 'Jhon Doe', time_taken: '1 hr', parts_replaced: 'Brakes Worn' },
]

const steps = [
    { lable: 'Last PM', date: 'Apr 05, 2024', status: 'completed' },
    { lable: 'Next PM', date: 'May 05, 2024', status: 'upcoming' },
    { lable: 'Next PM', date: 'Jun 05, 2024', status: 'upcoming' },
    { lable: 'Next PM', date: 'July 05, 2024', status: 'upcoming' }
]

const PreventiveMaintenanceDetails = () => {
    return (
        <div className="pm-details">
            <div className="pm-details__left-pane">
                <h1>Map</h1>
                <p>#SYN-62400093</p>
                <p>Minnesota</p>
            </div>
            <div className="pm-details__vertical-line"></div>
            <div className="pm-details__right-pane">
                <p>PM Schedule</p>
                <HorizontalStepper steps={steps} />
                <p>Service History</p>
                <Table
                    isLoading={false}
                    columns={PMDetailsColumns}
                    rows={pmDetailsRows}
                    checkboxSelection={false}
                />
            </div>
        </div>
    )
}

export default PreventiveMaintenanceDetails;