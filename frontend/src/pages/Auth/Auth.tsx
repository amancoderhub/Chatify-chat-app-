import { useState } from "react";
import { Mail } from "lucide-react";
import LoginForm from "./partials/LoginForm";
import RegistrationForm from "./partials/RegistrationForm";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex min-h-dvh w-full flex-col bg-transparent lg:flex-row">
        <div className="flex w-full flex-col justify-center bg-linear-to-br from-sky-600 via-cyan-500 to-sky-700 px-6 py-12 text-white sm:px-10 lg:w-[45%] lg:px-12">
            <div className="mx-auto w-full max-w-lg text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
                <div className="rounded-3xl bg-white/15 p-4 shadow-lg ring-1 ring-white/20 backdrop-blur">
                <Mail className="size-10 sm:size-11" />
                </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome to Chatty</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-sky-50/90 sm:text-base">
                Connect with friends and family, anytime and anywhere.
            </p>
            <div className="mt-8 grid gap-3 text-left text-sm text-white/90 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
                    Realtime presence updates
                </div>
                <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
                    Fast private conversations
                </div>
            </div>
            <div className="mt-8 text-center lg:text-left">
                <p className="text-sm text-white/75">Join thousands of users today.</p>
            </div>
            </div>
        </div>

        <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 lg:min-h-dvh lg:w-[55%] lg:px-10">
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
