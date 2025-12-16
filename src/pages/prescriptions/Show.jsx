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

export default function PrescriptionShow() {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`/prescriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrescription(response.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!prescription) return <div>No prescription found</div>;

  return (
    <>
      <Button 
          variant="outline"
          onClick={() => navigate('/prescriptions')}
          className="w-fit mb-4"
        >← Back</Button>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Prescription #{prescription.id}</CardTitle>
          <CardDescription>
            Status: {prescription.status}
          </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Patient</p>
              <p>{prescription.patient?.first_name} {prescription.patient?.last_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Doctor</p>
              <p>{prescription.doctor?.first_name} {prescription.doctor?.last_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Medication</p>
              <p>{prescription.medication_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Dosage</p>
              <p>{prescription.dosage}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Frequency</p>
              <p>{prescription.frequency}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p>{prescription.duration}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Issue Date</p>
              <p>{prescription.issue_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Expiry Date</p>
              <p>{prescription.expiry_date}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Instructions</p>
            <p>{prescription.instructions}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Side Effects/Warnings</p>
            <p>{prescription.side_effects}</p>
          </div>
        </div>
      </CardContent>
        <CardFooter className="flex-col gap-2">
        </CardFooter>
      </Card>
    </>
  );
}
