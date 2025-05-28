
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Mail, Phone, Zap } from 'lucide-react';

// 🎯 CodeWave Authentication Page - Author: Alexander Levi
// 🔐 Complete signup/login system with payment requirement

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    referralCode: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // 🔍 Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Redirect to payment first - user must pay ₦5,000 before account creation
      const paymentUrl = `https://paystack.co/pay/codewave-registration`;
      
      // Store form data temporarily in localStorage
      localStorage.setItem('codewave_signup_data', JSON.stringify(formData));
      
      toast({
        title: "💳 Payment Required",
        description: "You'll be redirected to pay ₦5,000 registration fee. After payment, your account will be created with ₦2,000 credited to your wallet.",
      });

      // Redirect to payment
      window.open(paymentUrl, '_blank');
      
    } catch (error: any) {
      toast({
        title: "❌ Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      toast({
        title: "🎉 Welcome back!",
        description: "Successfully logged in to CodeWave.",
      });

      if (data.user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "❌ Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isLogin ? '🔐 Welcome Back!' : '🚀 Join CodeWave'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin 
                ? 'Sign in to continue earning rewards' 
                : 'Pay ₦5,000 registration fee and get ₦2,000 credited to your wallet!'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">👤 First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">👤 Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">📱 Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 801 234 5678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralCode">🎁 Referral Code (Optional)</Label>
                    <Input
                      id="referralCode"
                      name="referralCode"
                      placeholder="Enter referral code"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      className="border-gray-300"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">💳 Registration Fee</h3>
                    <p className="text-sm text-blue-700">
                      • Pay ₦5,000 one-time registration fee<br/>
                      • Get ₦2,000 instantly credited to your wallet<br/>
                      • Start earning immediately after payment
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">📧 Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">🔒 Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Signing In...' : 'Redirecting to Payment...'}
                  </div>
                ) : (
                  isLogin ? '🚀 Sign In' : '💳 Pay ₦5,000 & Create Account'
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-semibold mt-1"
              >
                {isLogin ? '💳 Pay ₦5,000 & Join CodeWave' : '🔐 Sign In Instead'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
