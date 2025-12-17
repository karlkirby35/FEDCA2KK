import { useState, useEffect } from 'react';
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
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { token } = useAuth();

    // Fetch patients and doctors on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    axios.get('/patients', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/doctors', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setPatients(patientsRes.data);
                setDoctors(doctorsRes.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load patients/doctors');
            }
        };
        fetchData();
    }, [token]);

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

    const createPrescription = async () => {
        setSubmitting(true);
        try {
            // Convert IDs to numbers and prepare payload
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
                start_date: form.start_date,
                end_date: form.end_date,
                status: form.status,
            };
            console.log('Sending prescription payload:', payload);
            const response = await axios.post('/prescriptions', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Prescription created successfully');
            navigate('/prescriptions', { state: { type: 'success', message: 'Prescription created' } });
        } catch (err) {
            console.error('Full error:', err);
            console.error('Error response:', err.response?.data);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.error?.issues) {
                    const msgs = data.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
                    toast.error(msgs);
                } else if (data.message) {
                    toast.error(data.message);
                } else if (data.errors) {
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
        if (!form.patient_id || !form.doctor_id) {
            toast.error('Please select a patient and doctor');
            return;
        }
        if (!form.diagnosis_id) {
            toast.error('Diagnosis ID is required');
            return;
        }
        createPrescription();
    };

  return (
    <>
        <Button 
            variant="outline" 
            className="mb-4 w-fit"
            onClick={() => navigate('/prescriptions')}
        >← Back</Button>
        <h1 className="text-2xl font-semibold mb-4">Create Prescription</h1>
        <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
            
            {/* Patient Select */}
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

            {/* Doctor Select */}
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

            {/* Diagnosis ID */}
            <div>
                <label className="text-sm font-medium">Diagnosis ID</label>
                <Input 
                    type="number" 
                    placeholder="Enter valid diagnosis ID" 
                    name="diagnosis_id" 
                    value={form.diagnosis_id} 
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Medication */}
            <Input 
                type="text" 
                placeholder="Medication name" 
                name="medication" 
                value={form.medication} 
                onChange={handleChange}
                required
            />

            {/* Dosage */}
            <Input 
                type="text" 
                placeholder="Dosage (e.g., 500mg)" 
                name="dosage" 
                value={form.dosage} 
                onChange={handleChange}
                required
            />

            {/* Frequency */}
            <Input 
                type="text" 
                placeholder="Frequency (e.g., twice daily)" 
                name="frequency" 
                value={form.frequency} 
                onChange={handleChange}
                required
            />

            {/* Duration */}
            <Input 
                type="text" 
                placeholder="Duration (e.g., 7 days)" 
                name="duration" 
                value={form.duration} 
                onChange={handleChange}
                required
            />

            {/* Instructions */}
            <textarea 
                placeholder="Instructions (e.g., take with food)" 
                name="instructions" 
                value={form.instructions} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="2"
            />

            {/* Side Effects */}
            <textarea 
                placeholder="Side effects/warnings" 
                name="side_effects" 
                value={form.side_effects} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="2"
            />

            {/* Issue Date */}
            <div>
                <label className="text-sm font-medium">Start date</label>
                <Input 
                    type="date" 
                    name="start_date" 
                    value={form.start_date} 
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Expiry Date */}
            <div>
                <label className="text-sm font-medium">End date</label>
                <Input 
                    type="date" 
                    name="end_date" 
                    value={form.end_date} 
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Status */}
            <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                className="mt-6" 
                variant="outline" 
                type="submit" 
                disabled={submitting}
            >{submitting ? 'Creating...' : 'Create Prescription'}</Button>
        </form>
    </>
  );
}
