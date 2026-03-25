import { useState } from "react";
import { Mail } from "lucide-react";
import LoginForm from "./partials/LoginForm";
import RegistrationForm from "./partials/RegistrationForm";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
        <div className="w-full md:w-6/12 bg-sky-500 p-8 text-white flex flex-col justify-center">
            <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
                <div className="bg-white/20 p-4 rounded-full">
                <Mail className="size-10" />
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Chatty</h1>
            <p>Connect with friends and family, anytime and anywhere</p>
            </div>

            <div>
            <div className="mt-10 text-center">
                <p className="text-sm opacity-80">Join thousands of users today!</p>
            </div>
            </div>
        </div>

        <div className="flex w-full md:w-6/12 items-center justify-center bg-slate-50 p-6 md:p-10">
            {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
            <RegistrationForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </div>
        </div>
    );
};

export default Auth;
