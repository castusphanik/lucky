import Button from "@/components/Button";
import { EquipmentListingColumns, EquipmentListingSelectorColumns } from "@/helpers/columns";
import Table from "@/components/Table";
import { useEffect, useState } from "react";
import { setTopBarConfig } from "@/features/layout/layoutSlice";
import { useDispatch } from "react-redux";
import EquipmentDetails from "@/components/EquipmentDetails";
import FilterIcon from '@/assets/filterIcon.svg';
import { LuDownload } from "react-icons/lu";
import './styles.scss';
import ManageColumns from "@/components/ManageColumns";

const rows = [
    { id: 1, customer_ref: '#SYN-62400093', trailer_model: '(5468) Drive Van', vin: '#TCN04868400', location: 'Gorgios USA', year: 'May 15, 2025', status: 'Approved', asset_type: 'Drive Van' },
    { id: 2, customer_ref: '#SYN-62400093', trailer_model: '(5468) Drive Van', vin: '#TCN04868400', location: 'Gorgios USA', year: 'May 15, 2025', status: 'Approved', asset_type: 'Drive Van' },
    { id: 3, customer_ref: '#SYN-62400093', trailer_model: '(5468) Drive Van', vin: '#TCN04868400', location: 'Gorgios USA', year: 'May 15, 2025', status: 'Approved', asset_type: 'Drive Van' },
    { id: 4, customer_ref: '#SYN-62400093', trailer_model: '(5468) Drive Van', vin: '#TCN04868400', location: 'Gorgios USA', year: 'May 15, 2025', status: 'Approved', asset_type: 'Drive Van' },
    { id: 5, customer_ref: '#SYN-62400093', trailer_model: '(5468) Drive Van', vin: '#TCN04868400', location: 'Gorgios USA', year: 'May 15, 2025', status: 'Approved', asset_type: 'Drive Van' },
]

const EquipmentListing = () => {
    const [rowSelected, setRowSelected] = useState(null)

    const dispatch = useDispatch()

    const handleClick = (row: any) => {
        setRowSelected(row)
    }

    useEffect(() => {
        dispatch(setTopBarConfig({
            showBackButton: !!rowSelected,
            title: rowSelected ? 'My Equipment-' : 'Equipment Listing',
            extraContent: rowSelected ? <div>#5235982</div> : null,
            onBack: () => setRowSelected(null),
            isSideBarOpen: true
        }));
    }, [rowSelected]);

    return (
        <>
            {rowSelected ? <EquipmentDetails /> : (
                <div className="equipment-listing">
                    <div className="equipment-listing__header">
                        <div><Button color='light' variant='outline' icon={<img src={FilterIcon} />}>Filter</Button></div>
                        <div>
                            <Button icon={<LuDownload size={16} />} iconPosition="right">Download to CSV</Button>
                        </div>
                        <ManageColumns
                            columns={EquipmentListingSelectorColumns}
                        />
                    </div>
                    <Table
                        isLoading={false}
                        columns={EquipmentListingColumns}
                        rows={rows}
                        clickableField={'customer_ref'}
                        onClick={handleClick}
                    />
                </div>
            )}
        </>
    )
}

export default EquipmentListing;