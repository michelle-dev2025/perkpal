
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, CheckCircle, Play, Users, FileText } from 'lucide-react';

// 🎯 PerkPal Tasks Page - Author: Alexander Levi
// 🏆 Dedicated page for viewing and completing tasks

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  reward_amount: number;
  url: string;
}

interface CompletedTask {
  task_id: string;
  completed_at: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchTasks();
    fetchCompletedTasks();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    // 🔍 Get user profile
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();
    
    setUser(userData);
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('reward_amount', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedTasks = async () => {
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
        .from('user_tasks')
        .select('task_id, completed_at')
        .eq('user_id', userProfile.id);

      if (error) throw error;
      setCompletedTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching completed tasks:', error);
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return completedTasks.some(ct => ct.task_id === taskId);
  };

  const handleTaskClick = async (task: Task) => {
    if (!user) return;

    if (isTaskCompleted(task.id)) {
      toast({
        title: "✅ Already Completed",
        description: "You've already completed this task!",
        variant: "destructive"
      });
      return;
    }

    try {
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

      // 🔄 Refresh completed tasks
      fetchCompletedTasks();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'watch_ad':
        return <Play className="w-5 h-5" />;
      case 'social_media':
        return <Users className="w-5 h-5" />;
      case 'survey':
        return <FileText className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'watch_ad':
        return 'bg-red-100 text-red-800';
      case 'social_media':
        return 'bg-blue-100 text-blue-800';
      case 'survey':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-2xl font-bold text-gradient">🎯 Available Tasks</h1>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 📊 Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">{tasks.length}</div>
              <p className="text-sm text-gray-600">Total Available Tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{completedTasks.length}</div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                ₦{tasks.reduce((sum, task) => sum + task.reward_amount, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Potential Earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* 🎯 Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const completed = isTaskCompleted(task.id);
            
            return (
              <Card 
                key={task.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  completed ? 'bg-gray-50 border-gray-300' : 'hover:border-emerald-300'
                }`}
                onClick={() => handleTaskClick(task)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${completed ? 'bg-gray-200' : 'bg-emerald-100'}`}>
                      {completed ? (
                        <CheckCircle className="w-5 h-5 text-gray-500" />
                      ) : (
                        <div className="text-emerald-600">
                          {getTaskIcon(task.task_type)}
                        </div>
                      )}
                    </div>
                    <Badge className={getTaskTypeColor(task.task_type)}>
                      {task.task_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <CardTitle className={`text-lg ${completed ? 'text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </CardTitle>
                  <CardDescription className={completed ? 'text-gray-400' : 'text-gray-600'}>
                    {task.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        completed ? 'text-gray-500' : 'text-emerald-600'
                      }`}>
                        ₦{task.reward_amount}
                      </span>
                      {completed && (
                        <Badge variant="secondary" className="text-xs">
                          ✅ Completed
                        </Badge>
                      )}
                    </div>
                    
                    {!completed && (
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  
                  {!completed && (
                    <Button 
                      className="w-full mt-4 gradient-primary text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    >
                      🚀 Start Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Available</h3>
            <p className="text-gray-600">Check back later for new earning opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
