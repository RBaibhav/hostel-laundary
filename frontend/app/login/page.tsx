"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Waves, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await login(data.email, data.password);
      toast.success("Welcome back!", {
        description: "Logged in successfully to LaundryMate."
      });
    } catch (err: unknown) {
      const error = err as ApiError;
      const msg = error.message || "Invalid credentials. Please try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold text-slate-900 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Waves className="h-5 w-5" />
            </div>
            <span className="text-lg tracking-tight">
              Laundry<span className="text-indigo-600">Mate</span>
            </span>
          </Link>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your student credentials to view and claim washing machines
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm">
          {serverError && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hostel Email
              </label>
              <input
                type="email"
                placeholder="student@hostel.edu"
                autoComplete="email"
                {...register("email")}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.email
                    ? "border-rose-300 bg-rose-50/20 focus:border-rose-500"
                    : "border-slate-200 bg-white focus:border-indigo-600"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-xs text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.password
                      ? "border-rose-300 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-200 bg-white focus:border-indigo-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              New resident?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
