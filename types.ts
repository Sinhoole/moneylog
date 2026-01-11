
export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export type Language = 'en' | 'zh';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentId?: string; // For 2-level structure
}

export interface Account {
  id: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH';
  currency: string;
  balance: number;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: TransactionType;
  date: string; // ISO String
  categoryId: string;
  accountId: string;
  note?: string;
  location?: GeoLocation;
  attachmentUrl?: string; // Path in repo or base64
  isRecurring?: boolean;
}

// New: Rule for financial cycle
export interface LivingFeeRule {
  day: number; // 1-31
  amount: number;
}

// New: Project Structure
export interface Project {
  categoryId: string; // The category this project tracks
  createdAt: string;
}

export interface ProjectNode {
  id: string;
  type: 'TRANSACTION' | 'GROUP'; // Distinguish between actual bills and folder headers
  name?: string; // For Group Nodes (Head Name)
  transactionId?: string; // For Transaction Nodes
  parentId: string | null; // null for top-level nodes on the main trunk
  order: number; // For manual ordering
}

export type AIProvider = 'deepseek' | 'siliconflow' | 'doubao' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

export interface AppData {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  settings: {
    currency: string;
    darkMode: boolean;
    language?: Language;
    livingFeeRules?: LivingFeeRule[]; 
    yearlyBudget?: number;
    monthlyBudget?: number;
    dailyBudget?: number;
    aiConfig?: AIConfig; // Stored user preference for AI
  };
  projects?: Project[]; // Active projects
  projectNodes?: ProjectNode[]; // The tree structure
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '餐饮', icon: 'utensils', color: 'text-orange-500' },
  { id: '2', name: '交通', icon: 'car', color: 'text-blue-500' },
  { id: '3', name: '居住', icon: 'home', color: 'text-purple-500' },
  { id: '4', name: '薪资', icon: 'banknote', color: 'text-green-500' },
  { id: '5', name: '购物', icon: 'shopping-bag', color: 'text-pink-500' },
  { id: '6', name: '娱乐', icon: 'film', color: 'text-indigo-500' },
  { id: '7', name: '学习', icon: 'book', color: 'text-yellow-500' }, 
  { id: '8', name: '游戏', icon: 'gamepad-2', color: 'text-purple-600' },
  { id: '9', name: '炒股', icon: 'trending-up', color: 'text-red-500' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: '1', name: '现金钱包', type: 'CASH', currency: 'CNY', balance: 0 },
  { id: '2', name: '微信/支付宝', type: 'CHECKING', currency: 'CNY', balance: 0 }, 
];