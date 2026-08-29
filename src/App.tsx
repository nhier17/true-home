import {Authenticated, Refine} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
    DocumentTitleHandler, NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import {Building2, CreditCard, DollarSign, Home, MailCheck, Users, Wrench} from "lucide-react";
import Dashboard from "@/pages/dashboard.tsx";
import TenantsList from "@/pages/tenants/list.tsx";
import TenantsCreate from "@/pages/tenants/create.tsx";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import PropertyList from "@/pages/properties/list.tsx";
import PropertyCreate from "@/pages/properties/create.tsx";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import {authProvider} from "@/providers/auth.ts";
import LeasesList from "@/pages/leases/list.tsx";
import LeaseCreate from "@/pages/leases/create.tsx";
import LeaseShow from "@/pages/leases/show.tsx";
import PropertyDetails from "@/pages/properties/show.tsx";
import TenantDetails from "@/pages/tenants/show.tsx";
import {OrganizationGuard} from "@/components/auth/organization-guard.tsx";
import Onboarding from "@/pages/onboarding/page.tsx";
import PaymentList from "@/pages/payments/list.tsx";
import PaymentCreate from "@/pages/payments/create.tsx";
import InvoiceList from "@/pages/invoices/list.tsx";
import InvoiceCreate from "@/pages/invoices/create.tsx";
import InvoiceDetails from "@/pages/invoices/show.tsx";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                  title: {
                    text: "Truehome"
                  },
                projectId: "3VqtHd-grghdy-MQFWi7",
              }}
              resources={[
              {
                  name: "dashboard",
                  list: "/",
                  meta: {
                      label: "Dashboard",
                      icon: <Home />
                  }
              },
              {
                  name: "properties",
                  list: "/properties",
                  create: "/properties/create",
                  edit: "/properties/edit/:id",
                  show: "/properties/show/:id",
                  meta: {
                      label: "Properties",
                      icon: <Building2 />
                  }
              },
              {
                  name: "tenants",
                  list: "/tenants",
                  create: "/tenants/create",
                  edit: "/tenants/edit/:id",
                  show: "/tenants/show/:id",
                  meta: {
                      label: "Tenants",
                      icon: <Users />
                  }
              },
                  {
                      name: "leases",
                      list: "/leases",
                      create: "/leases/create",
                      edit: "/leases/edit/:id",
                      show: "/leases/show/:id",
                      meta: {
                          label: "Leases",
                          icon: <MailCheck />
                      }
                  },
                  {
                      name: "invoices",
                      list: "/invoices",
                      create: "/invoices/create",
                      show: "/invoices/show/:id",
                      meta: {
                          label: "Invoices",
                          icon: <CreditCard />
                      }
                  },
                  {
                      name: "payments",
                      list: "/payments",
                      create: "/payments/create",
                      meta: {
                          label: "Payments",
                          icon: <DollarSign />
                      }
                  },
                  {
                      name: "maintenance",
                      list: "/maintenance",
                      meta: {
                          label: "Maintenance",
                          icon: <Wrench />
                      }
                  },
              ]}
            >
                <Routes>
                    <Route
                        element={
                            <Authenticated
                                key="public-routes"
                                fallback={<Outlet />}
                            >
                                <NavigateToResource fallbackTo="/" />
                            </Authenticated>
                        }
                    >
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    <Route
                        element={
                            <Authenticated
                                key="onboarding-route"
                                fallback={<Login />}
                            >
                                <OrganizationGuard requireOrganization={false}>
                                    <Outlet />
                                </OrganizationGuard>
                            </Authenticated>
                        }
                    >
                        <Route
                            path="/onboarding"
                            element={<Onboarding />}
                        />
                    </Route>

                    <Route
                        element={
                            <Authenticated
                                key="private-routes"
                                fallback={<Login />}
                            >
                                <OrganizationGuard requireOrganization>
                                    <Layout>
                                        <Outlet />
                                    </Layout>
                                </OrganizationGuard>
                            </Authenticated>
                        }
                    >
                        <Route path="/" element={<Dashboard />} />

                        <Route path="properties">
                            <Route index element={<PropertyList />} />
                            <Route path="create" element={<PropertyCreate />} />
                            <Route path="show/:id" element={<PropertyDetails />} />
                        </Route>

                        <Route path="leases">
                            <Route index element={<LeasesList />} />
                            <Route path="create" element={<LeaseCreate />} />
                            <Route path="show/:id" element={<LeaseShow />} />
                        </Route>

                        <Route path="tenants">
                            <Route index element={<TenantsList />} />
                            <Route path="create" element={<TenantsCreate />} />
                            <Route path="show/:id" element={<TenantDetails />} />
                        </Route>

                        <Route path="invoices">
                            <Route index element={<InvoiceList />} />
                            <Route path="create" element={<InvoiceCreate />} />
                            <Route path="show/:id" element={<InvoiceDetails />} />
                        </Route>

                        <Route path="payments">
                            <Route index element={<PaymentList />} />
                            <Route path="create" element={<PaymentCreate />} />
                        </Route>
                    </Route>

                </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
