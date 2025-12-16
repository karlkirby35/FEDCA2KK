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
        specialisation: "",
        licence_number: "",
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

    const handleSelectChange = (value) => {
        setForm({
            ...form,
            specialisation: value
        });
    };

   const createDoctor = async () => {
  setSubmitting(true);
  try {
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      specialisation: form.specialisation.trim(),
      licence_number: form.licence_number.trim(),
    };

    console.log("Sending payload:", payload);
    const response = await axios.post('/doctors', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Doctor created successfully');
    navigate('/doctors', { state: { type: 'success', message: `Doctor "${response.data.first_name} ${response.data.last_name}" created` } });
  } catch (err) {
    console.error("Full error:", err);
    console.error("Error response:", err.response?.data);
    if (err.response && err.response.data) {
      const data = err.response.data;
      if (data.error?.issues) {
        // Zod validation errors
        const msgs = data.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
        toast.error(msgs);
      } else if (typeof data === 'string') {
        toast.error(data);
      } else if (Array.isArray(data)) {
        toast.error(data.join(', '));
      } else if (data.errors) {
        const msgs = Object.entries(data.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join('\n');
        toast.error(msgs);
      } else if (data.message) {
        toast.error(data.message);
      } else {
        toast.error(JSON.stringify(data));
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
            <div>
                <label className="text-sm font-medium">Specialisation</label>
                <Select value={form.specialisation} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select specialisation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                        <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                        <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                        <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                        <SelectItem value="Podiatrist">Podiatrist</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Input 
                type="text" 
                placeholder="Licence number" 
                name="licence_number" 
                value={form.licence_number} 
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
