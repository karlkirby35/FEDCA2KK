import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function DeleteBtn({ resource, id, onDeleteCallback }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    const onDelete = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`/${resource}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            toast.success(`${resource} deleted successfully`);
            if (onDeleteCallback) {
                onDeleteCallback(id);
            }
            setIsDeleting(false);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || `Failed to delete ${resource}`;
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    !isDeleting ? (
        <Button 
            className="cursor-pointer text-red-500 hover:border-red-700 hover:text-red-700"
            variant="outline"
            size="icon"
            onClick={() => setIsDeleting(true)}
            disabled={isLoading}
        ><Trash /></Button>
    ) : (
        <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Delete?</span>
            <Button 
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="cursor-pointer text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
                disabled={isLoading}
            >{isLoading ? 'Deleting...' : 'Yes'}</Button>
            <Button 
                onClick={() => setIsDeleting(false)}
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-500 border-slate-500 hover:text-slate-700 hover:border-slate-700"
                disabled={isLoading}
            >No</Button>
        </div>
    )
  );
}