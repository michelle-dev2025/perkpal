
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ArrowLeft, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  wallet_balance: number;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  requested_at: string;
  admin_notes: string;
}

const Withdrawal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchUserData();
    fetchWithdrawalRequests();
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

  const fetchWithdrawalRequests = async () => {
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
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setWithdrawalRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching withdrawal requests:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amount = parseFloat(formData.amount);
    
    if (amount <= 0) {
      toast({
        title: "❌ Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive"
      });
      return;
    }

    if (amount > user.wallet_balance) {
      toast({
        title: "❌ Insufficient Balance",
        description: "You don't have enough balance to withdraw this amount.",
        variant: "destructive"
      });
      return;
    }

    if (amount < 1000) {
      toast({
        title: "❌ Minimum Withdrawal",
        description: "Minimum withdrawal amount is ₦1,000.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: amount,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_name: formData.accountName
        });

      if (error) throw error;

      toast({
        title: "✅ Withdrawal Request Submitted",
        description: "Your withdrawal request has been submitted and is being processed.",
      });

      // Reset form
      setFormData({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: ''
      });

      // Refresh withdrawal requests
      fetchWithdrawalRequests();
    } catch (error: any) {
      toast({
        title: "❌ Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                💳 Withdrawal Center
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 💰 Wallet Balance */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Available Balance</h2>
                <div className="text-3xl font-bold">₦{user?.wallet_balance?.toLocaleString()}</div>
              </div>
              <Wallet className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 📝 Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>
                Minimum withdrawal: ₦1,000. Funds will be transferred to your bank account within 1-3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">💰 Amount (₦)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="1000"
                    max={user?.wallet_balance}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">🏦 Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    placeholder="e.g., Access Bank"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">🔢 Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="Enter 10-digit account number"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">👤 Account Name</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    placeholder="Account holder name"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Request...
                    </div>
                  ) : (
                    '💳 Submit Withdrawal Request'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 📊 Withdrawal History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Withdrawal History
              </CardTitle>
              <CardDescription>Track your withdrawal requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawalRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No withdrawal requests yet</p>
                  </div>
                ) : (
                  withdrawalRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">₦{request.amount.toLocaleString()}</div>
                        <Badge className={getStatusColor(request.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status}
                          </div>
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Bank:</strong> {request.bank_name}</p>
                        <p><strong>Account:</strong> {request.account_number} - {request.account_name}</p>
                        <p><strong>Requested:</strong> {new Date(request.requested_at).toLocaleDateString()}</p>
                        {request.admin_notes && (
                          <p><strong>Notes:</strong> {request.admin_notes}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
