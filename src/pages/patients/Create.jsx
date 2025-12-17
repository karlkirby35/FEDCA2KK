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
        address: "",
        date_of_birth: "",
        medical_record_number: "",
    });
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createPatient = async () => {

        const options = {
            method: "POST",
            url: `/patients`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/patients', { state: { 
                type: 'success',
                message: `Patient "${response.data.first_name} ${response.data.last_name}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createPatient();
    };

  return (
    <>
        <h1>Create a new Patient</h1>
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
                placeholder="Address" 
                name="address" 
                value={form.address} 
                onChange={handleChange}
            />
            <Input 
                className="mt-2"
                type="date" 
                placeholder="Date of birth" 
                name="date_of_birth" 
                value={form.date_of_birth} 
                onChange={handleChange} 
            />
            <Input 
                className="mt-2"
                type="text" 
                placeholder="Medical record number" 
                name="medical_record_number" 
                value={form.medical_record_number} 
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