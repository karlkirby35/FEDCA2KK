import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Create() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        specialisation: "",
        licence_number: "",
    });
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createDoctor = async () => {

        const options = {
            method: "POST",
            url: `/doctors`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/doctors', { state: { 
                type: 'success',
                message: `Doctor "${response.data.first_name} ${response.data.last_name}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createDoctor();
    };

  return (
    <>
        <h1>Create a new Doctor</h1>
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
            >Submit</Button>
        </form>
    </>
  );
}
