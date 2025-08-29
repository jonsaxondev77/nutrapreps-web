'use client';

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useRegisterMutation } from "@/lib/store/services/authApi";


export default function SignIn() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [register, { isLoading: isRegisteringUser, error: registerError, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      router.push("/onboarding/registration-success");
    }
    if (registerError) {
      if ('data' in registerError && registerError.data) {
        const errorData = registerError.data as { message?: string };
        setError(errorData.message || "An unexpected error occurred during registration.");
      } else {
        setError("An unexpected error occurred during registration.");
      }
    }
  }, [isSuccess, registerError, email, password, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.ok) {
      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || "/");
    } else {
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await register({ firstname, lastname, email, password });
  };

  return (
    <div className="flex-grow flex justify-center items-center px-4 py-12 bg-orange-50/50">
      <div className="w-full max-w-7xl mx-auto flex bg-white rounded-2xl shadow-xl overflow-hidden">

        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop')" }}
        ></div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            {isRegistering ? "Create your " : "Login to your "}
            <span className="text-orange-500">account</span>
          </h1>

          <p className="mt-4 text-gray-600">
            {isRegistering ? "Let's get you started!" : "Welcome back! Please enter your details."}
          </p>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="mt-8 space-y-6">
            {error && <p className="text-center text-red-500 text-sm">{error}</p>}

            {isRegistering && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="First name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        className="pl-12 w-full py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                    <div className="relative w-full">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                        className="pl-12 w-full py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                    </div>
                </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 w-full py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-12 w-full py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            
            {/* Add the "Forgot Password?" link here */}
            {!isRegistering && (
                <div className="text-right">
                    <Link href="/forgot-password">
                        <span className="text-sm font-semibold text-orange-500 hover:underline">Forgot Password?</span>
                    </Link>
                </div>
            )}


            <button
              type="submit"
              disabled={isRegisteringUser}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50"
            >
              <span>{isRegistering ? (isRegisteringUser ? 'Creating Account...' : 'Create Account') : 'Login'}</span>
              {!isRegisteringUser && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>

            <p className="text-center text-sm text-gray-600">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-1 font-semibold text-orange-500 hover:underline"
              >
                {isRegistering ? "Login" : "Create one"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}