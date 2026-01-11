
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import {
  Wallet,
  PieChart,
  Plus,
  Settings,
  Sparkles,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  MapPin,
  Camera,
  LogOut,
  Moon,
  Sun,
  Github,
  Loader2,
  RefreshCw,
  TrendingUp,
  Image as ImageIcon,
  FlaskConical,
  Smartphone,
  Laptop,
  Menu,
  X,
  Languages,
  Target,
  BarChart3,
  Calculator,
  CalendarClock,
  Check,
  FolderTree,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  SortAsc,
  SortDesc,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Utensils,
  Car,
  Home,
  Banknote,
  ShoppingBag,
  Film,
  Book,
  Gamepad2,
  Trash2,
  Tags,
  Bot,
  BrainCircuit,
  Zap,
  Cpu,
  Share2,
  Download,
  Upload,
  HardDrive
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  AreaChart,
  Area,
  ReferenceLine,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, Button, Input, Select, NavItem, Modal } from './components/UI';
import {
  AppData,
  Transaction,
  GitHubConfig,
  DEFAULT_CATEGORIES,
  DEFAULT_ACCOUNTS,
  TransactionType,
  LivingFeeRule,
  ProjectNode,
  Category,
  AIConfig,
  Language
} from './types';
import * as GitHubService from './services/githubService';
import * as GeminiService from './services/geminiService';
import * as LLMService from './services/llmService';
import SuruTest from './test/SuruTest';
import { ProjectList, ProjectDetail } from './components/ProjectViews';

// --- Constants & Config ---
const REPO_NAME = 'zenledger-data';

// Icon Map for Default Categories
const ICON_MAP: Record<string, React.ElementType> = {
  'utensils': Utensils,
  'car': Car,
  'home': Home,
  'banknote': Banknote,
  'shopping-bag': ShoppingBag,
  'film': Film,
  'book': Book,
  'gamepad-2': Gamepad2,
  'trending-up': TrendingUp,
};

const COLOR_PALETTE = [
  'text-red-500', 'text-orange-500', 'text-amber-500', 'text-yellow-500', 
  'text-lime-500', 'text-green-500', 'text-emerald-500', 'text-teal-500', 
  'text-cyan-500', 'text-sky-500', 'text-blue-500', 'text-indigo-500', 
  'text-violet-500', 'text-purple-500', 'text-fuchsia-500', 'text-pink-500', 'text-rose-500', 'text-gray-500'
];

const getColorHex = (twClass: string) => {
  if (twClass.includes('orange')) return '#f97316';
  if (twClass.includes('blue')) return '#3b82f6';
  if (twClass.includes('purple')) return '#a855f7';
  if (twClass.includes('green')) return '#22c55e';
  if (twClass.includes('pink')) return '#ec4899';
  if (twClass.includes('indigo')) return '#6366f1';
  if (twClass.includes('yellow')) return '#eab308';
  if (twClass.includes('red')) return '#ef4444';
  if (twClass.includes('amber')) return '#f59e0b';
  if (twClass.includes('lime')) return '#84cc16';
  if (twClass.includes('emerald')) return '#10b981';
  if (twClass.includes('teal')) return '#14b8a6';
  if (twClass.includes('cyan')) return '#06b6d4';
  if (twClass.includes('sky')) return '#0ea5e9';
  if (twClass.includes('violet')) return '#8b5cf6';
  if (twClass.includes('fuchsia')) return '#d946ef';
  if (twClass.includes('rose')) return '#f43f5e';
  return '#9ca3af'; // gray default
};

