"use client"

import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa6';
import Link from 'next/link';
import FieldContainer from '../components/FieldContainer';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { authLoginSchema, authLoginSchemaType } from '@/server/schemas/auth.schema';
import { useAuthLogin } from '@/hooks/authHook';
import { useEffect, useState } from 'react';
import ErrorModal from '../components/ErrorModal';

const LoginPage = () => {
    const [showError, setShowError] = useState(false)
    const { handleSubmit, formState: { errors }, register } = useForm({
        resolver: zodResolver(authLoginSchema)
    })

    const { isPending: isLoading, mutate, isError, error } = useAuthLogin()

    const onSubmitForm = async (data: authLoginSchemaType) => {
        console.log("Logging in with:", data);
        mutate(data)

    };

    useEffect(() => {
        if (isError) {
            setShowError(true)
            console.error(error);
        }

    }, [isError])

    return (
        <>
            <div className="min-h-screen bg-[#131314] flex items-center justify-center p-4 font-sans text-gray-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full space-y-8 bg-[#1e1f20] p-10 rounded-3xl shadow-2xl border border-gray-800"
                >
                    {/* Header */}
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 mb-4"
                        >
                            <span className="text-3xl font-bold text-white tracking-tight">C</span>
                            <span className="text-sm bg-blue-600 px-2 py-0.5 rounded text-white font-bold">AI</span>
                        </motion.div>
                        <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
                        <p className="text-gray-400 mt-2 text-sm">Please enter your details to sign in</p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmitForm)}>
                        <FieldContainer
                            errrMsg={errors.email ? errors.email.message : null}
                            icon={<FaEnvelope />}
                            title="Email Address"
                        >
                            <input
                                type="email"
                                {...register("email")}
                                className="block w-full pl-11 pr-4 py-3 bg-[#131314] border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder-gray-600"
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className="text-xs ml-3 text-red-500">{errors.email.message}</p>}
                        </FieldContainer>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-medium text-gray-400">Password</label>
                                <Link href="#" className="text-xs text-blue-500 hover:underline">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    {...register("password")}
                                    className="block w-full pl-11 pr-4 py-3 bg-[#131314] border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-xs ml-3 text-red-500">{errors.password.message}</p>}
                        </div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-500 font-medium hover:underline">Sign up for free</Link>
                    </p>
                </motion.div>
            </div>
            <ErrorModal isOpen={showError} message={error?.message || ""} onClose={() => setShowError(false)} title='Error' />
        </>
    );
};

export default LoginPage;