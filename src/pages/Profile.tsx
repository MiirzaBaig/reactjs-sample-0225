import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const randomId = Math.floor(Math.random() * 1000);
      fetch(`https://picsum.photos/id/${randomId}/info`)
        .then(res => res.json())
        .then(data => setAvatarUrl(data.download_url))
        .catch(() => setAvatarUrl(null));
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: "Logged out", description: "You have been signed out successfully." });
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-[#18181b] border border-white/10 rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col items-center w-full max-w-sm mx-4 card-hover profile-glow">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-white/20 mb-4"
          />
        )}
        <div className="text-base sm:text-lg font-semibold text-white mb-2 break-all text-center">{user.email}</div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 flex items-center gap-2 text-white hover:bg-primary/80 hover:text-white"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
