import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DoctorShow() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        console.log("Fetching doctor with ID:", id);
        const response = await axios.get(`/doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Doctor data:", response.data);
        setDoctor(response.data);
      } catch (err) {
        console.error("Full error:", err);
        console.error("Response data:", err.response?.data);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!doctor) return <div>No doctor found</div>;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{doctor.first_name} {doctor.last_name}</CardTitle>
        <CardDescription>
          {doctor.specialization}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>License Number:</strong> {doctor.license_number}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  );
}
