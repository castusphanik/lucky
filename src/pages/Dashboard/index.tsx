import { useState } from 'react';
// import classes from './style.module.css';
import './styles.scss'
// import { vmrsOptions, dateOptions } from '../../data/selectOptions';
import DashboardCards from '@/components/DashboardCards';
import BarChart from '@/components/BarChart';
import DoughnutChart from '@/components/DoughnutChart';
import HorizontalBarChart from '@/components/HorizontalBarChart';
import Linechart from '@/components/LineChart';
import BarChartWithHorizontalGrid from '@/components/BarChartWithHorizontalGrid';
import CustomDropdown from '@/components/Form/Dropdown';
import HighestMRSpendByUnit from "../../data/HighestMRSpendByUnit.json";
import TotalMaintanceCosts from "@/data/TotalMaintanceCosts.json"
import TotalSpendVMRS from "@/data/TotalSpendVMRS.json";
import TrailerPmCompliance from "@/components/TrailerPmCompliance";
import TrailerPmComplianceData from "@/data/TrailerPmComplianceData.json";

import Button from '@/components/Button';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
export default function DashboardPage() {
  const [vmrs, setVmrs] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    console.log('Search clicked', { vmrs, date });
  };

  const handleClear = () => {
    setVmrs('');
    setDate('');
  };
  const rangeOptions = ["Today","Yesterday","Last 7 days","Last 30 days","This Week","Last Week","This Month","Last Month","This Quarter","Last Quarter","This Year","Custom Range"];
  const vmrsOptions =["Select All","Brakes","Doors","LiftGate","Lights","PM","Refrigeration","Sub Frame","Tires"]

  return (
    <div>
      <div className="selectTextfieldAndButton">
        <div className="theSelectTextFields">
          {/* <CustomSelectTextField
            options={dateOptions}
            placeholder="Filter by Date"
            value={date}
            onChange={setDate}
            borderRadius="8px"
            height="45px"
            width="290px"
            // disabled={true}
          />
          <CustomSelectTextField
            options={vmrsOptions}
            placeholder="Filter by VMRS"
            value={vmrs}
            onChange={setVmrs}
            borderRadius="8px"
            height="45px"
            width="290px"
          /> */}
        </div>
        {/* <div className={classes.theButtons}>
          <div className={classes.searchBtn}>
            <Button size="fit">Search</Button>
          </div>
          <div className={classes.clearFilterBtn}>
            <Button size="fit" variant='outline' onClick={handleClear}>
              Clear Filters
            </Button>
          </div>
        </div> */}
      </div>

      {/* Dashboard cards */}
      <div className="dashboardCardsMain">
        <DashboardCards />
      </div>
         <div className="theButtons">
          <div className="rangeBtn">
           <CustomDropdown options={rangeOptions} label="" onChange={()=>{}} value=""/>
          </div>
          <div className="vmrsBtn">
            <CustomDropdown  options={vmrsOptions} label="" onChange={()=>{}} value="" multiSelect/>
          </div>
          <div className="searchBtn">
            <Button size="fit">Search</Button>
          </div>

          <div className="clearFilterBtn">
            <Button size="fit" variant='outline' onClick={handleClear}>
              Clear Filters
            </Button>
          </div>
        </div>

      <div className="firstCharts">

         <div className="horizontalBarChart">
          <Typography variant="h6" margin={1}>
            Trailer PM Compialance
          </Typography>
          {/* <p className={classes.barChartHeading}>Avg. Repair Cost By VMRS</p> */}
          <TrailerPmCompliance  data={TrailerPmComplianceData} />
        </div>

        <div className="horizontalBarChart">
          <Typography variant="h6" margin={1}>
            Repair Count By VMRS
          </Typography>
          {/* <p className={classes.horizontalBarChartHeading}>Repair Count By VMRS</p> */}
          <HorizontalBarChart />
        </div>

        <div className="horizontalBarChart">
          <Typography variant="h6" margin={1}>
            Avg. Repair Cost By VMRS
          </Typography>
          {/* <p className={classes.barChartHeading}>Avg. Repair Cost By VMRS</p> */}
          <BarChart />
        </div>
      </div>

      <div className="secondCharts">
        <div className="totalMaintenanceNRepairCost">
          <Typography variant="h6" margin={1}>
            Total Maintenance & Repair Costs
          </Typography>

          <Linechart />
        </div>
        <div className="barChartWithHorizontalGrid">
          <Typography variant="h6" margin={1}>
            Highest M&R Spend By Unit
          </Typography>
          {/* <p className={classes.barChartWithHorizontalGridHeading}>Highest M&R Spend by Unit</p> */}
          <BarChartWithHorizontalGrid data={HighestMRSpendByUnit} labelKey="unit"
  valueKey="spend" />
        </div>
      </div>
        <div className="secondCharts">
        <div className="totalMaintenanceNRepairCost">
          <Typography variant="h6" margin={1}>
            Total Spend by VMRS
          </Typography>

          <BarChartWithHorizontalGrid data={TotalSpendVMRS} labelKey="label"
        valueKey="value"/>
        </div>
        <div className="barChartWithHorizontalGrid">
          <Typography variant="h6" margin={1}>
            Total Maintance Costs
          </Typography>
          {/* <p className={classes.barChartWithHorizontalGridHeading}>Highest M&R Spend by Unit</p> */}
          <BarChartWithHorizontalGrid  data={TotalMaintanceCosts} labelKey="month"
        valueKey="cost" />
        </div>
      </div>
      <div className="fifthCharts">
        <div className="doughnutChart">
          {/* <p className={classes.doughnutChartHeading}>Spend Range by VMRS Category</p> */}
          <Typography variant="h6" margin={1}>
            Quick Links
          </Typography>
          {/* <DoughnutChart /> */}
          <div className="link"><Link to="/website">TEN Website</Link></div>
          <div className="link"><Link to="/ten-facility-listing">TEN Facility Listing</Link></div>
          <div className="link"><Link to="/ten-mobile-app">TEN Mobile App</Link></div>
          <div className="link"><Link to="/outstanding-invoices">Pay Outstanding Invoices</Link></div>
          <div className="link" ><Link to="/contact-account-manager">Contact My Account Manager</Link></div>
        </div>
          <div className="doughnutChart">
          {/* <p className={classes.doughnutChartHeading}>Spend Range by VMRS Category</p> */}
          <Typography variant="h6" margin={1}>
            Spend Range by VMRS Category
          </Typography>
          <DoughnutChart />
        </div>
      </div>
    </div>
  );
}
