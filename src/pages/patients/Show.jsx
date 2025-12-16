import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Show() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      const options = {
        method: "GET",
        url: `/patients/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPatient(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No patient found</div>;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
        <CardDescription>
          Patient ID: {patient.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
          <p><strong>Medical Record Number:</strong> {patient.medical_record_number}</p>
        </div>
      </CardContent>
        <Button 
          variant="outline"
          onClick={() => navigate('/patients')}
          className="w-full"
        >Back to Patients</Button>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
