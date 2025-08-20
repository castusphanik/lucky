import logo from "../../assets/logo/Ten(white-bg).png";
import { invoiceData } from "../../data/invoiceBillingData";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import classes from "./style.module.css";
import CustomButton from "../CustomButton";

export default function InvoiceBilling() {
  return (
    <div>
       <div className={classes.logoHeading}>
          <div className={classes.logo}>
            <img src={logo} alt="Ten logo" />
          </div>
          <div className={classes.invoiceInfo}>
            <div className={classes.invoiceLabel}>Invoice Number</div>
            <div className={classes.invoiceNumber}>
              {invoiceData.invoiceNumber}
              {/* TENX25433536 */}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className={classes.mainContent}>
          {/* Left Column - Invoice Details */}
          <div className={classes.leftColumn}>
            <div className={classes.sectionTitle}>Invoice Billing</div>

            <div className={classes.detailRow}>
              <span className={classes.label}>Date</span>
              <span className={classes.value}>{invoiceData.date}</span>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.label}>Due Date</span>
              <span className={classes.value}>{invoiceData.dueDate}</span>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.label}>Billing Period</span>
              <span className={classes.value}>{invoiceData.billingPeriod}</span>
            </div>
          </div>

          {/* Right Column - Customer Details */}
          <div className={classes.rightColumn}>
            <div className={classes.sectionTitle}>Customer & Billing Info</div>

            <div className={classes.detailRow}>
              <span className={classes.label}>Billing Address</span>
              <span className={classes.value}>
                {invoiceData.customer.billingAddress}
              </span>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.label}>Contact Info</span>
              <span className={classes.value}>{invoiceData.customer.contactInfo}</span>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.label}>Tax ID</span>
              <span className={classes.value}>{invoiceData.customer.taxId}</span>
            </div>
          </div>
        </div>

        <div>
          <div className={classes.sectionTitleEqp}>Equipment Covered</div>

          <div className={classes.detailRow}>
            <span className={classes.label}>List of Unit build</span>
            <span className={classes.value}>
              {invoiceData.equipment.listOfUnitBuild}
            </span>
          </div>

          <div className={classes.detailRow}>
            <span className={classes.label}>Aliasas</span>
            <span className={classes.value}>{invoiceData.equipment.aliasas}</span>
          </div>

          <div className={classes.detailRow}>
            <span className={classes.label}>Locations</span>
            <span className={classes.value}>{invoiceData.equipment.locations}</span>
          </div>
        </div>

        <div className={classes.tableContainer}>
          <div className={classes.tableHeader}>
            <div className={classes.tableHeaderCell}>Description</div>
            <div className={classes.tableHeaderCell}>QTY</div>
            <div className={classes.tableHeaderCellr}>Rate</div>
          </div>

          {invoiceData.lineItems.map((item, index) => (
            <div key={index} className={classes.tableRow}>
              <div className={classes.tableCell}>{item.description}</div>
              <div className={classes.tableCell}>{item.quantity}</div>
              <div className={classes.tableCellr}>${item.rate.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className={classes.totalsSection}>
          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Sub total</span>
            <span className={classes.totalValue}>
              ${invoiceData.subtotal.toFixed(2)}
            </span>
          </div>

          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Taxes</span>
            <span className={classes.totalValue}>${invoiceData.taxes.toFixed(2)}</span>
          </div>

          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Discounts</span>
            <span className={classes.totalValue}>
              ${invoiceData.discounts.toFixed(2)}
            </span>
          </div>

          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Credits</span>
            <span className={classes.totalalue}>
              ${invoiceData.credits.toFixed(2)}
            </span>
          </div>

          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Total Amount Paid</span>
            <span className={classes.totalalue}>
              ${invoiceData.totalAmountPaid.toFixed(2)}
            </span>
          </div>

          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Amount Paid</span>
            <span className={classes.totalalue}>
              ${invoiceData.amountPaid.toFixed(2)}
            </span>
          </div>

          <div className={classes.totalRow}>
            <span className={classes.totalLabel}>Balance Due</span>
            <span className={classes.totalalue}>
              ${invoiceData.balanceDue.toFixed(2)}
            </span>
          </div>
        </div>

        <div className={classes.actionButtons}>
          <CustomButton endIcon={<FileDownloadOutlinedIcon/>}>Download Official Invoice</CustomButton>
          <CustomButton>Pay Now</CustomButton>

          {/* <Button
            // component="label"
            variant="contained"
            endIcon={<FileDownloadOutlinedIcon />}
          >
            Download Official Invoice
          </Button>
          <Button component="label" variant="contained">
            Pay Now
          </Button> */}
        </div>
    </div>
  );
}
