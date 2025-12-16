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
        appointment_date: "",
        appointment_time: "",
        reason: "",
        notes: "",
        status: "scheduled",
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

    const createAppointment = async () => {
  setSubmitting(true);

  const payload = {
    ...form,
    patient_id: Number(form.patient_id),
    doctor_id: Number(form.doctor_id),
  };

  try {
    await axios.post('/appointments', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Appointment created successfully');
    navigate('/appointments');
  } catch (err) {
    console.error(err.response?.data);
    toast.error('Validation failed');
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
        createAppointment();
    };

  return (
    <>
        <Button 
            variant="outline" 
            className="mb-4 w-fit"
            onClick={() => navigate('/appointments')}
        >← Back</Button>
        <h1 className="text-2xl font-semibold mb-4">Schedule Appointment</h1>
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
                                {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date */}
            <div>
                <label className="text-sm font-medium">Appointment date</label>
                <Input 
                    type="date" 
                    name="appointment_date" 
                    value={form.appointment_date} 
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Time */}
            <div>
                <label className="text-sm font-medium">Appointment time</label>
                <Input 
                    type="time" 
                    name="appointment_time" 
                    value={form.appointment_time} 
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Reason */}
            <Input 
                type="text" 
                placeholder="Reason for appointment" 
                name="reason" 
                value={form.reason} 
                onChange={handleChange}
                required
            />

            {/* Notes */}
            <textarea 
                placeholder="Additional notes" 
                name="notes" 
                value={form.notes} 
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
            />

            {/* Status */}
            <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                className="mt-6" 
                variant="outline" 
                type="submit" 
                disabled={submitting}
            >{submitting ? 'Creating...' : 'Schedule Appointment'}</Button>
        </form>
    </>
  );
}
