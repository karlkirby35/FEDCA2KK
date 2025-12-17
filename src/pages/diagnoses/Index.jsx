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

export default function DiagnosesIndex() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get("/diagnoses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Diagnoses:', response.data);
        
        const diagnosesWithData = await Promise.all(
          response.data.map(async (diagnosis) => {
            try {
              const [patientRes, doctorRes] = await Promise.all([
                axios.get(`/patients/${diagnosis.patient_id}`, { headers: { Authorization: `Bearer ${token}` }}),
                axios.get(`/doctors/${diagnosis.doctor_id}`, { headers: { Authorization: `Bearer ${token}` }})
              ]);
              return {
                ...diagnosis,
                patient: patientRes.data,
                doctor: doctorRes.data
              };
            } catch (err) {
              console.error('Error fetching patient/doctor for diagnosis', diagnosis.id, err);
              return diagnosis;
            }
          })
        );
        
        setDiagnoses(diagnosesWithData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [token]);

  const onDeleteCallback = (id) => {
    setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
  };

  if (loading) return <div>Loading diagnoses...</div>;
  if (error) return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="font-semibold text-red-800">Error loading diagnoses</h2>
      <p className="text-red-700 mt-1">{error}</p>
      <p className="text-sm text-red-600 mt-2">
        This might mean the diagnoses endpoint isn't available on your API yet, 
        or your session expired. Try logging out and back in.
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Diagnoses</h1>
        <Button asChild>
          <Link to="/diagnoses/create">Create Diagnosis</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.map((diagnosis) => (
            <TableRow key={diagnosis.id}>
              <TableCell>{diagnosis.id}</TableCell>
              <TableCell>{diagnosis.patient?.first_name} {diagnosis.patient?.last_name}</TableCell>
              <TableCell>{diagnosis.doctor?.first_name} {diagnosis.doctor?.last_name}</TableCell>
              <TableCell>{diagnosis.condition}</TableCell>
              <TableCell>{diagnosis.status || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${diagnosis.id}`)}
                  ><Eye /></Button>
                  <Button 
                    className="cursor-pointer hover:border-blue-500"
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
                  ><Pencil /></Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="diagnoses" id={diagnosis.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
