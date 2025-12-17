import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DoctorsIndex() {
  const [doctors, setDoctors] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const options = {
        method: "GET",
        url: "/doctors",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  const onDeleteCallback = (id) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  };

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link size="sm" to={`/doctors/create`}>
            Create New Doctor
          </Link>
        </Button>
      )}

      <Table>
        <TableCaption>A list of your doctors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Specialisation</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>{doctor.first_name}</TableCell>
              <TableCell>{doctor.last_name}</TableCell>
              <TableCell>{doctor.specialisation}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.phone}</TableCell>
              {token && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      className="cursor-pointer hover:border-blue-500"
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/doctors/${doctor.id}`)}
                    ><Eye /></Button>
                    <Button 
                      className="cursor-pointer hover:border-blue-500"
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                    ><Pencil /></Button>
                    <DeleteBtn onDeleteCallback={onDeleteCallback} resource="doctors" id={doctor.id} />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
