import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Upload, Loader2 } from "lucide-react";

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${api.getToken()}`,
          },
        });
        
        const data = await response.json();
        
        if (response.ok && data.data) {
          const userData = data.data;
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            bio: userData.bio || '',
          });
          setProfileImage(userData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`);
          setCoverImage(userData.coverImage || '');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleProfileImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading profile picture for user:', user!.id);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${user!.id}/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      const newProfilePicture = data.data.profilePicture;
      console.log('Profile picture uploaded successfully:', newProfilePicture);
      
      // Update local state immediately
      setProfileImage(newProfilePicture);
      
      // Fetch fresh user data from backend to ensure consistency
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${user!.id}`, {
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const freshProfilePicture = profileData.data.profilePicture;
        
        console.log('Fresh profile data from backend:', freshProfilePicture);
        
        // Update auth context with fresh data
        const updatedUser = {
          ...user!,
          avatar: freshProfilePicture,
        };
        
        // Update localStorage first
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Then update context
        updateUserProfile({ avatar: freshProfilePicture });
        
        // Update local display
        setProfileImage(freshProfilePicture);
        
        toast.success('Profile picture updated successfully!');
        
        // Reload page to ensure all components update
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Fallback if profile fetch fails
        const updatedUser = {
          ...user!,
          avatar: newProfilePicture,
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        updateUserProfile({ avatar: newProfilePicture });
        
        toast.success('Profile picture updated!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload profile picture');
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleCoverImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading cover image for user:', user!.id);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${user!.id}/cover-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      const newCoverImage = data.data.coverImage;
      console.log('Cover image uploaded successfully:', newCoverImage);
      
      // Update local state immediately
      setCoverImage(newCoverImage);
      
      // Fetch fresh user data from backend
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${user!.id}`, {
        headers: {
          'Authorization': `Bearer ${api.getToken()}`,
        },
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const freshCoverImage = profileData.data.coverImage;
        
        console.log('Fresh cover image from backend:', freshCoverImage);
        
        // Update auth context with fresh data
        const updatedUser = {
          ...user!,
          coverImage: freshCoverImage,
        };
        
        // Update localStorage first
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        
        // Then update context
        updateUserProfile({ coverImage: freshCoverImage });
        
        // Update local display
        setCoverImage(freshCoverImage);
        
        toast.success('Cover image updated successfully!');
        
        // Reload page to ensure all components update
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Fallback
        const updatedUser = {
          ...user!,
          coverImage: newCoverImage,
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        updateUserProfile({ coverImage: newCoverImage });
        
        toast.success('Cover image updated!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${user!.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Settings</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage your account, profile, and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Pictures Section */}
        <div className="rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Profile Pictures</h2>
          
          <div className="mt-6 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Cover Image</label>
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded-lg border border-border mb-3"
                />
              )}
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingCover ? (
                    <>
                      <Loader2 className="w-6 h-6 mb-2 text-muted-foreground animate-spin" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  disabled={uploadingCover}
                />
              </label>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Profile Picture</label>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={profileImage}
                  alt={user?.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingProfile ? (
                    <>
                      <Loader2 className="w-6 h-6 mb-2 text-muted-foreground animate-spin" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload profile picture</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageSelect}
                  disabled={uploadingProfile}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Account Information</h2>
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                disabled
                className="mt-2 w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
                maxLength={500}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20" 
              />
              <p className="mt-1 text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground">Role</label>
              <input 
                type="text" 
                value={user?.role} 
                disabled 
                className="mt-2 w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm font-medium text-muted-foreground capitalize cursor-not-allowed" 
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading} className="mt-6 w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Notification Preferences</h2>
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-secondary/30 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-2 border-border accent-primary cursor-pointer" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Email notifications for new orders</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Get notified when someone buys from you</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-secondary/30 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-2 border-border accent-primary cursor-pointer" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Email notifications for messages</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Get notified when you receive messages</p>
              </div>
            </label>
            <label className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-secondary/30 cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked 
                className="rounded border-2 border-border accent-primary cursor-pointer" 
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Weekly sales report</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Receive a summary of your sales every week</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
