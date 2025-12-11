import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

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
        setPrescriptions(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [token]);

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
            <TableHead>Dosage</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.id}</TableCell>
              <TableCell>{prescription.patient?.first_name} {prescription.patient?.last_name}</TableCell>
              <TableCell>{prescription.doctor?.first_name} {prescription.doctor?.last_name}</TableCell>
              <TableCell>{prescription.medication_name}</TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>{prescription.issue_date}</TableCell>
              <TableCell>{prescription.expiry_date}</TableCell>
              <TableCell>{prescription.status}</TableCell>
              <TableCell>
                <button
                  onClick={() => navigate(`/prescriptions/${prescription.id}`)}
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
