import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate, useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Edit() {
    const [form, setForm] = useState({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
        notes: "",
        status: "scheduled",
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentRes, patientsRes, doctorsRes] = await Promise.all([
                    axios.get(`/appointments/${id}`, { headers: { Authorization: `Bearer ${token}` }}),
                    axios.get('/patients', { headers: { Authorization: `Bearer ${token}` }}),
                    axios.get('/doctors', { headers: { Authorization: `Bearer ${token}` }})
                ]);
                
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
                
                let appointmentDate = appointmentRes.data.appointment_date || "";
                if (appointmentDate && !isNaN(appointmentDate)) {
                    let timestamp = parseInt(appointmentDate);
                    if (timestamp < 10000000000) {
                        timestamp = timestamp * 1000;
                    }
                    const date = new Date(timestamp);
                    appointmentDate = date.toISOString().split('T')[0];
                }
                
                setForm({
                    patient_id: appointmentRes.data.patient_id?.toString() || "",
                    doctor_id: appointmentRes.data.doctor_id?.toString() || "",
                    appointment_date: appointmentDate,
                    appointment_time: appointmentRes.data.appointment_time || "",
                    reason: appointmentRes.data.reason || "",
                    notes: appointmentRes.data.notes || "",
                    status: appointmentRes.data.status || "scheduled",
                });
            } catch (err) {
                console.error(err);
                if (err.response?.status === 404) {
                    toast.error('Appointment not found');
                    navigate('/appointments');
                } else {
                    toast.error('Failed to load appointment data');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const handleSelectChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const updateAppointment = async () => {
        setSubmitting(true);
        try {
            let response;
            const formData = {
                ...form,
                patient_id: parseInt(form.patient_id),
                doctor_id: parseInt(form.doctor_id)
            };
            try {
                response = await axios.patch(`/appointments/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (patchErr) {
                if (patchErr.response?.status === 404) {
                    response = await axios.put(`/appointments/${id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    throw patchErr;
                }
            }
            toast.success('Appointment updated successfully');
            navigate('/appointments');
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
        if (!form.patient_id || !form.doctor_id) {
            toast.error('Please select a patient and doctor');
            return;
        }
        updateAppointment();
    };

    if (loading) return <div>Loading appointment data...</div>;

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Edit Appointment</h1>
        <form onSubmit={handleSubmit} className="space-y-2 max-w-lg">
            <div>
                <label className="text-sm font-medium">Patient</label>
                <Select value={form.patient_id} onValueChange={(value) => handleSelectChange('patient_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                        {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                                {patient.first_name} {patient.last_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div>
                <label className="text-sm font-medium">Doctor</label>
                <Select value={form.doctor_id} onValueChange={(value) => handleSelectChange('doctor_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                        {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                {doctor.first_name} {doctor.last_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Input 
                type="date" 
                placeholder="Appointment date" 
                name="appointment_date" 
                value={form.appointment_date} 
                onChange={handleChange}
            />
            <Input 
                type="time" 
                placeholder="Appointment time" 
                name="appointment_time" 
                value={form.appointment_time} 
                onChange={handleChange}
            />
            <Input 
                type="text" 
                placeholder="Reason" 
                name="reason" 
                value={form.reason} 
                onChange={handleChange}
            />
            <textarea 
                placeholder="Notes" 
                name="notes" 
                value={form.notes} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
            />
            <div className="flex gap-2">
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="submit" 
                    disabled={submitting}
                >{submitting ? 'Updating...' : 'Update Appointment'}</Button>
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate('/appointments')}
                >Cancel</Button>
            </div>
        </form>
    </>
  );
}
