
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Users, Gift, TrendingUp } from 'lucide-react';

// 🎁 PerkPal Referrals Page - Author: Alexander Levi
// 👥 Complete referral management system

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  referral_code: string;
}

interface Referral {
  id: string;
  referred_id: string;
  generation: number;
  bonus_amount: number;
  paid_at: string;
  referred_user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Referrals = () => {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    generation1: 0,
    generation2: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchUserData();
    fetchReferrals();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (!userProfile) return;

      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_user:users!referrals_referred_id_fkey(first_name, last_name, email)
        `)
        .eq('referrer_id', userProfile.id)
        .order('paid_at', { ascending: false });

      if (error) throw error;
      
      const referralsData = data || [];
      setReferrals(referralsData);

      // 📊 Calculate stats
      const totalReferrals = referralsData.length;
      const totalEarnings = referralsData.reduce((sum, ref) => sum + ref.bonus_amount, 0);
      const generation1 = referralsData.filter(ref => ref.generation === 1).length;
      const generation2 = referralsData.filter(ref => ref.generation === 2).length;

      setStats({
        totalReferrals,
        totalEarnings,
        generation1,
        generation2
      });
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      toast({
        title: "📋 Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const shareReferralLink = () => {
    if (user?.referral_code) {
      const referralText = `🎉 Join PerkPal and earn ₦2,000 instant bonus! Use my referral code: ${user.referral_code}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join PerkPal - Earn Money Online!',
          text: referralText,
          url: window.location.origin
        });
      } else {
        navigator.clipboard.writeText(referralText);
        toast({
          title: "📋 Copied!",
          description: "Referral message copied to clipboard",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* 🧭 Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gradient">🎁 Referral Program</h1>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-primary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">👥 Total Referrals</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferrals}</div>
              <p className="text-xs opacity-90">People you've referred</p>
            </CardContent>
          </Card>

          <Card className="gradient-secondary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">💰 Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs opacity-90">From referrals</p>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">🥇 1st Generation</CardTitle>
              <Gift className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.generation1}</div>
              <p className="text-xs opacity-90">Direct referrals (₦1,000 each)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">🥈 2nd Generation</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.generation2}</div>
              <p className="text-xs opacity-90">Indirect referrals (₦250 each)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🎯 Referral Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-500" />
                🎁 Your Referral Code
              </CardTitle>
              <CardDescription>Share your code and earn ₦1,000 per referral!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border-2 border-dashed border-emerald-200">
                <div className="text-center">
                  <p className="text-sm text-emerald-600 mb-2">Your Unique Referral Code</p>
                  <div className="text-3xl font-bold text-emerald-800 tracking-wider">
                    {user?.referral_code}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </Button>
                <Button
                  onClick={shareReferralLink}
                  className="gradient-primary text-white"
                >
                  📤 Share Link
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">💡 How It Works</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Share your referral code with friends</li>
                  <li>• They sign up using your code</li>
                  <li>• You earn ₦1,000 instantly!</li>
                  <li>• Plus ₦250 from their referrals</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">🏆 Pro Tips</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Share on social media for maximum reach</li>
                  <li>• Tell friends about the ₦2,000 welcome bonus</li>
                  <li>• Explain how easy it is to earn money</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 👥 Referral History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                👥 Referral History
              </CardTitle>
              <CardDescription>Track your successful referrals</CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {referral.referred_user.first_name} {referral.referred_user.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {referral.referred_user.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(referral.paid_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600">
                            +₦{referral.bonus_amount}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            referral.generation === 1 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            Gen {referral.generation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Referrals Yet</h3>
                  <p className="text-gray-600 text-sm">
                    Start sharing your referral code to see your earnings here!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
