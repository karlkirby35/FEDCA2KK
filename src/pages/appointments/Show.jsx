import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AppointmentShow() {
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointmentRes = await axios.get(`/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Appointment data:", appointmentRes.data);
        setAppointment(appointmentRes.data);

        // Fetch patient and doctor data separately
        if (appointmentRes.data.patient_id && appointmentRes.data.doctor_id) {
          const [patientRes, doctorRes] = await Promise.all([
            axios.get(`/patients/${appointmentRes.data.patient_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`/doctors/${appointmentRes.data.doctor_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);
          setPatient(patientRes.data);
          setDoctor(doctorRes.data);
        }
      } catch (err) {
        console.error("Full error:", err);
        console.error("Response data:", err.response?.data);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!appointment) return <div>No appointment found</div>;

  return (
    <>
      <Button 
          variant="outline"
          onClick={() => navigate('/appointments')}
          className="w-fit mb-4"
        >← Back</Button>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Appointment #{appointment.id}</CardTitle>
          <CardDescription>
            {appointment.status}
          </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Patient:</strong> {appointment.patient?.first_name} {appointment.patient?.last_name}</p>
          <p><strong>Doctor:</strong> {appointment.doctor?.first_name} {appointment.doctor?.last_name}</p>
          <p><strong>Date:</strong> {appointment.appointment_date}</p>
          <p><strong>Time:</strong> {appointment.appointment_time}</p>
          <p><strong>Reason:</strong> {appointment.reason}</p>
          <p><strong>Notes:</strong> {appointment.notes}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
    </>
  );
}
