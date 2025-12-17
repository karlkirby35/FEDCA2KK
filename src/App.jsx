import { AuthProvider } from './hooks/useAuth';

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import Home from '@/pages/Home';
import ProtectedRoute from '@/components/ProtectedRoute';

import PatientsIndex from '@/pages/patients/Index';
import PatientsShow from '@/pages/patients/Show';
import PatientsCreate from '@/pages/patients/Create';
import PatientsEdit from '@/pages/patients/Edit';

import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';
import DoctorsCreate from '@/pages/doctors/Create';
import DoctorsEdit from '@/pages/doctors/Edit';

import AppointmentsIndex from '@/pages/appointments/Index';
import AppointmentsShow from '@/pages/appointments/Show';
import AppointmentsCreate from '@/pages/appointments/Create';
import AppointmentsEdit from '@/pages/appointments/Edit';

import PrescriptionsIndex from '@/pages/prescriptions/Index';
import PrescriptionsShow from '@/pages/prescriptions/Show';
import PrescriptionsCreate from '@/pages/prescriptions/Create';
import PrescriptionsEdit from '@/pages/prescriptions/Edit';

export default function App() {

  return (
    <Router>
      <AuthProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {/* <Navbar onLogin={onLogin} loggedIn={loggedIn} /> */}

          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-6">
                {/* Main content */}
                <AnimatedRoutes />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="motion-safe:animate-in motion-safe:fade-in-5 motion-safe:slide-in-from-bottom-50 duration-300"
    >
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<PatientsIndex />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/patients/:id" element={<PatientsShow />} />
          <Route path="/patients/:id/edit" element={<PatientsEdit />} />
          <Route path="/patients/create" element={<PatientsCreate />} />
        </Route>

        <Route path="/doctors" element={<DoctorsIndex />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/doctors/:id" element={<DoctorsShow />} />
          <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />
          <Route path="/doctors/create" element={<DoctorsCreate />} />
        </Route>

        <Route path="/appointments" element={<AppointmentsIndex />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/appointments/:id" element={<AppointmentsShow />} />
          <Route path="/appointments/:id/edit" element={<AppointmentsEdit />} />
          <Route path="/appointments/create" element={<AppointmentsCreate />} />
        </Route>

        <Route path="/prescriptions" element={<PrescriptionsIndex />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/prescriptions/:id" element={<PrescriptionsShow />} />
          <Route path="/prescriptions/:id/edit" element={<PrescriptionsEdit />} />
          <Route path="/prescriptions/create" element={<PrescriptionsCreate />} />
        </Route>
      </Routes>
    </div>
  );
}