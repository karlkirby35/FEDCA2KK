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
        medication_name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        side_effects: "",
        issue_date: "",
        expiry_date: "",
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
            const response = await axios.post('/prescriptions', form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Prescription created successfully');
            navigate('/prescriptions', { state: { type: 'success', message: 'Prescription created' } });
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
        if (!form.patient_id || !form.doctor_id) {
            toast.error('Please select a patient and doctor');
            return;
        }
        createPrescription();
    };

  return (
    <>
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

            {/* Medication */}
            <Input 
                type="text" 
                placeholder="Medication name" 
                name="medication_name" 
                value={form.medication_name} 
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
                <label className="text-sm font-medium">Issue date</label>
                <Input 
                    type="date" 
                    name="issue_date" 
                    value={form.issue_date} 
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Expiry Date */}
            <div>
                <label className="text-sm font-medium">Expiry date</label>
                <Input 
                    type="date" 
                    name="expiry_date" 
                    value={form.expiry_date} 
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
