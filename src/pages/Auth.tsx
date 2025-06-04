import React from "react";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth-context";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const Auth = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/taskboard", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login Successful!", description: "Welcome back!" });
      navigate("/taskboard", { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#0f172a] animate-fade">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/10 backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
            {/* Avatar icon */}
            <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M16 16c0-2.21-3.58-4-8-4s-8 1.79-8 4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email ID"
              className="pl-10 bg-transparent border border-white/20 text-white placeholder:text-white/50"
            />
            {errors.email && <span className="text-destructive text-xs">Email is required</span>}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="pl-10 bg-transparent border border-white/20 text-white placeholder:text-white/50"
            />
            {errors.password && <span className="text-destructive text-xs">Password is required</span>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <input type="checkbox" {...register("rememberMe")} id="rememberMe" className="accent-primary" />
              <label htmlFor="rememberMe" className="text-white/80">Remember me</label>
            </div>
            <button type="button" className="text-primary underline">Forgot Password?</button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-blue-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            LOGIN
          </Button>
        </form>
        <div className="mt-6 text-center text-base">
          <span className="text-white/70">Don't have an account? </span>
          <Link to="/signup" className="text-primary underline font-semibold hover:text-primary/80 transition-colors">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth; 