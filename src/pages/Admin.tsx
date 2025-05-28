
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Wallet, TrendingUp, CreditCard, Shield, LogOut } from 'lucide-react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  wallet_balance: number;
  total_earned: number;
  registration_payment_status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  requested_at: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminLogin = () => {
    if (password === 'codewave2025') {
      setIsAuthenticated(true);
      fetchAllData();
      toast({
        title: "✅ Admin Access Granted",
        description: "Welcome to the CodeWave Admin Dashboard",
      });
    } else {
      toast({
        title: "❌ Access Denied",
        description: "Invalid admin password",
        variant: "destructive"
      });
    }
  };

  const fetchAllData = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch all transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

      // Fetch all withdrawal requests
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;
      setWithdrawalRequests(withdrawalsData || []);

    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "❌ Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Chart data preparation
  const userRegistrationData = users.reduce((acc, user) => {
    const date = new Date(user.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const registrationChartData = Object.entries(userRegistrationData)
    .slice(-7)
    .map(([date, count]) => ({ date, users: count }));

  const transactionTypeData = transactions.reduce((acc, transaction) => {
    acc[transaction.transaction_type] = (acc[transaction.transaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(transactionTypeData).map(([type, count]) => ({
    name: type.replace('_', ' '),
    value: count
  }));

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const totalWalletBalance = users.reduce((sum, user) => sum + user.wallet_balance, 0);
  const totalEarnings = users.reduce((sum, user) => sum + user.total_earned, 0);
  const pendingWithdrawals = withdrawalRequests
    .filter(req => req.status === 'pending')
    .reduce((sum, req) => sum + req.amount, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🔐 Admin Access
            </CardTitle>
            <CardDescription>Enter admin password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <Button
              onClick={handleAdminLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              🚀 Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* 🧭 Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              👑 CodeWave Admin Dashboard
            </h1>
            <Button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
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
        {/* 📊 Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Wallet Balance</p>
                  <p className="text-2xl font-bold text-green-600">₦{totalWalletBalance.toLocaleString()}</p>
                </div>
                <Wallet className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-purple-600">₦{totalEarnings.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-orange-600">₦{pendingWithdrawals.toLocaleString()}</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📈 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>📅 User Registrations (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={registrationChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💰 Transaction Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 👥 Users Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>👥 Registered Users</CardTitle>
            <CardDescription>All registered users and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Wallet Balance</th>
                    <th className="text-left p-2">Total Earned</th>
                    <th className="text-left p-2">Payment Status</th>
                    <th className="text-left p-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">₦{user.wallet_balance.toLocaleString()}</td>
                      <td className="p-2">₦{user.total_earned.toLocaleString()}</td>
                      <td className="p-2">
                        <Badge className={user.registration_payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {user.registration_payment_status}
                        </Badge>
                      </td>
                      <td className="p-2">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 💸 Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>💸 Recent Transactions</CardTitle>
            <CardDescription>Latest transaction activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 20).map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">₦{transaction.amount.toLocaleString()}</td>
                      <td className="p-2">
                        <Badge variant="outline">
                          {transaction.transaction_type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-2">{transaction.description}</td>
                      <td className="p-2">{new Date(transaction.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
