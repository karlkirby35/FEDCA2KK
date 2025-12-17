import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function WeatherForm() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_CALENDARIFIC_API_KEY || '';

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      if (!apiKey) {
        toast.error('API key not configured');
        setLoading(false);
        return;
      }

      const year = new Date().getFullYear();
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=US&year=${year}`
      );

      const data = await response.json();
      if (data.response?.holidays) {
        setHolidays(data.response.holidays.slice(0, 5));
        toast.success(`Found ${data.response.holidays.length} holidays`);
      }
    } catch (err) {
      toast.error('Failed to fetch holidays');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Holidays</h2>
      
      <Button onClick={fetchHolidays} disabled={loading} className="w-full mb-4">
        {loading ? 'Loading...' : 'Get Holidays'}
      </Button>

      {holidays.length > 0 && (
        <div className="space-y-2">
          {holidays.map((holiday, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded border">
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm">{holiday.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {new Date(holiday.date.iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
