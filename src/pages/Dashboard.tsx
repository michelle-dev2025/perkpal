
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Gift, Users, TrendingUp, LogOut, ExternalLink, Copy } from 'lucide-react';

// 🎯 PerkPal Dashboard - Author: Alexander Levi
// 💰 Main user dashboard with wallet, tasks, and referrals

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  wallet_balance: number;
  total_earned: number;
  referral_code: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  reward_amount: number;
  url: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchUserData();
    fetchTasks();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskClick = async (task: Task) => {
    if (!user) return;

    try {
      // 🎯 Check if task already completed
      const { data: existingTask } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', task.id)
        .single();

      if (existingTask) {
        toast({
          title: "⚠️ Task Already Completed",
          description: "You've already completed this task!",
          variant: "destructive"
        });
        return;
      }

      // 🚀 Open task URL
      window.open(task.url, '_blank');

      // 💰 Record task completion
      const { error: taskError } = await supabase
        .from('user_tasks')
        .insert({
          user_id: user.id,
          task_id: task.id,
          reward_earned: task.reward_amount
        });

      if (taskError) throw taskError;

      // 💸 Update wallet balance
      const { error: walletError } = await supabase
        .from('users')
        .update({
          wallet_balance: user.wallet_balance + task.reward_amount,
          total_earned: user.total_earned + task.reward_amount
        })
        .eq('id', user.id);

      if (walletError) throw walletError;

      // 📝 Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'task_reward',
          amount: task.reward_amount,
          description: `Completed task: ${task.title}`
        });

      toast({
        title: "🎉 Task Completed!",
        description: `You earned ₦${task.reward_amount}! Check your wallet.`,
      });

      // 🔄 Refresh user data
      fetchUserData();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
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

  const handleWithdraw = () => {
    // 💳 Open Paystack payment link
    window.open('https://paystack.shop/pay/cjq84w--6d', '_blank');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
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
            <h1 className="text-2xl font-bold text-gradient">🎯 PerkPal Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 👋 Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.first_name}! 👋
          </h2>
          <p className="text-gray-600">Ready to earn more rewards today?</p>
        </div>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-primary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">💰 Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{user?.wallet_balance?.toLocaleString()}</div>
              <p className="text-xs opacity-90">Available for withdrawal</p>
            </CardContent>
          </Card>

          <Card className="gradient-secondary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">🏆 Total Earned</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{user?.total_earned?.toLocaleString()}</div>
              <p className="text-xs opacity-90">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">🎁 Referral Code</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.referral_code}</div>
              <Button
                onClick={copyReferralCode}
                variant="secondary"
                size="sm"
                className="mt-2 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🎯 Available Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-500" />
                🎯 Available Tasks
              </CardTitle>
              <CardDescription>Complete tasks to earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium text-emerald-600">
                          💰 ₦{task.reward_amount}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                          {task.task_type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 💸 Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                💸 Quick Actions
              </CardTitle>
              <CardDescription>Manage your earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleWithdraw}
                className="w-full gradient-primary text-white"
                size="lg"
              >
                💳 Withdraw Funds
              </Button>
              
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold text-emerald-800 mb-2">🎁 Referral Program</h3>
                <p className="text-sm text-emerald-700 mb-3">
                  Earn ₦1,000 for each friend you refer, plus ₦250 from their referrals!
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-1 rounded border text-sm">
                    {user?.referral_code}
                  </code>
                  <Button onClick={copyReferralCode} size="sm" variant="outline">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">📊 Earning Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Complete daily tasks for consistent income</li>
                  <li>• Share your referral code with friends</li>
                  <li>• Check back regularly for new opportunities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
