import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Updated path - remove '/config'
import type { User } from 'firebase/auth'; // Type-only import

// Types
interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description?: string;
  date: string;
  notes?: string;
}

interface Goal {
  id: string;
  title: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  endDate: string;
  description?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  currentBalance: number;
  isSetupComplete: boolean;
  transactions: Transaction[];
  goals: Goal[];
}

interface Categories {
  INCOME: string[];
  EXPENSE: string[];
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [categories, setCategories] = useState<Categories | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSetupMode, setIsSetupMode] = useState(false);
  
  // Setup form states
  const [setupData, setSetupData] = useState({
    currentBalance: 0,
    fixedIncomes: [{ title: '', amount: 0, frequency: 'MONTHLY' }],
    fixedExpenses: [{ title: '', amount: 0, frequency: 'MONTHLY', category: 'RENT' }],
    goals: [{ title: '', type: 'SAVINGS', targetAmount: 0, endDate: '', description: '' }]
  });

  // Transaction form states
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    category: '',
    amount: 0,
    description: '',
    notes: ''
  });

  // API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`http://localhost:5000/api/finance${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  };

  // Load data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Load categories
          const categoriesData = await fetch('http://localhost:5000/api/finance/categories');
          setCategories(await categoriesData.json());

          // Load user data
          const dashboardData = await apiCall('/dashboard');
          setUserData(dashboardData);
          setIsSetupMode(!dashboardData.isSetupComplete);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Setup handlers
  const addFixedIncome = () => {
    setSetupData(prev => ({
      ...prev,
      fixedIncomes: [...prev.fixedIncomes, { title: '', amount: 0, frequency: 'MONTHLY' }]
    }));
  };

  const addFixedExpense = () => {
    setSetupData(prev => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, { title: '', amount: 0, frequency: 'MONTHLY', category: 'RENT' }]
    }));
  };

  const addGoal = () => {
    setSetupData(prev => ({
      ...prev,
      goals: [...prev.goals, { title: '', type: 'SAVINGS', targetAmount: 0, endDate: '', description: '' }]
    }));
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiCall('/setup', {
        method: 'POST',
        body: JSON.stringify({
          ...setupData,
          goals: setupData.goals.map(goal => ({
            ...goal,
            endDate: new Date(goal.endDate)
          }))
        })
      });
      
      // Reload dashboard data
      const dashboardData = await apiCall('/dashboard');
      setUserData(dashboardData);
      setIsSetupMode(false);
    } catch (error) {
      console.error('Error completing setup:', error);
      alert('Error completing setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Transaction handlers
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionForm)
      });
      
      // Reload dashboard data
      const dashboardData = await apiCall('/dashboard');
      setUserData(dashboardData);
      setShowTransactionForm(false);
      setTransactionForm({
        type: 'EXPENSE',
        category: '',
        amount: 0,
        description: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Error creating transaction. Please try again.');
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await apiCall(`/transactions/${transactionId}`, { method: 'DELETE' });
      
      // Reload dashboard data
      const dashboardData = await apiCall('/dashboard');
      setUserData(dashboardData);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in to access your dashboard</h2>
        </div>
      </div>
    );
  }

  if (isSetupMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Finance Tracker!</h1>
            <p className="text-gray-600 mb-8">Let's set up your financial profile to get started.</p>
            
            <form onSubmit={handleSetupSubmit} className="space-y-8">
              {/* Current Balance */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Current Account Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={setupData.currentBalance}
                  onChange={(e) => setSetupData(prev => ({ ...prev, currentBalance: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your current balance"
                  required
                />
              </div>

              {/* Fixed Incomes */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Fixed Income Sources</h3>
                  <button
                    type="button"
                    onClick={addFixedIncome}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Income
                  </button>
                </div>
                {setupData.fixedIncomes.map((income, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      placeholder="Income source (e.g., Salary)"
                      value={income.title}
                      onChange={(e) => {
                        const newIncomes = [...setupData.fixedIncomes];
                        newIncomes[index].title = e.target.value;
                        setSetupData(prev => ({ ...prev, fixedIncomes: newIncomes }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={income.amount}
                      onChange={(e) => {
                        const newIncomes = [...setupData.fixedIncomes];
                        newIncomes[index].amount = parseFloat(e.target.value) || 0;
                        setSetupData(prev => ({ ...prev, fixedIncomes: newIncomes }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <select
                      value={income.frequency}
                      onChange={(e) => {
                        const newIncomes = [...setupData.fixedIncomes];
                        newIncomes[index].frequency = e.target.value;
                        setSetupData(prev => ({ ...prev, fixedIncomes: newIncomes }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Fixed Expenses */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Fixed Expenses</h3>
                  <button
                    type="button"
                    onClick={addFixedExpense}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
                {setupData.fixedExpenses.map((expense, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      placeholder="Expense (e.g., Rent)"
                      value={expense.title}
                      onChange={(e) => {
                        const newExpenses = [...setupData.fixedExpenses];
                        newExpenses[index].title = e.target.value;
                        setSetupData(prev => ({ ...prev, fixedExpenses: newExpenses }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={expense.amount}
                      onChange={(e) => {
                        const newExpenses = [...setupData.fixedExpenses];
                        newExpenses[index].amount = parseFloat(e.target.value) || 0;
                        setSetupData(prev => ({ ...prev, fixedExpenses: newExpenses }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <select
                      value={expense.category}
                      onChange={(e) => {
                        const newExpenses = [...setupData.fixedExpenses];
                        newExpenses[index].category = e.target.value;
                        setSetupData(prev => ({ ...prev, fixedExpenses: newExpenses }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {categories?.EXPENSE.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    <select
                      value={expense.frequency}
                      onChange={(e) => {
                        const newExpenses = [...setupData.fixedExpenses];
                        newExpenses[index].frequency = e.target.value;
                        setSetupData(prev => ({ ...prev, fixedExpenses: newExpenses }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Goals */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Financial Goals</h3>
                  <button
                    type="button"
                    onClick={addGoal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
                {setupData.goals.map((goal, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="text"
                      placeholder="Goal title (e.g., Emergency Fund)"
                      value={goal.title}
                      onChange={(e) => {
                        const newGoals = [...setupData.goals];
                        newGoals[index].title = e.target.value;
                        setSetupData(prev => ({ ...prev, goals: newGoals }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <select
                      value={goal.type}
                      onChange={(e) => {
                        const newGoals = [...setupData.goals];
                        newGoals[index].type = e.target.value;
                        setSetupData(prev => ({ ...prev, goals: newGoals }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SAVINGS">Savings</option>
                      <option value="INVESTMENT">Investment</option>
                      <option value="EMERGENCY_FUND">Emergency Fund</option>
                      <option value="DEBT_PAYOFF">Debt Payoff</option>
                      <option value="CUSTOM">Custom</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Target amount"
                      value={goal.targetAmount}
                      onChange={(e) => {
                        const newGoals = [...setupData.goals];
                        newGoals[index].targetAmount = parseFloat(e.target.value) || 0;
                        setSetupData(prev => ({ ...prev, goals: newGoals }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="date"
                      value={goal.endDate}
                      onChange={(e) => {
                        const newGoals = [...setupData.goals];
                        newGoals[index].endDate = e.target.value;
                        setSetupData(prev => ({ ...prev, goals: newGoals }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <textarea
                      placeholder="Goal description (optional)"
                      value={goal.description}
                      onChange={(e) => {
                        const newGoals = [...setupData.goals];
                        newGoals[index].description = e.target.value;
                        setSetupData(prev => ({ ...prev, goals: newGoals }));
                      }}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 md:col-span-2"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData?.name}!</h1>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
          <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
          <p className="text-4xl font-bold">₹{userData?.currentBalance.toLocaleString()}</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Add Transaction
          </button>
        </div>

        {/* Goals */}
        {userData?.goals && userData.goals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {goal.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>₹{goal.currentAmount.toLocaleString()}</span>
                        <span>₹{goal.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{progress.toFixed(1)}% complete</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Target: {new Date(goal.endDate).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          {userData?.transactions && userData.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {transaction.description || 'No description'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {transaction.category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No transactions yet. Add your first transaction to get started!</p>
          )}
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Transaction</h2>
              <form onSubmit={handleTransactionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={transactionForm.type}
                    onChange={(e) => setTransactionForm(prev => ({ 
                      ...prev, 
                      type: e.target.value as 'INCOME' | 'EXPENSE',
                      category: '' // Reset category when type changes
                    }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories?.[transactionForm.type]?.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={transactionForm.notes}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Optional notes"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransactionForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;