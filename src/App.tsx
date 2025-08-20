import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import type { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import PageLayout from '@/components/PageLayout';
import Agreements from '@/pages/FleetManagement/Agreements';
import NotFound from '@/pages/NotFound';
import LeaseAgreementOverview from '@/components/LeaseAgreementOverview';
import RentAgreementOverview from '@/components/RentAgreementOverview';
import DOTPMCompliance from './pages/DOTPMCompliance';
import EquipmentListing from './pages/EquipmentListing';
import BillingInvoices from './pages/BillingInvoices';
import BillingPayment from './pages/BillingPayment';
import Accounts from './pages/AccountsManagement/Accounts';
import Customers from './pages/AccountsManagement/Customers';
import AccountDetails from './pages/AccountsManagement/AccountDetails';
import CustomerUsersList from './pages/CustomerUsersList';
import AllAccounts from './pages/AllAccounts';
import AccountViewDetails from './components/AccountViewDetails';
import EmergencyResponsiveService from '@/pages/TenCare/EmergencyResponsiveService';
import EmergencyResponseDetails from '@/components/EmergencyResponseDetails';
import Geofences from './pages/Geofences';
import FleetView from './pages/FleetView';
import EquipmentDetails from '@/components/EquipmentDetails';
import { GeofenceProvider } from '@/contexts/GeofenceContext';
import WorkOrders from './pages/TenCare/WorkOrders';
import ReportsExplorer from './pages/Reports/ReportsExplorer';
import RequestServiceHistoryDetailView from './pages/TenCare/RequestServiceHistoryDetailView';
import InvoiceDetails from './components/InvoiceDetails';
import PaymentDetails from './components/PaymentDetails';
import WorkOrderDetails from './components/WorkOrderDetails';
import ReportsTableView from './components/ReportTableView';
import Dashboard from './pages/Dashboard';
import UserRolesAndPermissions from '@/pages/AccountsManagement/UserRolesPermissions';
import RolesPermissionsForm from '@/pages/AccountsManagement/RolesPermissionsForm';
import Login from './pages/Login';
import Verify from './pages/Verify';
const UserManagement = lazy(() => import('@/pages/AccountsManagement/UserManagement'));
const RequestServiceHistory = lazy(() => import('@/pages/TenCare/RequestServiceHistory'));

const App = () => {
  const theme = useSelector((state: RootState) => state.theme.value);

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
    typography: {
      fontFamily: ['Public Sans', 'Poppins'].join(','),
    },
  });

  return (
    <Suspense>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <main>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/" element={<PageLayout />}>
                {/* Home */}
                <Route index element={<Dashboard />} />

                {/* All Accounts */}
                <Route path="/all-accounts/:customerId" element={<AllAccounts />} />
                <Route path="/customers" element={<Customers isFrom="customers" />} />

                {/* Customer Users */}
                <Route path="/customer-users" element={<Customers isFrom="customer-users" />} />
                <Route path="/customer-users/:customerId" element={<CustomerUsersList />} />

                {/* Fleet Management */}
                <Route path="fleet">
                  <Route path="/fleet/fleet-view" element={<FleetView />} />
                  <Route path="/fleet/equipment-listing" element={<EquipmentListing />} />
                  <Route path="/fleet/fleet-view-details" element={<EquipmentDetails />} />
                  <Route
                    path="/fleet/telematics"
                    element={
                      <GeofenceProvider>
                        <Geofences />
                      </GeofenceProvider>
                    }
                  />
                  <Route path="/fleet/dot-pm-compliance" element={<DOTPMCompliance />} />
                  <Route path="/fleet/agreements" element={<Agreements />} />

                  <Route
                    path="/fleet/lease-agreement-overview"
                    element={<LeaseAgreementOverview />}
                  />
                  <Route
                    path="/fleet/rent-agreement-overview"
                    element={<RentAgreementOverview />}
                  />
                </Route>

                {/* TEN Care */}
                <Route path="ten-care">
                  <Route path="/ten-care/work-orders" element={<WorkOrders />} />
                  <Route path="/ten-care/work-order-overview" element={<WorkOrderDetails />} />
                  <Route
                    path="/ten-care/emergency-response-service"
                    element={<EmergencyResponsiveService />}
                  />
                  <Route
                    path="/ten-care/emergency-response-service-details"
                    element={<EmergencyResponseDetails />}
                  />
                  <Route
                    path="/ten-care/request-service-history"
                    element={<RequestServiceHistory />}
                  />
                  <Route
                    path="/ten-care/request-service-history-detail-view"
                    element={<RequestServiceHistoryDetailView />}
                  />
                </Route>

                {/* Billing */}
                <Route path="billing">
                  <Route path="/billing/invoices" element={<BillingInvoices />} />
                  <Route path="/billing/payments" element={<BillingPayment />} />
                  <Route path="/billing/invoice-overview" element={<InvoiceDetails />} />
                  <Route path="/billing/payment-overview" element={<PaymentDetails />} />
                </Route>

                {/* Reports */}
                <Route path="reports">
                  <Route path="/reports/explorer" element={<ReportsExplorer />} />
                  <Route path="/reports/reports-explorer-overview" element={<ReportsTableView />} />
                </Route>
                {/* Account Management */}
                <Route path="account-management">
                  <Route path="/account-management/accounts" element={<Accounts />} />
                  <Route
                    path="/account-management/customers"
                    element={<Customers isFrom="customer-users" />}
                  />

                  <Route
                    path="/account-management/account-view-details/:customerId/:accountId"
                    element={<AccountViewDetails />}
                  />
                  <Route path="/account-management/user-management" element={<UserManagement />} />
                  <Route
                    path="/account-management/user-roles-and-permissions"
                    element={<UserRolesAndPermissions />}
                  />
                  <Route
                    path="/account-management/user-roles-and-permissions/form"
                    element={<RolesPermissionsForm />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </main>
      </ThemeProvider>
    </Suspense>
  );
};

export default App;