const TEXTS = {
  en: {
    app: {
      name: "ZenLedger AI",
      desc: "Secure, Private, AI-Powered Finance.",
      dataLoc: "Select how you want to store your data.",
      startLocal: "Start Locally",
      startLocalDesc: "Data stored on this device. Easiest way to start.",
      tokenPlaceholder: "GitHub Personal Access Token",
      connect: "Connect GitHub",
      tokenScope: "We need a Classic Token with `repo` scope.",
      orGitHub: "Or Sync with GitHub",
      gitHubDesc: "Sync data across devices using a private repository.",
      enterTest: "Developer Mode",
    },
    settings: {
      title: "Settings",
      account: "Account",
      connectedAs: "Connected Mode",
      repo: "Repository",
      appearance: "Appearance",
      darkMode: "Dark Mode",
      language: "Language",
      budget: "Budget Settings",
      budgetDesc: "Set your base budgets for accurate surplus calculation.",
      yearlyBudget: "Yearly Base Budget",
      monthlyBudget: "Monthly Base Budget",
      dailyBudget: "Daily Base Budget",
      data: "Data Management",
      backup: "Backup & Restore",
      export: "Export JSON",
      import: "Import JSON",
      logout: "Reset / Logout",
      save: "Save Settings",
      saved: "Settings Saved",
      categories: "Categories",
      manageCategories: "Manage Categories"
    },
    dashboard: {
      balance: "Net Assets",
      income: "Total Income",
      expense: "Total Expense",
      trend: "Spending Trend",
      recent: "Recent Activity",
      noTx: "No transactions yet",
      noData: "No data",
      dailyPie: "Today's Spending",
      weeklyPie: "This Week's Spending",
      monthlyPie: "This Month's Spending",
      budgetProgress: "Monthly Budget Progress",
      budget: "Budget",
      spent: "Spent",
      remaining: "Remaining",
      financialProgress: "Surplus Trends (Budget + Inc - Exp)",
      surplus: "Surplus",
      viewYear: "Year",
      viewMonth: "Month",
      viewDay: "Day",
      manageCycle: "Manage Cycle"
    },
    nav: {
      overview: "Overview",
      dashboard: "Dashboard",
      transactions: "Transactions",
      projects: "Projects",
      ai: "AI Assistant",
      settings: "Settings",
      activity: "Activity",
      insights: "AI Insights"
    },
    tx: {
      new: "New Transaction",
      save: "Save Transaction",
      amount: "Amount",
      category: "Category",
      account: "Account",
      date: "Date",
      note: "Note",
      addNote: "Add a note...",
      addLoc: "Add Location",
      located: "Located",
      addReceipt: "Add Receipt",
      added: "Added",
      hasReceipt: "Has Receipt",
      expense: "Expense",
      income: "Income",
      linkToProject: "Link to Project?",
      sortBy: "Sort By",
      dateNewest: "Date (Newest)",
      amountHigh: "Amount (High to Low)",
      amountLow: "Amount (Low to High)",
      viewMode: "View",
      waterfall: "Waterfall",
      list: "List",
      dailyBill: "Daily Bill",
      viewAll: "View All",
      selectDate: "Select Date",
      today: "Today",
      daySummary: "Day Summary",
      noTx: "No transactions yet",
      noData: "No data"
    },
    cycle: {
      title: "Economic Cycle Settings",
      desc: "Select dates on the calendar to issue living fees. Amounts are only counted into Total Assets on these specific days. This also auto-updates your yearly/monthly/daily budgets.",
      setAmount: "Set Amount for Day",
      monthlyTotal: "Monthly Living Fee Total",
      save: "Save Cycle Rules"
    },
    ai: {
      welcome: "Hi! I can analyze your spending. Ask me anything about your finances.",
      placeholder: "Ask about your spending...",
      configTitle: "AI Model Config",
      selectModel: "Select Provider",
      apiKey: "API Key",
      baseUrl: "Base URL",
      modelName: "Model Name",
      generate: "Generate Monthly Report",
      analyzing: "Analyzing data...",
      selectMonth: "Select Month",
      noDataMonth: "No data for selected month",
      export: "Share as Image",
      providers: {
        deepseek: "DeepSeek",
        siliconflow: "SiliconFlow (Qwen/Yi)",
        doubao: "Doubao/Volcengine",
        custom: "Custom (OpenAI Compatible)"
      }
    },
    cat: {
      title: "Manage Categories",
      add: "Add Category",
      name: "Category Name",
      icon: "Icon (Emoji)",
      color: "Color",
      delete: "Delete",
      preview: "Preview"
    }
  },
  zh: {
    app: {
      name: "ZenLedger AI",
      desc: "安全、隐私、AI 驱动的记账应用。",
      dataLoc: "选择您的数据存储方式。",
      startLocal: "开始使用 (本地模式)",
      startLocalDesc: "数据存储在当前设备中。无需注册，立即开始。",
      tokenPlaceholder: "GitHub Personal Access Token",
      connect: "连接 GitHub",
      tokenScope: "我们需要一个具有 `repo` 权限的 Classic Token。",
      orGitHub: "或者连接 GitHub",
      gitHubDesc: "使用私人仓库在多设备间同步数据。",
      enterTest: "开发者模式",
    },
    settings: {
      title: "设置",
      account: "账户",
      connectedAs: "当前模式",
      repo: "存储位置",
      appearance: "外观",
      darkMode: "深色模式",
      language: "语言",
      budget: "预算设置",
      budgetDesc: "设置您的基础预算以便准确计算结余。",
      yearlyBudget: "年基础预算",
      monthlyBudget: "月基础预算",
      dailyBudget: "日基础预算",
      data: "数据管理",
      backup: "备份与恢复",
      export: "导出数据 (JSON)",
      import: "导入数据 (JSON)",
      logout: "重置 / 退出",
      save: "保存设置",
      saved: "设置已保存",
      categories: "分类管理",
      manageCategories: "管理分类"
    },
    dashboard: {
      balance: "净资产",
      income: "总收入",
      expense: "总支出",
      trend: "收支趋势",
      recent: "最近动态",
      noTx: "暂无交易",
      noData: "暂无数据",
      dailyPie: "今日消费构成",
      weeklyPie: "本周消费构成",
      monthlyPie: "本月消费构成",
      budgetProgress: "月度生活费进度",
      budget: "月预算",
      spent: "已用",
      remaining: "剩余",
      financialProgress: "结余趋势 (预算+收入-支出)",
      surplus: "结余",
      viewYear: "年",
      viewMonth: "月",
      viewDay: "日",
      manageCycle: "管理周期"
    },
    nav: {
      overview: "概览",
      dashboard: "仪表盘",
      transactions: "交易明细",
      projects: "项目树",
      ai: "AI 助手",
      settings: "设置",
      activity: "动态",
      insights: "智能分析"
    },
    tx: {
      new: "记一笔",
      save: "保存",
      amount: "金额",
      category: "分类",
      account: "账户",
      date: "日期",
      note: "备注",
      addNote: "添加备注...",
      addLoc: "添加位置",
      located: "已定位",
      addReceipt: "添加小票",
      added: "已添加",
      hasReceipt: "有小票",
      expense: "支出",
      income: "收入",
      linkToProject: "关联到项目树?",
      sortBy: "排序方式",
      dateNewest: "日期 (最新)",
      amountHigh: "金额 (从大到小)",
      amountLow: "金额 (从小到大)",
      viewMode: "视图",
      waterfall: "瀑布流",
      list: "列表",
      dailyBill: "每日账单",
      viewAll: "查看全部",
      selectDate: "选择日期",
      today: "今天",
      daySummary: "单日概览",
      noTx: "暂无交易",
      noData: "暂无数据"
    },
    cycle: {
      title: "经济周期设置",
      desc: "点击日历选择生活费发放日期。只有到达指定日期，资金才会计入总资产。系统将根据此设置自动更新您的年/月/日预算。",
      setAmount: "设置发放金额 - 日期：",
      monthlyTotal: "月度生活费总额",
      save: "保存周期规则"
    },
    ai: {
      welcome: "你好！我是你的记账助手。关于你的财务状况，尽管问我。",
      placeholder: "询问你的消费情况...",
      configTitle: "AI 模型配置",
      selectModel: "选择模型提供商",
      apiKey: "API Key",
      baseUrl: "API 域名 (Base URL)",
      modelName: "模型名称 (Model ID)",
      generate: "生成月度深度分析报告",
      analyzing: "正在深度分析账单数据...",
      selectMonth: "选择分析月份",
      noDataMonth: "该月份无账单数据",
      export: "分享为图片",
      providers: {
        deepseek: "DeepSeek (深度求索)",
        siliconflow: "硅基流动 (Qwen/Yi/GLM)",
        doubao: "豆包/火山引擎 (Doubao)",
        custom: "自定义 (OpenAI 兼容)"
      }
    },
    cat: {
      title: "分类管理",
      add: "添加分类",
      name: "分类名称",
      icon: "图标 (Emoji)",
      color: "颜色",
      delete: "删除",
      preview: "预览"
    }
  }
};

const calculateAccumulatedLivingFees = (rules: LivingFeeRule[], startDate: Date, endDate: Date) => {
  let total = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  let safetyCounter = 0;
  const MAX_DAYS = 365 * 10; 

  while (current <= end && safetyCounter < MAX_DAYS) {
    const dayOfMonth = current.getDate();
    const rule = rules.find(r => r.day === dayOfMonth);
    if (rule) total += rule.amount;
    current.setDate(current.getDate() + 1);
    safetyCounter++;
  }
  return total;
};

const renderCategoryIcon = (category: Category | undefined, size: number = 20) => {
  if (!category) return <span className="text-sm">?</span>;
  
  const IconComponent = ICON_MAP[category.icon];
  if (IconComponent) {
    return <IconComponent size={size} />;
  }
  return <span style={{ fontSize: size, fontWeight: 'bold' }}>{category.name?.[0]}</span>;
};

