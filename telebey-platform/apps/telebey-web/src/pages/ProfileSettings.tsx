import { Link } from "react-router-dom";
import { ArrowLeft, Shield, User, Camera, Key, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef } from "react";

export function ProfileSettings() {
  const { user, updateUser } = useAuth(); 
  
  // Local state for toggles and UI
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.walletImage || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(user?.bannerImage || null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isPublic, setIsPublic] = useState(user?.isPublic !== false); // Default to true
  
  // Profile Info State (Editable if passkey installed)
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        // Save to AuthContext
        if (user) {
          const updatedUser = { ...user, walletImage: base64String };
          localStorage.setItem('telebey_wallet_user', JSON.stringify(updatedUser));
          // loginWithWallet is a bit specific, so we just manually update localStorage and would usually notify context
          // For now, we'll assume a page refresh or similar would pick it up, or just mock it.
          console.log("Avatar updated locally");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBannerPreview(base64String);
        if (user) {
          const updatedUser = { ...user, bannerImage: base64String };
          localStorage.setItem('telebey_wallet_user', JSON.stringify(updatedUser));
          console.log("Banner updated locally");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    if (user) {
      await updateUser({ 
        firstName, 
        lastName, 
        username, 
        bio, 
        isPublic,
        walletImage: avatarPreview || user.walletImage,
        bannerImage: bannerPreview || user.bannerImage
      });
      alert("Profile updated successfully!");
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length > 5) {
      setPasswordStatus('success');
      setTimeout(() => setShowPasswordChange(false), 2000);
    } else {
      setPasswordStatus('error');
    }
  };

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const installPasskey = () => {
    // Mock WebAuthn behavior
    alert("Triggering WebAuthn Passkey Registration...");
    setTimeout(() => setHasPasskey(true), 1500);
  };
  return (
    <main className="flex-1 flex flex-col py-8 lg:py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Profile Settings</h1>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Personal Information</h2>
            </div>
            
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-border object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-border bg-muted flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="text-sm text-muted-foreground">
                <p className="font-bold text-foreground">Profile Photo</p>
                <p>Click to upload picture</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4 text-sm">
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-amber-800 dark:text-amber-400">
                <p className="font-bold mb-1">Notice: Personal Information Protocol</p>
                <div className="text-xs space-y-2">
                  <p>
                    {hasPasskey 
                      ? "Key Pass detected. You can now modify your personal details." 
                      : "Your personal information is locked for security. Install a 'Key Pass' (Identity Check) below to unlock editing capabilities."}
                  </p>
                  {isPublic ? (
                    <p className="text-green-600 font-bold flex items-center gap-1 uppercase tracking-tight">
                      <Shield className="w-3 h-3" /> Public Mode: Everyone can see your /{user.username || 'username'} URL
                    </p>
                  ) : (
                    <p className="text-red-500 font-bold flex items-center gap-1 uppercase tracking-tight">
                      <Shield className="w-3 h-3" /> Private Mode: Nobody can see your profile. Typing in community is disabled.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1.5 text-muted-foreground">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!hasPasskey} 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${!hasPasskey ? 'border-border bg-muted text-muted-foreground cursor-not-allowed' : 'border-primary/50 bg-background shadow-sm'}`} 
                />
              </div>
              <div className="hidden md:block"></div>
              <div>
                <label className="block font-bold mb-1.5 text-muted-foreground">First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!hasPasskey} 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${!hasPasskey ? 'border-border bg-muted text-muted-foreground cursor-not-allowed' : 'border-primary/50 bg-background shadow-sm'}`} 
                />
              </div>
              <div>
                <label className="block font-bold mb-1.5 text-muted-foreground">Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!hasPasskey} 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${!hasPasskey ? 'border-border bg-muted text-muted-foreground cursor-not-allowed' : 'border-primary/50 bg-background shadow-sm'}`} 
                />
              </div>
               <div className="md:col-span-2">
                <label className="block font-bold mb-1.5 text-muted-foreground">Email Address</label>
                <div className="relative">
                  <input type="email" value={user.email} disabled className="w-full px-3 py-2 border border-border bg-muted text-muted-foreground cursor-not-allowed rounded-md focus:outline-none" />
                  <Mail className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-red-500 font-medium">Email Address cannot be changed for security reasons.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold mb-1.5 text-muted-foreground">Bio / About Me</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!hasPasskey}
                  placeholder="Tell the community about yourself..."
                  className={`w-full px-3 py-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${!hasPasskey ? 'border-border bg-muted text-muted-foreground cursor-not-allowed' : 'border-primary/50 bg-background shadow-sm'}`} 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold mb-1.5 text-muted-foreground">Profile Banner</label>
                <div 
                  onClick={() => hasPasskey && bannerInputRef.current?.click()}
                  className={`relative h-32 w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${!hasPasskey ? 'border-muted bg-muted/50 cursor-not-allowed' : 'border-border hover:border-primary/50 bg-muted/20 cursor-pointer'}`}
                >
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center flex flex-col items-center gap-2">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Upload Profile Banner</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={bannerInputRef} 
                    onChange={handleBannerChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>

            {hasPasskey && (
              <div className="pt-4 flex justify-end animate-in fade-in slide-in-from-right-2">
                <Button onClick={handleProfileSave} className="font-bold px-8 bg-primary text-foreground hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Security & Authentication</h2>
          </div>
          <div className="p-6 space-y-8 text-sm">
            {/* Password Change */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-base mb-1">Change Password</div>
                  <div className="text-muted-foreground text-xs md:text-sm">Update your password to keep your account secure.</div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="font-bold flex-shrink-0"
                >
                  {showPasswordChange ? 'Cancel' : 'Update Password'}
                </Button>
              </div>
              
              {showPasswordChange && (
                <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block font-bold mb-1.5 text-muted-foreground">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full max-w-sm px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1.5 text-muted-foreground">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-sm px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <Button onClick={handleChangePassword} className="font-bold">Save Password</Button>
                    {passwordStatus === 'success' && <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-4 h-4"/> Saved</span>}
                    {passwordStatus === 'error' && <span className="text-red-500 flex items-center gap-1 font-medium"><AlertCircle className="w-4 h-4"/> Password too short</span>}
                  </div>
                </div>
              )}
            </div>
            
            <hr className="border-border/50" />
            
            {/* 2FA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-base mb-1">Two-Factor Authentication (2FA)</div>
                <div className="text-muted-foreground text-xs md:text-sm">Protect your Telebey account with an extra layer of security.</div>
              </div>
              <Button 
                variant={is2FAEnabled ? "outline" : "default"}
                onClick={toggle2FA}
                className={`font-bold flex-shrink-0 ${!is2FAEnabled && 'bg-foreground text-background'}`}
              >
                {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </div>

            <hr className="border-border/50" />

            {/* Passkeys */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-base mb-1 flex items-center gap-2">
                  Passkeys <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                </div>
                <div className="text-muted-foreground text-xs md:text-sm">Install a Key Pass on this device for passwordless login.</div>
              </div>
              <Button 
                variant="outline" 
                onClick={installPasskey}
                disabled={hasPasskey}
                className="font-bold flex-shrink-0 flex items-center gap-2"
              >
                {hasPasskey ? (
                  <><CheckCircle2 className="w-4 h-4 text-green-500" /> Key Installed</>
                ) : (
                  <><Key className="w-4 h-4" /> Install Key Pass</>
                )}
              </Button>
            </div>

          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6 mb-20 animate-in slide-in-from-bottom-2 duration-300">
           <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Privacy & Visibility</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/50">
              <div className="flex-1">
                <div className="font-bold text-base mb-1">Public Profile Mode</div>
                <div className="text-muted-foreground text-xs md:text-sm max-w-md">
                   When enabled, anyone can find you and view your profil via <span className="text-primary font-bold underline">/{user.username || 'username'}</span>. 
                   When disabled, your profile is hidden and you cannot participate in community chats.
                </div>
              </div>
              <div 
                onClick={() => setIsPublic(!isPublic)}
                className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${isPublic ? 'bg-primary shadow-inner shadow-black/10' : 'bg-muted-foreground/30'}`}
              >
                <div className={`absolute top-1 transition-all duration-300 w-6 h-6 rounded-full bg-white shadow-md ${isPublic ? 'left-7' : 'left-1'}`} />
              </div>
            </div>

            <div className="pt-8 flex justify-between items-center bg-muted/10 -mx-6 -mb-6 p-6">
               <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium italic">
                 <CheckCircle2 className="w-3 h-3 text-primary" /> Changes sync with the Telebey Global Identity Network.
               </div>
               <Button onClick={handleProfileSave} className="font-black px-10 h-12 rounded-xl shadow-xl shadow-primary/20 bg-primary text-foreground hover:bg-primary/90 hover:scale-105 transition-all">
                  Apply Global Privacy Settings
               </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
