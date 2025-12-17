import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate, useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialisation: "",
    licence_number: "",
  });

  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        let doctor = response.data;
        setForm({
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            email: doctor.email,
            phone: doctor.phone,
            specialisation: doctor.specialisation,
            licence_number: doctor.licence_number,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateDoctor = async () => {
    

    const options = {
      method: "PATCH",
      url: `/doctors/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/doctors");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updateDoctor();
  };

  return (
    <>
      <h1>Update Doctor</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Last name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Specialisation"
          name="specialisation"
          value={form.specialisation}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Licence number"
          name="licence_number"
          value={form.licence_number}
          onChange={handleChange}
        />
        <Button
          className="mt-4 cursor-pointer"
          variant="outline"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