const Onboarding = ({ onLogin, lang, setLang }: { onLogin: (config: GitHubConfig) => void, lang: Language, setLang: (l: Language) => void }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGitHub, setShowGitHub] = useState(false);
  const t = TEXTS[lang].app;

  const handleConnect = async () => {
    if (!token) return;
    setLoading(true);
    setError('');

    const username = await GitHubService.validateToken(token);
    if (username) {
      const created = await GitHubService.createRepo(token, REPO_NAME);
      if (created) {
        onLogin({ token, owner: username, repo: REPO_NAME });
      } else {
        setError('Could not access or create repository.');
      }
    } else {
      setError('Invalid Personal Access Token.');
    }
    setLoading(false);
  };

  const handleLocalMode = () => {
    onLogin({ token: 'local', owner: 'local', repo: 'device-storage' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center space-y-8 animate-[fadeIn_0.5s_ease-out] relative z-10">
      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="skeuo-btn p-2 rounded-full bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300"
        >
          <Languages size={20} />
        </button>
      </div>

      <div className="bg-white/50 dark:bg-white/10 p-6 rounded-[2rem] mb-4 backdrop-blur-xl shadow-2xl ring-1 ring-white/50">
        <Wallet size={64} className="text-ios-blue drop-shadow-lg" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">{t.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t.desc}</p>
      </div>

      <Card className="w-full space-y-6 !bg-white/60 dark:!bg-black/40 backdrop-blur-lg">
        <div className="space-y-2">
            <Button onClick={handleLocalMode} className="!bg-gradient-to-r from-ios-blue to-blue-500 !shadow-lg shadow-blue-500/30 py-4">
               <Smartphone size={20} /> {t.startLocal}
            </Button>
            <p className="text-xs text-gray-400">{t.startLocalDesc}</p>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300 dark:border-gray-700/50"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-gray-400 font-bold">OR</span></div>
        </div>

        {!showGitHub ? (
             <Button variant="secondary" onClick={() => setShowGitHub(true)}>
                <Github size={20} /> {t.orGitHub}
             </Button>
        ) : (
             <div className="space-y-4 animate-[fadeIn_0.3s]">
                <div className="text-left">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Github size={16}/> GitHub Sync</h3>
                  <p className="text-xs text-gray-400">{t.gitHubDesc}</p>
                </div>
                <Input
                  placeholder={t.tokenPlaceholder}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  type="password"
                />
                {error && <p className="text-red-500 text-sm animate-pulse">{error}</p>}
                <Button onClick={handleConnect} disabled={loading} variant="primary">
                  {loading ? <Loader2 className="animate-spin" /> : t.connect}
                </Button>
                <button onClick={() => setShowGitHub(false)} className="text-xs text-gray-400 underline">Cancel</button>
             </div>
        )}
      </Card>
    </div>
  );
};

const AIAnalysisView = ({ data, lang, onUpdate }: { data: AppData, lang: Language, onUpdate: (d: AppData) => void }) => {
  const t = TEXTS[lang].ai;
  const [config, setConfig] = useState<AIConfig>(data.settings.aiConfig || {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com',
    modelName: 'deepseek-chat',
    apiKey: 'sk-cfaa45343ece4c43ab79565c6ef49503'
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const availableMonths = useMemo(() => {
    const months = new Set(data.transactions.map(t => t.date.substring(0, 7)));
    return Array.from(months).sort().reverse();
  }, [data.transactions]);

  const handleProviderChange = (provider: string) => {
    const preset = LLMService.PROVIDER_PRESETS[provider];
    if (preset) {
      setConfig(prev => ({ ...prev, ...preset, apiKey: prev.apiKey }));
    }
  };

  const handleExportImage = async () => {
    if (reportRef.current) {
      try {
        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#fdf6e3',
          logging: false
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `ZenLedger_Report_${selectedMonth}.png`;
        link.click();
      } catch (err) {
        console.error("Export failed:", err);
        alert("Failed to export image.");
      }
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setReport(null);
    onUpdate({
       ...data,
       settings: { ...data.settings, aiConfig: config }
    });

    try {
      const monthTx = data.transactions.filter(t => t.date.startsWith(selectedMonth));
      if (monthTx.length === 0) {
        setReport("No data found for this month.");
        setLoading(false);
        return;
      }

      const enrichedData = monthTx.map(tx => {
        const cat = data.categories.find(c => c.id === tx.categoryId);
        let projectPath = "N/A";
        const node = (data.projectNodes || []).find(n => n.transactionId === tx.id);
        if (node) {
          const path = [];
          let curr: ProjectNode | undefined = node;
          while (curr) {
             if (curr.name) path.unshift(curr.name);
             if (curr.parentId) curr = data.projectNodes?.find(p => p.id === curr!.parentId);
             else curr = undefined;
          }
          if (path.length > 0) projectPath = path.join(" > ");
        }
        return {
          date: tx.date,
          amount: tx.amount,
          type: tx.type,
          category: cat?.name || 'Unknown',
          project: projectPath,
          note: tx.note || ''
        };
      });

      const totalIncome = enrichedData.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
      const totalExpense = enrichedData.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
      const livingFeeRules = data.settings.livingFeeRules || [];
      const daysInMonth = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate();
      let livingFee = 0;
      livingFeeRules.forEach(r => { if(r.day <= daysInMonth) livingFee += r.amount; });

      const summary = {
        month: selectedMonth,
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        livingFeeAllocated: livingFee.toFixed(2),
        currency: data.settings.currency,
        recordCount: enrichedData.length
      };

      const prompt = `
      Role: You are a veteran financial editor for a 1920s American newspaper.
      Style: Vintage, detailed, narrative-driven. 
      
      Task: Write a COMPREHENSIVE, LONG-FORM monthly financial report for ${selectedMonth}.
      
      **Data:**
      ${JSON.stringify(summary, null, 2)}
      
      **Transactions:**
      ${JSON.stringify(enrichedData)}

      **CRITICAL INSTRUCTIONS:**
      1. **NO MARKDOWN**: Do not use **, ##, -, or any markdown syntax. Just plain text.
      2. **FORMAT**: Use uppercase for headlines. Use double line breaks between paragraphs.
      3. **DEPTH**: Analyze specific transactions. Do not just summarize totals. Explain "why" and "how".
      4. **LENGTH**: Write a long, detailed article. Short reports are unacceptable.
      
      Structure: [HEADLINE], [City, Date], [Analysis Paragraphs].
      Language: ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.
      `;

      const result = await LLMService.generateAnalysisReport(config, prompt, "You are a vintage newspaper financial columnist. You write long, detailed articles.");
      setReport(result);
    } catch (e: any) {
      setReport(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
           <BrainCircuit className="text-purple-500 drop-shadow-md" /> {t.generate}
        </h2>
        <Button variant="secondary" className="w-auto px-3" onClick={() => setShowConfig(!showConfig)}>
          <Settings size={18} />
        </Button>
      </div>

      {showConfig && (
        <Card className="animate-[slideDown_0.2s_ease-out] border-2 border-purple-500/20">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-purple-600"><Bot size={18} /> {t.configTitle}</h3>
          <div className="space-y-4">
             <Select label={t.selectModel} value={config.provider} onChange={(e) => handleProviderChange(e.target.value)}>
                <option value="deepseek">{t.providers.deepseek}</option>
                <option value="siliconflow">{t.providers.siliconflow}</option>
                <option value="doubao">{t.providers.doubao}</option>
                <option value="custom">{t.providers.custom}</option>
             </Select>
             <Input label={t.apiKey} type="password" value={config.apiKey || ''} onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} placeholder="sk-..." />
             <div className="grid grid-cols-2 gap-4">
                <Input label={t.baseUrl} value={config.baseUrl || ''} onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })} />
                <Input label={t.modelName} value={config.modelName || ''} onChange={(e) => setConfig({ ...config, modelName: e.target.value })} />
             </div>
          </div>
        </Card>
      )}

      <Card className="flex flex-col md:flex-row items-end gap-4 p-4 !bg-white/60 dark:!bg-white/5">
         <div className="w-full md:flex-1 min-w-0">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.selectMonth}</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
               {availableMonths.map(m => (
                 <button 
                   key={m} 
                   onClick={() => setSelectedMonth(m)}
                   className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${selectedMonth === m ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105' : 'bg-white dark:bg-white/10 text-gray-500 hover:bg-gray-50'}`}
                 >
                   {m}
                 </button>
               ))}
               {availableMonths.length === 0 && <span className="text-sm text-gray-400">{t.noDataMonth}</span>}
            </div>
         </div>
         <Button 
            onClick={handleGenerate} 
            disabled={loading || !config.apiKey || availableMonths.length === 0} 
            className="md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none shrink-0 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform"
         >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? t.analyzing : "Generate"}
         </Button>
      </Card>

      {report && (
        <div className="animate-fade-in-up stagger-1">
           <div className="flex justify-end mb-2">
             <Button variant="secondary" className="w-auto gap-2" onClick={handleExportImage}>
               <Share2 size={16} /> {t.export}
             </Button>
           </div>
           
           <div ref={reportRef} className="newspaper-theme p-8 shadow-2xl mx-auto max-w-4xl text-[#2b2b2b]">
              <div className="border-b-4 border-black mb-6 pb-2 text-center">
                 <h1 className="font-serif text-3xl md:text-5xl font-black uppercase tracking-widest mb-2">The ZenLedger Daily</h1>
                 <div className="flex justify-between items-center text-xs md:text-sm font-serif italic border-t border-black pt-1 px-2">
                    <span>Vol. {selectedMonth}</span>
                    <span>Late Edition</span>
                    <span>Price: One Insight</span>
                 </div>
              </div>
              <div className="newspaper-body columns-1 md:columns-2 gap-8 text-justify whitespace-pre-wrap font-serif">
                 {report}
              </div>
              <div className="mt-8 pt-4 border-t border-double border-black text-center font-serif text-xs italic text-gray-600">
                 Generated by ZenLedger AI • {new Date().toLocaleDateString()}
              </div>
           </div>
        </div>
      )}
      
      {!report && !loading && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30 animate-pulse-slow">
           <Zap size={64} className="mb-4" />
           <p>Select a month and generate insights.</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ data, isDesktop, lang, onOpenCycleSettings }: { data: AppData, isDesktop: boolean, lang: Language, onOpenCycleSettings: () => void }) => {
  const t = TEXTS[lang].dashboard;
  const [progressView, setProgressView] = useState<'year' | 'month' | 'day'>('year');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const rules = data.settings.livingFeeRules || [];
  const monthlyBudget = data.settings.monthlyBudget || rules.reduce((sum, r) => sum + r.amount, 0);

  const earliestTxDate = data.transactions.length > 0 
    ? new Date(data.transactions[data.transactions.length - 1].date) 
    : new Date(currentYear, 0, 1);
  
  const statsStartDate = new Date(Math.min(earliestTxDate.getTime(), new Date(currentYear, 0, 1).getTime()));
  const totalAllocatedLivingFee = useMemo(() => calculateAccumulatedLivingFees(rules, statsStartDate, today), [rules, statsStartDate]);

  const totalIncome = data.transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = data.transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
  const totalAssets = totalAllocatedLivingFee + totalIncome - totalExpense;

  const startOfWeek = new Date(today);
  const dayOfWeek = startOfWeek.getDay() || 7;
  if (dayOfWeek !== 1) startOfWeek.setHours(-24 * (dayOfWeek - 1));
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

  const getPieData = (transactions: Transaction[]) => {
    const expenseTx = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const groups: { [key: string]: number } = {};
    expenseTx.forEach(t => {
      groups[t.categoryId] = (groups[t.categoryId] || 0) + t.amount;
    });
    return Object.keys(groups).map(catId => {
      const cat = data.categories.find(c => c.id === catId);
      return {
        name: cat?.name || 'Unknown',
        value: groups[catId],
        color: getColorHex(cat?.color || '')
      };
    }).sort((a, b) => b.value - a.value);
  };

  const dailyPieData = useMemo(() => getPieData(data.transactions.filter(t => t.date === todayStr)), [data.transactions, todayStr]);
  const weeklyPieData = useMemo(() => getPieData(data.transactions.filter(t => t.date >= startOfWeekStr)), [data.transactions, startOfWeekStr]);
  const monthlyPieData = useMemo(() => getPieData(data.transactions.filter(t => t.date.startsWith(currentMonthStr))), [data.transactions, currentMonthStr]);

  const monthlyProgressData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const chartData = [];
    let cumulative = 0;
    const monthlyTx = data.transactions.filter(t => t.date.startsWith(currentMonthStr) && t.type === TransactionType.EXPENSE).sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${currentMonthStr}-${String(i).padStart(2, '0')}`;
      if (dayStr <= todayStr) {
        cumulative += monthlyTx.filter(t => t.date === dayStr).reduce((sum, t) => sum + t.amount, 0);
        chartData.push({ day: i, spent: cumulative });
      }
    }
    return chartData;
  }, [data.transactions, currentMonthStr, todayStr]);

  const totalMonthlySpent = monthlyProgressData.length > 0 ? monthlyProgressData[monthlyProgressData.length - 1].spent : 0;
  const remainingBudget = monthlyBudget - totalMonthlySpent;
  const budgetProgress = monthlyBudget > 0 
      ? Math.min((totalMonthlySpent / monthlyBudget) * 100, 100) 
      : (totalMonthlySpent > 0 ? 100 : 0);

  const surplusChartData = useMemo(() => {
     const chartData = [];
     const yearlyBudget = data.settings.yearlyBudget || 0;
     const monthlyBudgetVal = data.settings.monthlyBudget || 0;
     const dailyBudgetVal = data.settings.dailyBudget || 0;

     if (progressView === 'year') {
        const years = Array.from(new Set(data.transactions.map(t => t.date.substring(0, 4)))).sort();
        if (!years.includes(String(currentYear))) years.push(String(currentYear));
        years.forEach(year => {
          const txs = data.transactions.filter(t => t.date.startsWith(year));
          const exp = txs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
          const inc = txs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
          chartData.push({ name: year, surplus: yearlyBudget + inc - exp });
        });
     } else if (progressView === 'month') {
        for (let i = 0; i < 12; i++) {
          const monthStr = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
          const txs = data.transactions.filter(t => t.date.startsWith(monthStr));
          const exp = txs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
          const inc = txs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
          chartData.push({ name: `${i + 1}`, surplus: monthlyBudgetVal + inc - exp });
        }
     } else {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const dayStr = `${currentMonthStr}-${String(i).padStart(2, '0')}`;
          const txs = data.transactions.filter(t => t.date === dayStr);
          const exp = txs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
          const inc = txs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
          chartData.push({ name: `${i}`, surplus: dailyBudgetVal + inc - exp });
        }
     }
     return chartData;
  }, [data.transactions, progressView, currentYear, currentMonth, data.settings]);

  const MiniPie = ({ data, title }: { data: any[], title: string }) => (
    <Card className="flex flex-col items-center p-4">
      <h3 className="text-sm font-bold mb-2 text-gray-400 uppercase tracking-wide">{title}</h3>
      {data.length > 0 ? (
        <div className="w-full h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value: number) => `¥${value}`} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-gray-400">¥{data.reduce((a, b) => a + b.value, 0).toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-300 text-xs">{TEXTS[lang].dashboard.noData}</div>
      )}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {data.slice(0, 3).map((d, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px] text-gray-500">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>{d.name}
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up">
      <div className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-3' : 'gap-4'}`}>
        <Card className="bg-gradient-to-br from-ios-blue to-blue-600 text-white border-none shadow-xl shadow-blue-500/30 p-6 relative overflow-hidden stagger-1">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={64} /></div>
           <p className="text-blue-100 text-sm font-medium relative z-10">{t.balance}</p>
           <h2 className="text-3xl font-bold mt-2 relative z-10 drop-shadow-sm">¥{totalAssets.toLocaleString()}</h2>
        </Card>
        <Card className="p-6 stagger-2">
           <div className="flex justify-between items-center"><span className="text-gray-500">{t.income}</span><div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-500"><ArrowDownLeft size={18}/></div></div>
           <h3 className="text-xl font-bold text-green-600 mt-2">+¥{totalIncome.toLocaleString()}</h3>
        </Card>
        <Card className="p-6 stagger-3">
           <div className="flex justify-between items-center"><span className="text-gray-500">{t.expense}</span><div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500"><ArrowUpRight size={18}/></div></div>
           <h3 className="text-xl font-bold text-red-600 mt-2">-¥{totalExpense.toLocaleString()}</h3>
        </Card>
      </div>

      <Card className="p-4 overflow-hidden stagger-4">
        <div className="flex justify-between items-end mb-4 px-1">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Target size={18} className="text-ios-blue"/> {t.budgetProgress}</h3>
              <button onClick={onOpenCycleSettings} className="text-xs bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full font-medium text-ios-blue hover:bg-ios-blue/10 flex items-center gap-1 transition-colors">
                <CalendarClock size={12} /> {t.manageCycle}
              </button>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${remainingBudget < 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{remainingBudget < 0 ? 'Over' : t.remaining} ¥{Math.abs(remainingBudget).toLocaleString()}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 overflow-hidden inner-shadow">
            <div className={`h-full rounded-full transition-all duration-1000 ${remainingBudget < 0 ? 'bg-red-500' : 'bg-ios-blue shadow-[0_0_10px_rgba(0,122,255,0.5)]'}`} style={{ width: `${Math.min(budgetProgress, 100)}%` }} />
        </div>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyProgressData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs><linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#007aff" stopOpacity={0.3}/><stop offset="95%" stopColor="#007aff" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="spent" stroke="#007aff" fillOpacity={1} fill="url(#colorSpent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <div className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-3' : 'gap-4'} stagger-5`}>
        <MiniPie data={dailyPieData} title={t.dailyPie} />
        <MiniPie data={weeklyPieData} title={t.weeklyPie} />
        <MiniPie data={monthlyPieData} title={t.monthlyPie} />
      </div>

      <Card className="p-4 stagger-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          <h3 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={18} className="text-ios-blue"/> {t.financialProgress}</h3>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {(['year', 'month', 'day'] as const).map(vt => (
              <button key={vt} onClick={() => setProgressView(vt)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${progressView === vt ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
                {vt === 'year' ? t.viewYear : vt === 'month' ? t.viewMonth : t.viewDay}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={surplusChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
               <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
               <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, t.surplus]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
               <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
               <Line type="monotone" dataKey="surplus" stroke="#007aff" strokeWidth={3} dot={{ r: 4, fill: "#007aff", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

const TransactionList = ({ data, isDesktop, lang }: { data: AppData, isDesktop: boolean, lang: Language }) => {
  const t = TEXTS[lang].tx;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return lang === 'zh' ? '今天' : 'Today';
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', weekday: 'long' });
  };

  const getDayStats = (txs: Transaction[]) => {
    const income = txs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = txs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  };

  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: Transaction[] } = {};
    const filteredTxs = selectedDate ? data.transactions.filter(t => t.date === selectedDate) : data.transactions;
    filteredTxs.forEach(tx => {
      if (!groups[tx.date]) groups[tx.date] = [];
      groups[tx.date].push(tx);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [data.transactions, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    } else {
      setSelectedDate(null);
    }
  };

  return (
    <div className="space-y-4 pb-24 flex flex-col relative animate-fade-in-up">
      <div className="glass-morphism sticky top-0 z-30 px-1 py-3 -mx-4 sm:mx-0 sm:rounded-xl flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2 pl-4">
           {selectedDate ? (
             <button onClick={() => setSelectedDate(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-ios-blue flex items-center gap-1 transition-colors">
               <ChevronLeft size={20} /> <span className="text-sm font-semibold">{t.viewAll}</span>
             </button>
           ) : (
             <span className="text-xl font-bold px-2">{t.dailyBill}</span>
           )}
        </div>

        <div className="flex items-center pr-4">
           <div className="relative">
              <input 
                ref={dateInputRef}
                type="date" 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleDateChange}
                value={selectedDate || ''}
              />
              <button className={`skeuo-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedDate ? 'bg-ios-blue text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                <Calendar size={16} />
                {selectedDate ? selectedDate : t.selectDate}
              </button>
           </div>
        </div>
      </div>

      {selectedDate && groupedTransactions.length > 0 && (
         <div className="px-1 animate-[fadeIn_0.3s_ease-out]">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 border-none shadow-xl">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{t.daySummary}</p>
                    <h2 className="text-2xl font-bold mt-1">{formatDateHeader(selectedDate)}</h2>
                  </div>
                  <div className="p-2 bg-white/10 rounded-full"><BarChart3 size={20} className="text-white"/></div>
               </div>
               
               {(() => {
                  const { income, expense } = getDayStats(groupedTransactions[0][1]);
                  const maxVal = Math.max(income, expense, 1);
                  return (
                    <div className="space-y-3">
                       <div>
                          <div className="flex justify-between text-sm mb-1">
                             <span className="text-green-400 font-medium">{t.income}</span>
                             <span className="font-bold">+¥{income.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 rounded-full" style={{ width: `${(income/maxVal)*100}%` }}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between text-sm mb-1">
                             <span className="text-red-400 font-medium">{t.expense}</span>
                             <span className="font-bold">-¥{expense.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                             <div className="h-full bg-red-500 rounded-full" style={{ width: `${(expense/maxVal)*100}%` }}></div>
                          </div>
                       </div>
                    </div>
                  );
               })()}
            </Card>
         </div>
      )}

      <div className="space-y-8 px-1">
        {groupedTransactions.map(([date, txs], groupIndex) => {
           const { income, expense } = getDayStats(txs);
           
           return (
             <div key={date} className={`space-y-3 animate-fade-in-up`} style={{ animationDelay: `${groupIndex * 100}ms` }}>
               {!selectedDate && (
                 <div className="sticky top-[68px] z-20 glass-morphism py-2 px-3 rounded-lg flex justify-between items-end border-b border-gray-100 dark:border-white/5 mx-1 shadow-sm">
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">{formatDateHeader(date)}</h3>
                    </div>
                    <div className="text-xs font-mono text-gray-500 flex gap-3">
                       {income > 0 && <span className="text-green-600">+{income}</span>}
                       {expense > 0 && <span className="text-red-500">-{expense}</span>}
                    </div>
                 </div>
               )}

               <div className="grid gap-3">
                 {txs.map((tx, idx) => {
                   const category = data.categories.find(c => c.id === tx.categoryId);
                   const account = data.accounts.find(a => a.id === tx.accountId);
                   const isExpense = tx.type === TransactionType.EXPENSE;
                   
                   return (
                     <Card 
                       key={tx.id} 
                       className="active:scale-[0.98] transition-all hover:shadow-lg border border-transparent hover:border-gray-100 dark:hover:border-white/10 py-4 px-4 hover:-translate-y-0.5"
                       onClick={() => {}}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${category?.color.replace('text-', 'bg-').replace('500', '100') || 'bg-gray-100'} dark:bg-opacity-20`}>
                              <span className={`text-xl ${category?.color} drop-shadow-sm`}>
                                {renderCategoryIcon(category, 20)}
                              </span>
                           </div>
                           <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                              <div className="flex justify-between items-start">
                                 <span className="font-bold text-base text-gray-900 dark:text-white truncate pr-2">{category?.name}</span>
                                 <span className={`text-lg font-bold font-mono tracking-tight shrink-0 ${isExpense ? 'text-gray-900 dark:text-gray-100' : 'text-green-500'}`}>
                                    {isExpense ? '-' : '+'}{tx.amount.toLocaleString()}
                                 </span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-2 text-xs text-gray-500 overflow-hidden">
                                     <span className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1 shrink-0">
                                       <CreditCard size={10} />{account?.name}
                                     </span>
                                     {tx.note && <span className="truncate border-l border-gray-300 dark:border-gray-700 pl-2">{tx.note}</span>}
                                 </div>
                                 <span className="text-[10px] text-gray-400 font-medium shrink-0">
                                    {tx.attachmentUrl && <ImageIcon size={12} />}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </Card>
                   );
                 })}
               </div>
             </div>
           );
        })}

        {data.transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
             <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full"><ListIcon size={32} /></div>
             <p>{t.noTx}</p>
          </div>
        )}
        
        {selectedDate && groupedTransactions.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p>{t.noData} for {selectedDate}</p>
           </div>
        )}
      </div>
    </div>
  );
};

