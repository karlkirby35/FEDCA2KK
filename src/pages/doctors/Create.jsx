import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Create() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        specialization: "",
        license_number: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const createDoctor = async () => {
        setSubmitting(true);
        try {
            const response = await axios.post('/doctors', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Doctor created successfully');
            navigate('/doctors', { state: { type: 'success', message: `Doctor "${response.data.first_name} ${response.data.last_name}" created` } });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.message) toast.error(data.message);
                else if (data.errors) {
                    const msgs = Object.values(data.errors).flat().join(' - ');
                    toast.error(msgs);
                } else {
                    toast.error('Validation failed');
                }
            } else {
                toast.error(err.message || 'Request failed');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createDoctor();
    };

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Add Doctor</h1>
        <form onSubmit={handleSubmit} className="space-y-2 max-w-lg">
            <Input 
                type="text" 
                placeholder="First name" 
                name="first_name" 
                value={form.first_name} 
                onChange={handleChange}
                required
            />
            <Input 
                type="text" 
                placeholder="Last name" 
                name="last_name" 
                value={form.last_name} 
                onChange={handleChange}
                required
            />
            <Input 
                type="email" 
                placeholder="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange}
                required
            />
            <Input 
                type="text" 
                placeholder="Phone" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange}
                required
            />
            <Input 
                type="text" 
                placeholder="Specialization (e.g., Cardiology)" 
                name="specialization" 
                value={form.specialization} 
                onChange={handleChange}
                required
            />
            <Input 
                type="text" 
                placeholder="License number" 
                name="license_number" 
                value={form.license_number} 
                onChange={handleChange}
                required
            />
            <Button 
                className="mt-4" 
                variant="outline" 
                type="submit" 
                disabled={submitting}
            >{submitting ? 'Creating...' : 'Add Doctor'}</Button>
        </form>
    </>
  );
}
