import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AppointmentsIndex() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
  try {
    const res = await axios.get("/appointments", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const appointmentsWithData = await Promise.all(
      res.data.map(async (appt) => {
        const [patientRes, doctorRes] = await Promise.all([
          axios.get(`/patients/${appt.patient_id}`, { headers: { Authorization: `Bearer ${token}` }}),
          axios.get(`/doctors/${appt.doctor_id}`, { headers: { Authorization: `Bearer ${token}` }})
        ]);
        const enrichedAppt = {
          ...appt,
          patient: patientRes.data,
          doctor: doctorRes.data
        };
        console.log('Appointment data:', enrichedAppt);
        return enrichedAppt;
      })
    );

    

    setAppointments(appointmentsWithData);
  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


    fetchAppointments();
  }, [token]);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => navigate('/appointments/create')}>Create Appointment</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            // Convert timestamp to date string
            let appointmentDate = 'N/A';
            if (appointment.appointment_date) {
              let timestamp = parseInt(appointment.appointment_date);
              if (timestamp < 10000000000) {
                timestamp = timestamp * 1000;
              }
              const date = new Date(timestamp);
              appointmentDate = date.toISOString().split('T')[0];
            }
            
            return (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.patient?.first_name} {appointment.patient?.last_name}</TableCell>
              <TableCell>{appointment.doctor?.first_name} {appointment.doctor?.last_name}</TableCell>
              <TableCell>{appointmentDate}</TableCell>
              <TableCell>
                <button
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
