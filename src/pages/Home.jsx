import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { token } = useAuth();
    return (
        <>  
            <h1>Welcome to the Healthcare Management System</h1>
            <LoginForm />
            <RegisterForm />
            
        </>
    );
};