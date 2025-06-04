
import React, { useState, useEffect } from 'react';
import { Camera, Mail, User as UserIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: '',
    joinDate: new Date().toISOString().split('T')[0],
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('taskboard_profile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setFormData(parsedProfile);
    } else {
      // Generate a random avatar
      const randomId = Math.floor(Math.random() * 1000);
      const defaultProfile = {
        ...profile,
        avatarUrl: `https://picsum.photos/id/${randomId}/200/200`,
      };
      setProfile(defaultProfile);
      setFormData(defaultProfile);
      localStorage.setItem('taskboard_profile', JSON.stringify(defaultProfile));
    }
  }, []);

  const generateRandomAvatar = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1000);
      const newAvatarUrl = `https://picsum.photos/id/${randomId}/200/200`;
      
      setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
      toast.success('New avatar generated!');
    } catch (error) {
      toast.error('Failed to generate new avatar');
    }
  };

  const handleSave = () => {
    setProfile(formData);
    localStorage.setItem('taskboard_profile', JSON.stringify(formData));
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">User Profile</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>

        <Card className="bg-[#111111] border-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24 border-2 border-[#1a1a1a]">
                <AvatarImage src={formData.avatarUrl} alt="Profile picture" />
                <AvatarFallback className="bg-[#1a1a1a] text-white text-xl">
                  {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Button
                  onClick={generateRandomAvatar}
                  variant="outline"
                  className="border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Generate New Avatar
                </Button>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-white">
                  <UserIcon className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-white">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate" className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white disabled:opacity-60"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/80 text-white button-glow"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white button-glow"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="bg-[#111111] border-[#1a1a1a] mt-6">
          <CardHeader>
            <CardTitle className="text-white">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {JSON.parse(localStorage.getItem('taskboard_tasks') || '[]').length}
                </div>
                <div className="text-sm text-gray-400">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {JSON.parse(localStorage.getItem('taskboard_tasks') || '[]').filter((t: any) => t.status === 'done').length}
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {JSON.parse(localStorage.getItem('taskboard_tasks') || '[]').filter((t: any) => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
