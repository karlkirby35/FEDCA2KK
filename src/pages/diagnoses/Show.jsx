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

export default function DiagnosisShow() {
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(`/diagnoses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        let diagnosisData = response.data;
        try {
          const [patientRes, doctorRes] = await Promise.all([
            axios.get(`/patients/${response.data.patient_id}`, { headers: { Authorization: `Bearer ${token}` }}),
            axios.get(`/doctors/${response.data.doctor_id}`, { headers: { Authorization: `Bearer ${token}` }})
          ]);
          diagnosisData = {
            ...response.data,
            patient: patientRes.data,
            doctor: doctorRes.data
          };
        } catch (err) {
          console.error('Error fetching patient/doctor:', err);
        }
        
        setDiagnosis(diagnosisData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!diagnosis) return <div>No diagnosis found</div>;

  return (
    <>
      <Button 
          variant="outline"
          onClick={() => navigate('/diagnoses')}
          className="w-fit mb-4"
        >← Back</Button>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Diagnosis #{diagnosis.id}</CardTitle>
          <CardDescription>
            Condition: {diagnosis.condition}
          </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Patient</p>
              <p>{diagnosis.patient?.first_name} {diagnosis.patient?.last_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Doctor</p>
              <p>{diagnosis.doctor?.first_name} {diagnosis.doctor?.last_name}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-600">Condition</p>
              <p>{diagnosis.condition || 'N/A'}</p>
            </div>
            {diagnosis.description && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p>{diagnosis.description}</p>
              </div>
            )}
            {diagnosis.diagnosis_date && (
              <div>
                <p className="text-sm font-medium text-gray-600">Diagnosis Date</p>
                <p>{formatDate(diagnosis.diagnosis_date)}</p>
              </div>
            )}
            {diagnosis.status && (
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p>{diagnosis.status}</p>
              </div>
            )}
            {diagnosis.severity && (
              <div>
                <p className="text-sm font-medium text-gray-600">Severity</p>
                <p>{diagnosis.severity}</p>
              </div>
            )}
            {diagnosis.notes && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-600">Notes</p>
                <p>{diagnosis.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button 
            variant="default"
            onClick={() => navigate(`/diagnoses/${diagnosis.id}/edit`)}
            className="w-full"
          >
            Edit Diagnosis
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
