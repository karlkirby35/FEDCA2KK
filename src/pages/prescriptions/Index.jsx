import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

export default function PrescriptionsIndex() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("/prescriptions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Raw prescriptions:', response.data);
        
        const prescriptionsWithData = await Promise.all(
          response.data.map(async (rx) => {
            try {
              const [patientRes, doctorRes] = await Promise.all([
                axios.get(`/patients/${rx.patient_id}`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`/doctors/${rx.doctor_id}`, { headers: { Authorization: `Bearer ${token}` }})
              ]);
              return {
                ...rx,
                patient: patientRes.data,
                doctor: doctorRes.data
              };
            } catch (err) {
              console.error('Error fetching patient/doctor for prescription', rx.id, err);
              return rx;
            }
          })
        );
        
        console.log('Prescriptions with patient/doctor data:', prescriptionsWithData);
        setPrescriptions(prescriptionsWithData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [token]);

  const onDeleteCallback = (id) => {
    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
  };

  if (loading) return <div>Loading prescriptions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Button asChild>
          <Link to="/prescriptions/create">Create Prescription</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.id}</TableCell>
              <TableCell>{prescription.patient?.first_name} {prescription.patient?.last_name}</TableCell>
              <TableCell>{prescription.doctor?.first_name} {prescription.doctor?.last_name}</TableCell>
              <TableCell>{prescription.medication}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                  ><Eye /></Button>
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}
                  ><Pencil /></Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="prescriptions" id={prescription.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
