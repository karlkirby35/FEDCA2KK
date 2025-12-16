import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { token } = useAuth();
    return (
        <>  
            {!token && <LoginForm />}
             {!token && <RegisterForm />}
            
        </>
    );
};