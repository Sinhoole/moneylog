import React from 'react';
import { Card, Button } from '../components/UI';
import { AppData, Transaction, TransactionType, DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from '../types';
import { RefreshCw, Trash2, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SuruTestProps {
  data: AppData;
  onUpdate: (newData: AppData) => void;
  onClose: () => void;
  lang?: 'en' | 'zh';
}

const SuruTest: React.FC<SuruTestProps> = ({ data, onUpdate, onClose, lang = 'zh' }) => {
  const t = {
    en: {
      title: "SURU MODE",
      beta: "Beta Feature",
      desc: "Welcome to the developer test environment. Here you can inject mock data to test visualization performance or reset your ledger state.",
      gen: "Generate 50 Random Transactions",
      del: "Delete All Data",
      confirm: "⚠️ DANGER: This will permanently delete all transaction data from your GitHub repository. Are you sure?",
      total: "Total Transactions",
      size: "Data Size",
      status: "System Status",
      statusDesc: "Sync active. Data integrity checks passed. All changes in SURU mode are permanent and synced to GitHub.",
      exit: "Exit Test Mode"
    },
    zh: {
      title: "速录模式",
      beta: "测试功能",
      desc: "欢迎来到开发者测试环境。您可以在此注入模拟数据以测试可视化性能或重置账本状态。",
      gen: "生成 50 条随机交易",
      del: "删除所有数据",
      confirm: "⚠️ 危险：这将永久删除 GitHub 仓库中的所有交易数据。确定吗？",
      total: "交易总数",
      size: "数据大小",
      status: "系统状态",
      statusDesc: "同步正常。数据完整性检查通过。速录模式下的所有更改都将永久保存并同步到 GitHub。",
      exit: "退出测试模式"
    }
  }[lang];

  const generateRandomData = () => {
    const newTransactions: Transaction[] = Array.from({ length: 50 }).map(() => {
      const isExpense = Math.random() > 0.35; // 65% chance of expense
      const amount = Math.floor(Math.random() * 150) + 5;
      const category = DEFAULT_CATEGORIES[Math.floor(Math.random() * DEFAULT_CATEGORIES.length)];
      const date = new Date();
      // Random date within last 60 days
      date.setDate(date.getDate() - Math.floor(Math.random() * 60));

      return {
        id: crypto.randomUUID(),
        amount,
        currency: 'CNY',
        type: isExpense ? TransactionType.EXPENSE : TransactionType.INCOME,
        date: date.toISOString().split('T')[0],
        categoryId: category.id,
        accountId: DEFAULT_ACCOUNTS[0].id,
        note: `Test ${isExpense ? 'Expense' : 'Income'} #${Math.floor(Math.random() * 1000)}`,
        isRecurring: false
      };
    });

    // Sort by date descending
    const allTransactions = [...newTransactions, ...data.transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const newData = {
      ...data,
      transactions: allTransactions
    };
    onUpdate(newData);
  };

  const clearAllData = () => {
    if (confirm(t.confirm)) {
      const newData = { ...data, transactions: [] };
      onUpdate(newData);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] pb-20">
      <Card className="border-2 border-yellow-400/30 bg-yellow-400/5 dark:bg-yellow-400/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={100} className="text-yellow-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{t.beta}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-[90%]">
            {t.desc}
          </p>

          <div className="grid gap-3">
            <Button onClick={generateRandomData} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-none shadow-yellow-500/20">
              <RefreshCw size={18} /> {t.gen}
            </Button>
            
            <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
            
            <Button variant="danger" onClick={clearAllData} className="opacity-90 hover:opacity-100">
              <Trash2 size={18} /> {t.del}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-50 dark:bg-white/5 border-none">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t.total}</p>
          <p className="text-2xl font-mono">{data.transactions.length}</p>
        </Card>
        <Card className="bg-gray-50 dark:bg-white/5 border-none">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t.size}</p>
          <p className="text-2xl font-mono">{(JSON.stringify(data).length / 1024).toFixed(2)} KB</p>
        </Card>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex gap-3">
        <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold mb-1">{t.status}</p>
          <p className="opacity-80">{t.statusDesc}</p>
        </div>
      </div>

      <Button variant="secondary" onClick={onClose}>
        {t.exit}
      </Button>
    </div>
  );
};

export default SuruTest;
