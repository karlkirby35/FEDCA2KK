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
        diagnosis_id: "",
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        side_effects: "",
        start_date: "",
        end_date: "",
        status: "active",
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
                const [prescriptionRes, patientsRes, doctorsRes] = await Promise.all([
                    axios.get(`/prescriptions/${id}`, { headers: { Authorization: `Bearer ${token}` }}),
                    axios.get('/patients', { headers: { Authorization: `Bearer ${token}` }}),
                    axios.get('/doctors', { headers: { Authorization: `Bearer ${token}` }})
                ]);
                
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
                
                setForm({
                    patient_id: prescriptionRes.data.patient_id?.toString() || "",
                    doctor_id: prescriptionRes.data.doctor_id?.toString() || "",
                    diagnosis_id: prescriptionRes.data.diagnosis_id?.toString() || "",
                    medication: prescriptionRes.data.medication || "",
                    dosage: prescriptionRes.data.dosage || "",
                    frequency: prescriptionRes.data.frequency || "",
                    duration: prescriptionRes.data.duration || "",
                    instructions: prescriptionRes.data.instructions || "",
                    side_effects: prescriptionRes.data.side_effects || "",
                    start_date: prescriptionRes.data.issue_date || "",
                    end_date: prescriptionRes.data.expiry_date || "",
                    status: prescriptionRes.data.status || "active",
                });
            } catch (err) {
                console.error(err);
                if (err.response?.status === 404) {
                    toast.error('Prescription not found');
                    navigate('/prescriptions');
                } else {
                    toast.error('Failed to load prescription data');
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

    const updatePrescription = async () => {
        setSubmitting(true);
        try {
            const payload = {
                patient_id: parseInt(form.patient_id),
                doctor_id: parseInt(form.doctor_id),
                diagnosis_id: parseInt(form.diagnosis_id),
                medication: form.medication.trim(),
                dosage: form.dosage.trim(),
                frequency: form.frequency.trim(),
                duration: form.duration.trim(),
                instructions: form.instructions.trim(),
                side_effects: form.side_effects.trim(),
                issue_date: form.start_date,
                expiry_date: form.end_date,
                status: form.status,
            };
            
            let response;
            try {
                response = await axios.patch(`/prescriptions/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (patchErr) {
                if (patchErr.response?.status === 404) {
                    response = await axios.put(`/prescriptions/${id}`, payload, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    throw patchErr;
                }
            }
            toast.success('Prescription updated successfully');
            navigate('/prescriptions');
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
        if (!form.patient_id || !form.doctor_id || !form.diagnosis_id) {
            toast.error('Please select a patient, doctor, and diagnosis');
            return;
        }
        updatePrescription();
    };

    if (loading) return <div>Loading prescription data...</div>;

  return (
    <>
        <h1 className="text-2xl font-semibold mb-4">Edit Prescription</h1>
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
                type="number" 
                placeholder="Diagnosis ID" 
                name="diagnosis_id" 
                value={form.diagnosis_id} 
                onChange={handleChange}
            />

            <Input 
                type="text" 
                placeholder="Medication name" 
                name="medication" 
                value={form.medication} 
                onChange={handleChange}
            />

            <Input 
                type="text" 
                placeholder="Dosage (e.g., 500mg)" 
                name="dosage" 
                value={form.dosage} 
                onChange={handleChange}
            />

            <Input 
                type="text" 
                placeholder="Frequency (e.g., twice daily)" 
                name="frequency" 
                value={form.frequency} 
                onChange={handleChange}
            />

            <Input 
                type="text" 
                placeholder="Duration (e.g., 7 days)" 
                name="duration" 
                value={form.duration} 
                onChange={handleChange}
            />

            <textarea 
                placeholder="Instructions (e.g., take with food)" 
                name="instructions" 
                value={form.instructions} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="2"
            />

            <textarea 
                placeholder="Side effects/warnings" 
                name="side_effects" 
                value={form.side_effects} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="2"
            />

            <div>
                <label className="text-sm font-medium">Start date</label>
                <Input 
                    type="date" 
                    name="start_date" 
                    value={form.start_date} 
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="text-sm font-medium">End date</label>
                <Input 
                    type="date" 
                    name="end_date" 
                    value={form.end_date} 
                    onChange={handleChange}
                />
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
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2">
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="submit" 
                    disabled={submitting}
                >{submitting ? 'Updating...' : 'Update Prescription'}</Button>
                <Button 
                    className="mt-4" 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate('/prescriptions')}
                >Cancel</Button>
            </div>
        </form>
    </>
  );
}
