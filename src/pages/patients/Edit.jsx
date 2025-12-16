import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate, useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

export default function Edit() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        medical_record_number: "",
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    
    useEffect(() => {
        const fetchPatient = async () => {
            try {

                const response = await axios.get(`/patients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const patientData = { ...response.data };
                if (patientData.date_of_birth) {
                    if (!isNaN(patientData.date_of_birth)) {
                        let timestamp = parseInt(patientData.date_of_birth);
                        if (timestamp < 10000000000) {
                            timestamp = timestamp * 1000;
                        }
                        const date = new Date(timestamp);
                        patientData.date_of_birth = date.toISOString().split('T')[0];
                    
                    } else if (patientData.date_of_birth.includes('T')) {
                        
                        patientData.date_of_birth = patientData.date_of_birth.split('T')[0];
                    }
                }
                
                setForm({
                    first_name: patientData.first_name || "",
                    last_name: patientData.last_name || "",
                    email: patientData.email || "",
                    phone: patientData.phone || "",
                    address: patientData.address || "",
                    date_of_birth: patientData.date_of_birth || "",
                    medical_record_number: patientData.medical_record_number || "",
                });
            } catch (err) {
                
                if (err.response?.status === 404) {
                    toast.error('Patient not found');
                    navigate('/patients');
                } else {
                    toast.error('Failed to load patient data');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id, token, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const updatePatient = async () => {
        setSubmitting(true);
        try {
            
            let response;
            try {
                response = await axios.patch(`/patients/${id}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (patchErr) {
            
                if (patchErr.response?.status === 404) {
                    response = await axios.put(`/patients/${id}`, form, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    throw patchErr;
                }
            }
            toast.success('Patient updated successfully');
            navigate('/patients', { state: { type: 'success', message: `Patient "${response.data.first_name} ${response.data.last_name}" updated` } });
        } catch (err) {
            console.error("Full error:", err);
            console.error("Error response:", err.response?.data);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.error?.issues) {
            
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
        updatePatient();
    };

    if (loading) return <div>Loading patient data...</div>;

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Edit Patient</h1>
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
                placeholder="Phone (min 10 characters)" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange}
                minLength="10"
            />
            <Input 
                type="text" 
                placeholder="Address" 
                name="address" 
                value={form.address} 
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
            <div className="flex gap-2">
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="submit" 
                    disabled={submitting}
                >{submitting ? 'Updating...' : 'Update Patient'}</Button>
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate('/patients')}
                >Cancel</Button>
            </div>
        </form>
    </>
  );
}