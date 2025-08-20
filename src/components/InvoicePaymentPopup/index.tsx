import React from "react";
import Popup from "@/components/Popup";
import { Typography } from "@mui/material";
import Button from "@/components/Button";
import "./styles.scss";

const invoices = [
  {
    number: "211349586",
    account: "HERITAGE-CRYSTAL CLEAN, LLC (001-10024255-224)",
    payment: "$432.05",
  },

];

const InvoicePaymentPopup = ({ onClose }) => {
  return (
    <Popup title="Invoice Payments"  onClose={onClose}>
      <div className="invoice-section">
        <div className="section-header">Invoice Payments</div>
        <div className="invoice-table">
          <div className="invoice-table__header">
            <Typography>Invoice #</Typography>
            <Typography>Account</Typography>
            <Typography>Payment</Typography>
          </div>
          {invoices.map((inv, idx) => (
            <div key={idx} className="invoice-table__row">
              <Typography>{inv.number}</Typography>
              <Typography>{inv.account}</Typography>
              <Typography>{inv.payment}</Typography>
            </div>
          ))}
        </div>

        <div className="section-header">Payment Summary</div>
        <div className="payment-summary">
          <div className="summary-row">
            <Typography></Typography>
            <Typography>Invoice Payments (3)</Typography>
            <Typography>$948.18</Typography>
          </div>
          <div className="summary-row">
            <Typography></Typography>
            <Typography>Invoice Credits(0)</Typography>
            <Typography>$0.00</Typography>
          </div>
          <div className="summary-row total">
            <Typography></Typography>
            <Typography sx={{ fontWeight: 600 }}>Payment amount</Typography>
            <Typography sx={{ fontWeight: 600 }}>$948.18</Typography>
          </div>
        </div>

        <div className="section-header">Choose Payment Method</div>
        <div className="payment-methods">
          {["ACH", "Credit Card", "Wire", "Check"].map((method, idx) => (
            <Typography className="method" key={idx}>
              {method}
            </Typography>
          ))}
        </div>
        <Button size="md">Pay Now </Button>
      </div>
    </Popup>
  );
};

export default InvoicePaymentPopup;
