import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Hotel, User, Mail, Phone, Lock, Sparkles, Plane, Stars } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, loading, role } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"tourist" | "hotel_owner">("tourist");
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  useEffect(() => {
    if (user && !loading) {
      if (role === 'hotel_owner') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, loading, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? "Email or password is incorrect" 
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back! 🎉",
        description: "You've successfully logged in",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse({
        fullName: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(
      signupEmail,
      signupPassword,
      signupName,
      signupPhone,
      userType
    );
    
    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Account Exists",
          description: "This email is already registered. Please login instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Welcome to TourGo! 🎉",
        description: "Your account has been created successfully",
      });
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-hero">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <Plane className="w-12 h-12 text-primary/30 rotate-45" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <MapPin className="w-10 h-10 text-teal/30" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce-soft">
          <Stars className="w-8 h-8 text-accent/40" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <Sparkles className="w-10 h-10 text-primary/30" />
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      {/* TourGo Cursive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 
          className="text-[20vw] font-display font-bold text-gradient-primary opacity-10 whitespace-nowrap"
          style={{ fontFamily: "'Nunito', cursive", letterSpacing: '-0.02em' }}
        >
          TourGo
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-card/95 border-primary/20 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-2 shadow-lg animate-bounce-soft">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-display text-gradient-primary">
              TourGo
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Explore. Earn. Experience.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gap-2 bg-gradient-to-r from-primary to-coral-light hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setUserType("tourist")}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        userType === "tourist"
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <User className={`w-6 h-6 ${userType === "tourist" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-semibold ${userType === "tourist" ? "text-primary" : "text-muted-foreground"}`}>
                        Tourist
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType("hotel_owner")}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        userType === "hotel_owner"
                          ? "border-secondary bg-secondary/10 shadow-md"
                          : "border-border hover:border-secondary/50"
                      }`}
                    >
                      <Hotel className={`w-6 h-6 ${userType === "hotel_owner" ? "text-secondary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-semibold ${userType === "hotel_owner" ? "text-secondary" : "text-muted-foreground"}`}>
                        Hotel Owner
                      </span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="border-border focus:border-primary"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className={`w-full gap-2 transition-opacity hover:opacity-90 ${
                      userType === "tourist" 
                        ? "bg-gradient-to-r from-primary to-coral-light" 
                        : "bg-gradient-to-r from-secondary to-teal-light"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
