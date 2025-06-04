import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AuthFormData {
  email: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const form = useForm<AuthFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Sign up successful!", description: "You can now sign in." });
        setMode("signin");
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({ title: "Sign in successful!" });
      }
    } catch (error: unknown) {
      let message = "Unknown error";
      if (typeof error === "object" && error && "message" in error) {
        message = String((error as { message?: string }).message);
      }
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-card rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete={mode === "signup" ? "new-password" : "current-password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (mode === "signin" ? "Signing In..." : "Signing Up...") : (mode === "signin" ? "Sign In" : "Sign Up")}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        {mode === "signin" ? (
          <>
            Don't have an account?{' '}
            <button className="text-primary underline" onClick={() => setMode("signup")}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button className="text-primary underline" onClick={() => setMode("signin")}>Sign In</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm; 