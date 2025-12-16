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
        return {
          ...appt,
          patient: patientRes.data,
          doctor: doctorRes.data
        };
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
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.patient?.first_name} {appointment.patient?.last_name}</TableCell>
              <TableCell>{appointment.doctor?.first_name} {appointment.doctor?.last_name}</TableCell>
              <TableCell>{appointment.appointment_date}</TableCell>
              <TableCell>{appointment.appointment_time}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <button
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
