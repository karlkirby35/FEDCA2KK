import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

export default function Create() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        medical_record_number: "",
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

    const createPatient = async () => {
        setSubmitting(true);
        try {
            const response = await axios.post('/patients', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Patient created successfully');
            navigate('/patients', { state: { type: 'success', message: `Patient "${response.data.first_name} ${response.data.last_name}" created` } });
        } catch (err) {
            console.error(err);
            // show validation errors if available
            if (err.response && err.response.data) {
                // API may return errors as object or array
                const data = err.response.data;
                if (typeof data === 'string') toast.error(data);
                else if (Array.isArray(data)) toast.error(data.join(', '));
                else if (data.errors) {
                    // Laravel-like validation: { errors: { field: [msg] } }
                    const msgs = Object.values(data.errors).flat().join(' - ');
                    toast.error(msgs);
                } else if (data.message) {
                    toast.error(data.message);
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
        createPatient();
    };

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Create Patient</h1>
        <form onSubmit={handleSubmit} className="space-y-2 max-w-lg">
            <Input 
                type="text" 
                placeholder="First name" 
                name="first_name" 
                value={form.first_name} 
                onChange={handleChange} 
            />
            <Input 
                type="text" 
                placeholder="Last name" 
                name="last_name" 
                value={form.last_name} 
                onChange={handleChange} 
            />
            <Input 
                type="email" 
                placeholder="Email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
            />
            <Input 
                type="text" 
                placeholder="Phone" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
            />
            <Input 
                type="date" 
                placeholder="Date of birth" 
                name="date_of_birth" 
                value={form.date_of_birth} 
                onChange={handleChange} 
            />
            <Input 
                type="text" 
                placeholder="Medical record number" 
                name="medical_record_number" 
                value={form.medical_record_number} 
                onChange={handleChange} 
            />
            <Button 
                className="mt-4" 
                variant="outline" 
                type="submit" 
                disabled={submitting}
            >{submitting ? 'Creating...' : 'Create Patient'}</Button>
        </form>
    </>
  );
}