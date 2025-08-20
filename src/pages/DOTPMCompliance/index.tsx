
import Table from '@/components/Table';;
import { DOTColumns, DOTPMColumnSelector, PMColumns } from '@/helpers/columns';
import Tabs from '@/components/Tabs';
import { useEffect, useState } from 'react';
import StatusCard from '@/components/StatusCard';
import { useNavigate } from 'react-router-dom';
import PreventiveMaintenanceDetails from '@/components/PreventiveMaintenanceDetails';
import { useDispatch, useSelector } from 'react-redux';
import { setTopBarConfig } from '@/features/layout/layoutSlice';
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import { LuDownload } from 'react-icons/lu';
import FilterIcon from '@/assets/filterIcon.svg';
import './styles.scss';
import ManageColumns from '@/components/ManageColumns';
import type { RootState } from '@/redux/store';

const pmData = [
    { id: 1, title: 'Number of Units Coming Due for PM', value: 548, color: '#e7840f' },
    { id: 2, title: 'Units with Overdue Maintenance', value: 548, color: '#f34141' },
    { id: 3, title: 'Current PM (Recently Completed)', value: 548, color: '#27e427' }
]

const dotData = [
    { id: 1, title: 'Units Due for DOT Inspection', value: 548, color: '#e7840f' },
    { id: 2, title: 'Failed DOT Inspections', value: 548, color: '#f34141' },
    { id: 3, title: 'Units with Expired Permits', value: 548, color: '#27e427' },
    { id: 4, title: 'Next Scheduled Campaign/Recall', value: 548, color: '#387bfe' }
]

const pmRows = [
    { id: 1, unit_alias: '#TR-62400093', equipment_type: '(5468) Trailer', pm_type: 'PM 180', location_parking_facility: 'Chicago / SCH-1234', last_pm_date: '25 June 2025', next_pm_due_date: '30 June 2025', status: { value: 'scheduled' } },
    { id: 2, unit_alias: '#TR-62400094', equipment_type: '(5468) Refer', pm_type: 'PM-Refer', location_parking_facility: 'Chicago / SCH-1234', last_pm_date: '25 June 2025', next_pm_due_date: '30 June 2025', status: { value: 'completed' } },
    { id: 3, unit_alias: '#TR-62400095', equipment_type: '(5468) Lift Gate', pm_type: 'PM-LG', location_parking_facility: 'Chicago / SCH-1234', last_pm_date: '25 June 2025', next_pm_due_date: '30 June 2025', status: { value: 'overdue' } },
    { id: 4, unit_alias: '#TR-62400096', equipment_type: '(5468) Trailer', pm_type: 'PM-FHWA', location_parking_facility: 'Chicago / SCH-1234', last_pm_date: '25 June 2025', next_pm_due_date: '30 June 2025', status: { value: 'scheduled' } },
    { id: 5, unit_alias: '#TR-62400097', equipment_type: '(5468) Trailer', pm_type: 'PM-CVI', location_parking_facility: 'Chicago / SCH-1234', last_pm_date: '25 June 2025', next_pm_due_date: '30 June 2025', status: { value: 'scheduled' } },
]

const dotRows = [
    { id: 1, unit_alias: '#TR-62400093', equipment_type: '(5468) Trailer', last_dot_inspection_date: '25 June 2025', next_due_date: '25 June 2025', valid_through: '25 June 2025', permits_status: 'Active', compliance: '60% (1547)' },
    { id: 2, unit_alias: '#TR-62400094', equipment_type: '(5468) Refer', last_dot_inspection_date: '25 June 2025', next_due_date: '25 June 2025', valid_through: '25 June 2025', permits_status: 'Active', compliance: '60% (1547)' },
    { id: 3, unit_alias: '#TR-62400095', equipment_type: '(5468) Lift Gate', last_dot_inspection_date: '25 June 2025', next_due_date: '25 June 2025', valid_through: '25 June 2025', permits_status: 'Active', compliance: '60% (1547)' },
    { id: 4, unit_alias: '#TR-62400096', equipment_type: '(5468) Trailer', last_dot_inspection_date: '25 June 2025', next_due_date: '25 June 2025', valid_through: '25 June 2025', permits_status: 'Active', compliance: '60% (1547)' },
    { id: 5, unit_alias: '#TR-62400097', equipment_type: '(5468) Trailer', last_dot_inspection_date: '25 June 2025', next_due_date: '25 June 2025', valid_through: '25 June 2025', permits_status: 'Active', compliance: '60% (1547)' },
]

const tabs = [{ label: 'Preventive Maintenance', value: 'pm' }, { label: 'DOT Inspections', value: 'dot' }]

const DOTPMCompliance = () => {
    const [activeTab, setActiveTab] = useState('pm')
    const [rowSelected, setRowSelected] = useState(null)
    const isBackClicked = useSelector((state: RootState) => state.layout.isBackClicked);

    const isPMTab = activeTab === 'pm'
    const data = isPMTab ? pmData : dotData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleTabChange = (value: string) => {
        setActiveTab(value)
    }

    const handleUnitAliasClick = (row: any) => {
        setRowSelected(row)
    }

    useEffect(() => {
        if (rowSelected && isBackClicked) {
            setRowSelected(null)
            dispatch(setTopBarConfig({
                showBackButton: false,
                title: 'DOT PM Compliance',
                extraContent: null,
                isSideBarOpen: true,
                isBackClicked: false,
                showSearch: true
            }));
        }
    }, [isBackClicked])

    useEffect(() => {
        if (rowSelected) {
            dispatch(setTopBarConfig({
                showBackButton: true,
                title: 'Preventive Maintenance Details',
                extraContent: <div>#SYN-62400093</div>,
                isSideBarOpen: false,
                showSearch: false
            }));
        }
    }, [rowSelected]);

    return (
        <>
            {rowSelected ? <PreventiveMaintenanceDetails /> :
                <div className="dot-pm">
                    <div className="dot-pm__header">
                        <div className="dot-pm__header-left">
                            <Input label='' placeholder='Search' />
                            <Tabs
                                options={tabs}
                                activeTab={activeTab}
                                onChange={handleTabChange}
                            />
                        </div>
                        <div className="dot-pm__header-right">
                            <div><Button color='light' variant='outline' icon={<img src={FilterIcon} />}>Filter</Button></div>
                            <div>
                                <Button icon={<LuDownload size={16} />} iconPosition="right">Download</Button>
                            </div>
                            <ManageColumns
                                columns={DOTPMColumnSelector}
                            />
                        </div>
                    </div>
                    <div className="dot-pm__maintenance">
                        {data?.map(item => <StatusCard item={item} isPMTab={isPMTab} />)}
                    </div>
                    <Table
                        isLoading={false}
                        columns={isPMTab ? PMColumns : DOTColumns}
                        rows={isPMTab ? pmRows : dotRows}
                        clickableField={isPMTab ? 'unit_alias' : ''}
                        onClick={handleUnitAliasClick}
                    />
                </div>
            }
        </>
    )
}

export default DOTPMCompliance;
