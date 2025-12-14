import { useState, useEffect} from 'react';
import { AuthProvider } from './hooks/useAuth';

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';

import PatientsIndex from '@/pages/patients/Index';
import PatientsShow from '@/pages/patients/Show';

import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';
import DoctorsCreate from '@/pages/doctors/Create';

import AppointmentsIndex from '@/pages/appointments/Index';
import AppointmentsShow from '@/pages/appointments/Show';
import AppointmentsCreate from '@/pages/appointments/Create';

import PrescriptionsIndex from '@/pages/prescriptions/Index';
import PrescriptionsShow from '@/pages/prescriptions/Show';
import PrescriptionsCreate from '@/pages/prescriptions/Create';

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
                <Routes>
                  <Route
                    path="/"
                    element={<Home />}
                  />

                  <Route path="/patients" element={<PatientsIndex />} />
                  <Route
                    path="/patients/:id"
                    element={<PatientsShow />}
                  />

                  <Route path="/doctors" element={<DoctorsIndex />} />
                  <Route path="/doctors/create" element={<DoctorsCreate />} />
                  <Route
                    path="/doctors/:id"
                    element={<DoctorsShow />}
                  />

                  <Route path="/appointments" element={<AppointmentsIndex />} />
                  <Route path="/appointments/create" element={<AppointmentsCreate />} />
                  <Route
                    path="/appointments/:id"
                    element={<AppointmentsShow />}
                  />

                  <Route path="/prescriptions" element={<PrescriptionsIndex />} />
                  <Route path="/prescriptions/create" element={<PrescriptionsCreate />} />
                  <Route
                    path="/prescriptions/:id"
                    element={<PrescriptionsShow />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}