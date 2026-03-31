"use client"

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';
import FieldContainer from '../components/FieldContainer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authCreateAccountSchema, authCreateAccountSchemaType } from '@/server/schemas/auth.schema';
import { useAuthSignUp } from '@/hooks/authHook';
import ErrorModal from '../components/ErrorModal';

const SignUpPage = () => {

    const [showError, setShowError] = useState(false)
    const { handleSubmit, formState: { errors }, register } = useForm({
        resolver: zodResolver(authCreateAccountSchema)
    })

    const { isPending: isLoading, mutate, isError, error } = useAuthSignUp()

    const onSubmitForm = (data: authCreateAccountSchemaType) => {
        // Handle Sign Up logic here
        mutate(data)
        console.log("Creating account with:", data);
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-md w-full space-y-6 bg-[#1e1f20] p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-800"
                >
                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className="text-3xl font-bold text-white tracking-tight">C</span>
                            <span className="text-sm bg-blue-600 px-2 py-0.5 rounded text-white font-bold">AI</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-white">Create Account</h2>
                        <p className="text-gray-400 mt-2 text-sm">Join us and start chatting with AI</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
                        {/* Full Name */}
                        <FieldContainer
                            errrMsg={errors.name ? errors.name.message : null}
                            icon={<FaUser className="text-sm" />}
                            title="Full Name"
                        >
                            <input
                                type="text"
                                {...register("name")}
                                className="block w-full pl-11 pr-4 py-3 bg-[#131314] border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder-gray-600"
                                placeholder="Rayhan Febriyan"
                            />
                        </FieldContainer>

                        {/* Email */}
                        <FieldContainer
                            icon={<FaEnvelope className="text-sm" />}
                            title="Email Address"
                            errrMsg={errors.email ? errors.email.message : null}
                        >
                            <input
                                type="email"
                                {...register("email")}
                                className="block w-full pl-11 pr-4 py-3 bg-[#131314] border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder-gray-600"
                                placeholder="name@example.com"
                            />
                        </FieldContainer>

                        {/* Password */}
                        <FieldContainer
                            icon={<FaLock className="text-sm" />}
                            title="Password"
                            errrMsg={errors.password ? errors.password.message : null}
                        >
                            <input
                                type="password"
                                {...register("password")}
                                className="block w-full pl-11 pr-4 py-3 bg-[#131314] border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </FieldContainer>

                        {/* Confirm Password */}
                        <FieldContainer
                            icon={<FaLock className="text-sm" />}
                            title="Confirm Password"
                            errrMsg={errors.confirmPassword ? errors.confirmPassword.message : null}
                        >
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className="block w-full pl-11 pr-4 py-3 bg-[#131314] border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm placeholder-gray-600"
                                placeholder="••••••••"
                            />
                        </FieldContainer>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            Create Account
                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-500 font-medium hover:underline">Sign In</Link>
                    </p>
                </motion.div>
            </div>
            <ErrorModal isOpen={showError} message={error?.message || ""} onClose={() => setShowError(false)} title='Error' />
        </>
    );
};

export default SignUpPage;