const TransactionForm = ({ isOpen, onClose, data, onUpdate, lang }: { isOpen: boolean, onClose: () => void, data: AppData, onUpdate: (d: AppData) => void, lang: Language }) => {
  const t = TEXTS[lang].tx;
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(data.categories[0]?.id || '');
  const [accountId, setAccountId] = useState(data.accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!amount || !categoryId || !accountId) return;
    
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      currency: data.settings.currency,
      type,
      date,
      categoryId,
      accountId,
      note,
      isRecurring: false
    };

    onUpdate({
      ...data,
      transactions: [newTx, ...data.transactions]
    });
    onClose();
    setAmount('');
    setNote('');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.new}>
      <div className="space-y-4">
        <div className="flex bg-gray-100 dark:bg-white/10 p-1 rounded-xl">
           <button onClick={() => setType(TransactionType.EXPENSE)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-600 shadow-sm text-red-500' : 'text-gray-400'}`}>{t.expense}</button>
           <button onClick={() => setType(TransactionType.INCOME)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-gray-600 shadow-sm text-green-500' : 'text-gray-400'}`}>{t.income}</button>
        </div>

        <Input label={t.amount} type="number" value={amount} onChange={e => setAmount(e.target.value)} autoFocus className="text-2xl font-mono font-bold" />
        
        <Select label={t.category} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
           {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>

        <Select label={t.account} value={accountId} onChange={e => setAccountId(e.target.value)}>
           {data.accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Select>

        <Input label={t.date} type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Input label={t.note} value={note} onChange={e => setNote(e.target.value)} placeholder={t.addNote} />

        <Button onClick={handleSubmit} className={type === TransactionType.EXPENSE ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}>
          {t.save}
        </Button>
      </div>
    </Modal>
  );
};

const CycleSettings = ({ isOpen, onClose, data, onUpdate, lang }: { isOpen: boolean, onClose: () => void, data: AppData, onUpdate: (d: AppData) => void, lang: Language }) => {
  const t = TEXTS[lang].cycle;
  const [rules, setRules] = useState<LivingFeeRule[]>(data.settings.livingFeeRules || []);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [amount, setAmount] = useState<string>('');

  const handleAddRule = () => {
    if (!amount) return;
    const amt = parseFloat(amount);
    const newRules = [...rules.filter(r => r.day !== selectedDay), { day: selectedDay, amount: amt }];
    setRules(newRules);
    setAmount('');
  };

  const handleSave = () => {
    onUpdate({
      ...data,
      settings: { ...data.settings, livingFeeRules: rules }
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
       <div className="space-y-4">
          <p className="text-xs text-gray-400">{t.desc}</p>
          
          <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
             <div className="flex justify-between items-center mb-4">
                <span className="font-bold">{t.setAmount} {selectedDay}</span>
             </div>
             <div className="flex gap-2">
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                <Button onClick={handleAddRule} className="w-auto">OK</Button>
             </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
             {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const rule = rules.find(r => r.day === day);
                return (
                  <button 
                    key={day} 
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs border transition-all
                      ${selectedDay === day ? 'border-ios-blue ring-2 ring-ios-blue ring-opacity-50' : 'border-gray-200 dark:border-white/10'}
                      ${rule ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-white dark:bg-white/5'}
                    `}
                  >
                     <span className="font-bold">{day}</span>
                     {rule && <span className="text-[8px]">¥{rule.amount}</span>}
                  </button>
                );
             })}
          </div>

          <Button onClick={handleSave}>{t.save}</Button>
       </div>
    </Modal>
  );
};

const CategorySettingsModal = ({ isOpen, onClose, data, onUpdate, lang }: { isOpen: boolean, onClose: () => void, data: AppData, onUpdate: (d: AppData) => void, lang: Language }) => {
  const t = TEXTS[lang].cat;
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('utensils');
  const [color, setColor] = useState('text-blue-500');

  const handleAdd = () => {
    if(!name) return;
    const newCat: Category = {
       id: crypto.randomUUID(),
       name,
       icon,
       color
    };
    onUpdate({ ...data, categories: [...data.categories, newCat] });
    setName('');
  };

  const handleDelete = (id: string) => {
     if(confirm('Delete category?')) {
        onUpdate({ ...data, categories: data.categories.filter(c => c.id !== id) });
     }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
       <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
             <Input label={t.name} value={name} onChange={e => setName(e.target.value)} />
             <Select label={t.icon} value={icon} onChange={e => setIcon(e.target.value)}>
                {Object.keys(ICON_MAP).map(k => <option key={k} value={k}>{k}</option>)}
             </Select>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
             {COLOR_PALETTE.map(c => (
                <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full shrink-0 ${c.replace('text-', 'bg-')} ${color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} />
             ))}
          </div>
          <Button onClick={handleAdd}>{t.add}</Button>
          <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
             {data.categories.map(c => (
                <div key={c.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                   <div className="flex items-center gap-2">
                      <span className={c.color}>{renderCategoryIcon(c)}</span>
                      <span>{c.name}</span>
                   </div>
                   <button onClick={() => handleDelete(c.id)} className="text-red-500"><Trash2 size={16}/></button>
                </div>
             ))}
          </div>
       </div>
    </Modal>
  );
};

const SettingsView = ({ 
  data, 
  onUpdate, 
  config, 
  onLogout, 
  lang, 
  setLang, 
  toggleDarkMode, 
  darkMode 
}: { 
  data: AppData, 
  onUpdate: (d: AppData) => void, 
  config: GitHubConfig | null, 
  onLogout: () => void, 
  lang: Language, 
  setLang: (l: Language) => void,
  toggleDarkMode: () => void,
  darkMode: boolean
}) => {
  const t = TEXTS[lang].settings;
  const [yearlyBudget, setYearlyBudget] = useState(data.settings.yearlyBudget?.toString() || '');
  const [monthlyBudget, setMonthlyBudget] = useState(data.settings.monthlyBudget?.toString() || '');
  const [dailyBudget, setDailyBudget] = useState(data.settings.dailyBudget?.toString() || '');
  const [isSaved, setIsSaved] = useState(false);
  const [showCategorySettings, setShowCategorySettings] = useState(false);

  const handleSave = () => {
     onUpdate({
        ...data,
        settings: {
           ...data.settings,
           language: lang,
           darkMode: darkMode,
           yearlyBudget: parseFloat(yearlyBudget) || 0,
           monthlyBudget: parseFloat(monthlyBudget) || 0,
           dailyBudget: parseFloat(dailyBudget) || 0
        }
     });
     setIsSaved(true);
     setTimeout(() => setIsSaved(false), 2000);
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const success = await GitHubService.importLocalData(e.target.files[0]);
      if (success) {
        alert("Data imported successfully! Reloading...");
        window.location.reload();
      } else {
        alert("Failed to import data. Invalid JSON.");
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in-up">
       <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.account}</h3>
          <Card className="p-0 overflow-hidden">
             <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-white/5">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                  {config?.token === 'local' ? <HardDrive size={24}/> : <Github size={24} />}
                </div>
                <div>
                   <p className="text-sm text-gray-500">{t.connectedAs}</p>
                   <p className="font-bold text-lg">{config?.token === 'local' ? 'Local Device' : config?.owner}</p>
                </div>
             </div>
             <div className="p-4 bg-gray-50 dark:bg-white/5 flex justify-between items-center">
                 <span className="text-sm text-gray-500">{t.repo}: <span className="font-mono text-black dark:text-white">{config?.repo}</span></span>
                 <button onClick={onLogout} className="text-red-500 text-sm font-semibold flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors"><LogOut size={14}/> {t.logout}</button>
             </div>
          </Card>
       </section>

       {config?.token === 'local' && (
         <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.data}</h3>
            <Card className="p-4 space-y-3">
               <Button onClick={GitHubService.exportLocalData} variant="secondary">
                  <Download size={18} /> {t.export}
               </Button>
               <div className="relative">
                 <Button variant="secondary" className="opacity-80">
                    <Upload size={18} /> {t.import}
                 </Button>
                 <input type="file" accept=".json" onChange={handleImport} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
            </Card>
         </section>
       )}

       <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.appearance}</h3>
          <Card className="divide-y divide-gray-100 dark:divide-white/5 p-0 overflow-hidden">
             <div className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg text-white shadow-md shadow-blue-500/30"><Moon size={18}/></div>
                    <span className="font-medium">{t.darkMode}</span>
                 </div>
                 <button onClick={toggleDarkMode} className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${darkMode ? 'translate-x-5.5 left-[1px]' : 'left-0.5'}`} />
                 </button>
             </div>
             <div className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg text-white shadow-md shadow-purple-500/30"><Languages size={18}/></div>
                    <span className="font-medium">{t.language}</span>
                 </div>
                 <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                    <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs rounded-md transition-all ${lang === 'en' ? 'bg-white dark:bg-gray-600 shadow-sm font-bold' : 'text-gray-400'}`}>EN</button>
                    <button onClick={() => setLang('zh')} className={`px-3 py-1 text-xs rounded-md transition-all ${lang === 'zh' ? 'bg-white dark:bg-gray-600 shadow-sm font-bold' : 'text-gray-400'}`}>中文</button>
                 </div>
             </div>
          </Card>
       </section>

       <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.categories}</h3>
          <Card className="p-4">
             <Button variant="secondary" onClick={() => setShowCategorySettings(true)}>
               <Tags size={18} /> {t.manageCategories}
             </Button>
          </Card>
       </section>

       <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.budget}</h3>
          <p className="text-xs text-gray-400 mb-3 ml-1">{t.budgetDesc}</p>
          <Card className="space-y-4 p-6">
             <Input label={t.yearlyBudget} type="number" value={yearlyBudget} onChange={e => setYearlyBudget(e.target.value)} placeholder="0.00" />
             <Input label={t.monthlyBudget} type="number" value={monthlyBudget} onChange={e => setMonthlyBudget(e.target.value)} placeholder="0.00" />
             <Input label={t.dailyBudget} type="number" value={dailyBudget} onChange={e => setDailyBudget(e.target.value)} placeholder="0.00" />
             <Button onClick={handleSave} className={isSaved ? 'bg-green-500 hover:bg-green-600' : ''}>
                {isSaved ? <Check size={20}/> : <Settings size={20}/>} {isSaved ? t.saved : t.save}
             </Button>
          </Card>
       </section>
       
       <CategorySettingsModal isOpen={showCategorySettings} onClose={() => setShowCategorySettings(false)} data={data} onUpdate={onUpdate} lang={lang} />
    </div>
  );
};

const App = () => {
  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('dashboard');
  const [projectDetailId, setProjectDetailId] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('zh');
  const [darkMode, setDarkMode] = useState(false);
  const [showCycleSettings, setShowCycleSettings] = useState(false);
  const [showSuruTest, setShowSuruTest] = useState(false);
  const [showTxForm, setShowTxForm] = useState(false);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    const init = async () => {
       const storedConfig = localStorage.getItem('zenledger_config');
       if (storedConfig) {
          const cfg = JSON.parse(storedConfig);
          setConfig(cfg);
          setLoading(true);
          const res = await GitHubService.getLedgerData(cfg);
          if (res) {
             setData(res.data);
             if(res.data.settings?.language) setLang(res.data.settings.language);
             if(res.data.settings?.darkMode !== undefined) setDarkMode(res.data.settings.darkMode);
          }
          setLoading(false);
       }
    };
    init();
  }, []);

  const handleLogin = async (cfg: GitHubConfig) => {
     setConfig(cfg);
     localStorage.setItem('zenledger_config', JSON.stringify(cfg));
     setLoading(true);
     const res = await GitHubService.getLedgerData(cfg);
     if (res) {
        setData(res.data);
     } else {
        const initialData: AppData = {
           transactions: [],
           categories: DEFAULT_CATEGORIES,
           accounts: DEFAULT_ACCOUNTS,
           settings: { currency: 'CNY', darkMode: false, language: 'zh' }
        };
        setData(initialData);
        await GitHubService.saveLedgerData(cfg, initialData);
     }
     setLoading(false);
  };

  const handleUpdateData = async (newData: AppData) => {
     setData(newData);
     if (config) {
        await GitHubService.saveLedgerData(config, newData);
     }
  };
  
  const handleLogout = () => {
    setConfig(null);
    setData(null);
    localStorage.removeItem('zenledger_config');
    localStorage.removeItem('zenledger_local_data');
  };

  const renderContent = () => {
    if (!data) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-ios-blue" size={32} /></div>;

    switch(view) {
       case 'dashboard': 
          return <Dashboard data={data} isDesktop={isDesktop} lang={lang} onOpenCycleSettings={() => setShowCycleSettings(true)} />;
       case 'transactions':
          return <TransactionList data={data} isDesktop={isDesktop} lang={lang} />;
       case 'projects':
          if (projectDetailId) {
             return <ProjectDetail data={data} onUpdate={handleUpdateData} lang={lang} categoryId={projectDetailId} onBack={() => setProjectDetailId(null)} />;
          }
          return <ProjectList data={data} onUpdate={handleUpdateData} lang={lang} setViewDetail={setProjectDetailId} />;
       case 'ai':
          return <AIAnalysisView data={data} lang={lang} onUpdate={handleUpdateData} />;
       case 'settings':
          return <SettingsView 
            data={data} 
            onUpdate={handleUpdateData} 
            config={config} 
            onLogout={handleLogout} 
            lang={lang} 
            setLang={setLang}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            darkMode={darkMode}
          />;
       default:
          return null;
    }
  };

  if (!config) {
     return <Onboarding onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <div className={`min-h-screen bg-ios-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 ${isDesktop ? 'flex' : 'pb-20'}`}>
       
       {isDesktop && (
         <div className="w-64 border-r border-gray-200 dark:border-white/5 p-6 flex flex-col justify-between sticky top-0 h-screen">
            <div className="space-y-8">
               <h1 className="text-2xl font-black tracking-tight flex items-center gap-2"><Wallet className="text-ios-blue" /> ZenLedger</h1>
               <nav className="space-y-2">
                  <NavItem icon={LayoutGrid} label={TEXTS[lang].nav.dashboard} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                  <NavItem icon={ListIcon} label={TEXTS[lang].nav.transactions} active={view === 'transactions'} onClick={() => setView('transactions')} />
                  <NavItem icon={FolderTree} label={TEXTS[lang].nav.projects} active={view === 'projects'} onClick={() => setView('projects')} />
                  <NavItem icon={Sparkles} label={TEXTS[lang].nav.insights} active={view === 'ai'} onClick={() => setView('ai')} />
                  <NavItem icon={Settings} label={TEXTS[lang].nav.settings} active={view === 'settings'} onClick={() => setView('settings')} />
               </nav>
            </div>
            <div className="text-xs text-gray-400 text-center cursor-pointer hover:text-gray-600" onClick={() => setShowSuruTest(true)}>
               v2.0.0 (Beta)
            </div>
         </div>
       )}

       <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
          {!isDesktop && (
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">{TEXTS[lang].nav[view as keyof typeof TEXTS['en']['nav']]}</h1>
                <div className="flex gap-2">
                   <button onClick={() => setShowSuruTest(true)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10"><Zap size={20} /></button>
                </div>
             </div>
          )}
          
          {renderContent()}
       </main>

       {!isDesktop && (
         <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 px-6 py-2 flex justify-between items-end z-40 pb-safe">
            <NavItem icon={LayoutGrid} label={TEXTS[lang].nav.dashboard} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavItem icon={ListIcon} label={TEXTS[lang].nav.transactions} active={view === 'transactions'} onClick={() => setView('transactions')} />
            <div className="relative -top-6">
               <button onClick={() => setShowTxForm(true)} className="w-14 h-14 bg-ios-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40 transform transition-transform active:scale-95">
                  <Plus size={28} />
               </button>
            </div>
            <NavItem icon={FolderTree} label={TEXTS[lang].nav.projects} active={view === 'projects'} onClick={() => setView('projects')} />
            <NavItem icon={Settings} label={TEXTS[lang].nav.settings} active={view === 'settings'} onClick={() => setView('settings')} />
         </div>
       )}

       {isDesktop && (
          <div className="fixed bottom-8 right-8">
            <button onClick={() => setShowTxForm(true)} className="w-14 h-14 bg-ios-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40 transform transition-transform hover:scale-105">
               <Plus size={28} />
            </button>
          </div>
       )}

       {data && (
         <CycleSettings isOpen={showCycleSettings} onClose={() => setShowCycleSettings(false)} data={data} onUpdate={handleUpdateData} lang={lang} />
       )}

       {data && (
         <TransactionForm isOpen={showTxForm} onClose={() => setShowTxForm(false)} data={data} onUpdate={handleUpdateData} lang={lang} />
       )}

       {showSuruTest && data && (
          <Modal isOpen={true} onClose={() => setShowSuruTest(false)} title="Test Mode">
             <SuruTest data={data} onUpdate={handleUpdateData} onClose={() => setShowSuruTest(false)} lang={lang} />
          </Modal>
       )}

    </div>
  );
};

export default App;
