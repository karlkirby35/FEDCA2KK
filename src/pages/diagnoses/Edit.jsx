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
        condition: "",
        description: "",
        diagnosis_date: "",
        status: "active",
        severity: "mild",
        notes: "",
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
                const [diagnosisRes, patientsRes, doctorsRes] = await Promise.all([
                    axios.get(`/diagnoses/${id}`, { headers: { Authorization: `Bearer ${token}` }}),
                    axios.get('/patients', { headers: { Authorization: `Bearer ${token}` }}),
                    axios.get('/doctors', { headers: { Authorization: `Bearer ${token}` }})
                ]);
                
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
                
                setForm({
                    patient_id: diagnosisRes.data.patient_id?.toString() || "",
                    doctor_id: diagnosisRes.data.doctor_id?.toString() || "",
                    condition: diagnosisRes.data.condition || "",
                    description: diagnosisRes.data.description || "",
                    diagnosis_date: diagnosisRes.data.diagnosis_date || "",
                    status: diagnosisRes.data.status || "active",
                    severity: diagnosisRes.data.severity || "mild",
                    notes: diagnosisRes.data.notes || "",
                });
            } catch (err) {
                console.error(err);
                if (err.response?.status === 404) {
                    toast.error('Diagnosis not found');
                    navigate('/diagnoses');
                } else {
                    toast.error('Failed to load diagnosis data');
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

    const updateDiagnosis = async () => {
        setSubmitting(true);
        try {
            const payload = {
                patient_id: parseInt(form.patient_id),
                doctor_id: parseInt(form.doctor_id),
                condition: form.condition.trim(),
                description: form.description.trim(),
                diagnosis_date: form.diagnosis_date,
                status: form.status,
                severity: form.severity,
                notes: form.notes.trim(),
            };
            
            let response;
            try {
                response = await axios.patch(`/diagnoses/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (patchErr) {
                if (patchErr.response?.status === 404) {
                    response = await axios.put(`/diagnoses/${id}`, payload, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    throw patchErr;
                }
            }
            toast.success('Diagnosis updated successfully');
            navigate('/diagnoses');
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
        updateDiagnosis();
    };

    if (loading) return <div>Loading diagnosis data...</div>;

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Edit Diagnosis</h1>
        <form onSubmit={handleSubmit} className="space-y-2 max-w-2xl">
            
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
                type="text" 
                placeholder="Condition" 
                name="condition" 
                value={form.condition} 
                onChange={handleChange}
            />

            <textarea 
                placeholder="Description" 
                name="description" 
                value={form.description} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
            />

            <div>
                <label className="text-sm font-medium">Diagnosis Date</label>
                <Input 
                    type="date" 
                    name="diagnosis_date" 
                    value={form.diagnosis_date} 
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Severity</label>
                <Select value={form.severity} onValueChange={(value) => handleSelectChange('severity', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <textarea 
                placeholder="Notes" 
                name="notes" 
                value={form.notes} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="2"
            />

            <div className="flex gap-2">
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="submit" 
                    disabled={submitting}
                >{submitting ? 'Updating...' : 'Update Diagnosis'}</Button>
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate('/diagnoses')}
                >Cancel</Button>
            </div>
        </form>
    </>
  );
}
