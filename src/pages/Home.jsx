import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { token } = useAuth();
    return (
        <>
            <h1 class ="title">Total patient count:</h1>
            
            {!token && <LoginForm />}
             {!token && <RegisterForm />}
            
        </>
    );
};