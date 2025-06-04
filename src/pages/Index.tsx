import React from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { useNavigate } from "react-router-dom";
import TaskBoard from '@/components/TaskBoard';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <TaskBoard />;
};

export default Index;
