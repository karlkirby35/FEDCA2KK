import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import WeatherForm from "@/components/CalenderForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { token } = useAuth();
    return (
        <>  
            <h1>Welcome to the Healthcare Management System</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LoginForm />
                <RegisterForm />
                <WeatherForm />
            </div>
        </>
    );
};