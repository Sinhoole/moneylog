import React, { useState, useMemo } from 'react';
import { AppData, Project, ProjectNode, Transaction, Category, TransactionType } from '../types';
import { Card, Button, Modal, Input } from './UI';
import { 
  FolderTree, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical, 
  Trash2, 
  RefreshCw,
  GripVertical,
  Layers,
  FolderOpen,
  Folder,
  CheckCircle2,
  Circle,
  CornerDownRight
} from 'lucide-react';

// --- Types & Interfaces ---
interface ProjectViewsProps {
  data: AppData;
  onUpdate: (newData: AppData) => void;
  lang: 'en' | 'zh';
  onNavigateToDetail?: (categoryId: string) => void;
  detailCategoryId?: string | null;
  onBack?: () => void;
}

const TEXTS = {
  en: {
    title: "Project Trees",
    addProject: "Add Category to Project",
    emptyList: "No project categories yet.",
    emptyListSub: "Click above to start managing hierarchies.",
    selectCat: "Select Categories",
    syncBills: "Sync Bills",
    syncDesc: "Import unlinked bills to tree",
    synced: "Synced",
    editNode: "Edit Node",
    deleteNode: "Remove from Tree",
    nodeName: "Node Name (Optional)",
    dragHint: "Drag to Group",
    root: "Project Root",
    manualLink: "Link to Parent",
    unlink: "Unlink",
    waiting: "Waiting to link...",
    hierarchySettings: "Hierarchy",
    editMode: "Edit Mode",
    addHead: "Add Head",
    cancel: "Done",
    headNamePlaceholder: "Enter Group Name (e.g. 'Game Collection')",
    createHead: "Create Group",
    selectItems: "Select items to group",
    group: "Group",
    total: "Total"
  },
  zh: {
    title: "项目树",
    addProject: "把分类添加进项目",
    emptyList: "暂无项目分类",
    emptyListSub: "点击添加开启层级管理",
    selectCat: "选择分类",
    syncBills: "同步账单",
    syncDesc: "将未关联账单挂载到主干",
    synced: "已同步",
    editNode: "编辑节点",
    deleteNode: "移除节点 (保留账单)",
    nodeName: "节点别名 (可选)",
    dragHint: "拖拽归类",
    root: "项目根节点",
    manualLink: "关联到此节点",
    unlink: "取消关联",
    waiting: "待关联...",
    hierarchySettings: "层级设置",
    editMode: "编辑模式",
    addHead: "增加头",
    cancel: "完成",
    headNamePlaceholder: "输入头节点名称 (如 '黑神话')",
    createHead: "创建头节点",
    selectItems: "请选择要归类的节点",
    group: "头节点",
    total: "总计"
  }
};

// --- Project List View ---
export const ProjectList: React.FC<ProjectViewsProps & { setViewDetail: (id: string) => void }> = ({ 
  data, onUpdate, lang, setViewDetail 
}) => {
  const t = TEXTS[lang];
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const activeProjectIds = new Set((data.projects || []).map(p => p.categoryId));
  const availableCategories = data.categories;

  const handleAddProjects = () => {
    const newProjects: Project[] = selectedCats.map(catId => ({
      categoryId: catId,
      createdAt: new Date().toISOString()
    }));
    
    // Merge avoiding duplicates
    const existingProjects = data.projects || [];
    const finalProjects = [...existingProjects];
    newProjects.forEach(np => {
      if (!existingProjects.some(ep => ep.categoryId === np.categoryId)) {
        finalProjects.push(np);
      }
    });

    onUpdate({ ...data, projects: finalProjects });
    setShowAddModal(false);
    setSelectedCats([]);
  };

  const toggleCatSelect = (id: string) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter(c => c !== id));
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderTree /> {t.title}
        </h2>
        <p className="text-indigo-100 text-sm mt-1 mb-4 opacity-90">
          Visualise your spending flow hierarchically.
        </p>
        <Button onClick={() => setShowAddModal(true)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
          <Plus size={18} /> {t.addProject}
        </Button>
      </Card>

      <div className="grid gap-3">
        {(data.projects || []).map(proj => {
          const cat = data.categories.find(c => c.id === proj.categoryId);
          if (!cat) return null;
          
          // Count nodes
          const nodeCount = (data.projectNodes || []).filter(n => {
            const tx = data.transactions.find(t => t.id === n.transactionId);
            return tx && tx.categoryId === cat.id;
          }).length;

          return (
            <Card key={proj.categoryId} onClick={() => setViewDetail(proj.categoryId)} className="flex items-center justify-between cursor-pointer active:scale-98 transition-transform">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 ${cat.color}`}>
                   <span className="text-lg font-bold">{cat.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold">{cat.name}</h3>
                  <p className="text-xs text-gray-400">{nodeCount} Nodes</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300" />
            </Card>
          );
        })}

        {(!data.projects || data.projects.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p>{t.emptyList}</p>
            <p className="text-xs mt-2">{t.emptyListSub}</p>
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t.addProject}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {availableCategories.map(cat => {
              const isActive = activeProjectIds.has(cat.id);
              const isSelected = selectedCats.includes(cat.id);
              if (isActive) return null;

              return (
                <div 
                  key={cat.id}
                  onClick={() => toggleCatSelect(cat.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-ios-blue bg-blue-50 dark:bg-blue-900/20 text-ios-blue' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  <div className={`w-3 h-3 rounded-full border ${isSelected ? 'bg-ios-blue border-ios-blue' : 'border-gray-300'}`} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              );
            })}
          </div>
          <Button onClick={handleAddProjects} disabled={selectedCats.length === 0}>
            {t.addProject}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// --- Project Detail Tree View ---
export const ProjectDetail: React.FC<ProjectViewsProps & { categoryId: string, isPickerMode?: boolean, onPickNode?: (nodeId: string | null) => void }> = ({ 
  data, onUpdate, lang, categoryId, onBack, isPickerMode, onPickNode 
}) => {
  const t = TEXTS[lang];
  const category = data.categories.find(c => c.id === categoryId);
  
  // State
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set());
  const [showHeadNameModal, setShowHeadNameModal] = useState(false);
  const [headName, setHeadName] = useState('');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Filter relevant data
  const projectNodes = data.projectNodes || [];
  const relevantNodes = projectNodes.filter(n => {
    if (n.type === 'TRANSACTION') {
       const tx = data.transactions.find(t => t.id === n.transactionId);
       return tx && tx.categoryId === categoryId;
    }
    return true; // We assume Groups created here are valid or we filter them if we add projectId later
  });

  const linkedTxIds = new Set(relevantNodes.filter(n => n.type === 'TRANSACTION').map(n => n.transactionId));
  const unlinkedTransactions = data.transactions.filter(t => 
    t.categoryId === categoryId && !linkedTxIds.has(t.id)
  );

  const rootNodes = relevantNodes.filter(n => n.parentId === null).sort((a, b) => a.order - b.order);

  // --- Financial Calculations ---
  // Memoize this calculation for performance
  const nodeTotals = useMemo(() => {
     const totals: Record<string, number> = {};
     
     // Recursive helper
     const calculate = (nodeId: string): number => {
       if (totals[nodeId] !== undefined) return totals[nodeId];
       
       const node = projectNodes.find(n => n.id === nodeId);
       if (!node) return 0;

       let sum = 0;
       if (node.type === 'TRANSACTION') {
          const tx = data.transactions.find(t => t.id === node.transactionId);
          if (tx) {
             sum = tx.type === TransactionType.EXPENSE ? -tx.amount : tx.amount;
          }
       } else {
          const children = projectNodes.filter(n => n.parentId === nodeId);
          sum = children.reduce((acc, child) => acc + calculate(child.id), 0);
       }
       
       totals[nodeId] = sum;
       return sum;
     };

     relevantNodes.forEach(n => calculate(n.id));
     return totals;
  }, [projectNodes, data.transactions, relevantNodes]);


  // Sync Logic
  const handleSync = () => {
    if (unlinkedTransactions.length === 0) return;
    
    const newNodes: ProjectNode[] = unlinkedTransactions.map((tx, idx) => ({
      id: crypto.randomUUID(),
      type: 'TRANSACTION',
      transactionId: tx.id,
      parentId: null,
      order: Date.now() + idx
    }));

    onUpdate({
      ...data,
      projectNodes: [...(data.projectNodes || []), ...newNodes]
    });
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedNodeIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedNodeIds(newSet);
  };

  const handleCreateHead = () => {
    if (!headName.trim() || selectedNodeIds.size === 0) return;

    const newHeadNode: ProjectNode = {
      id: crypto.randomUUID(),
      type: 'GROUP',
      name: headName,
      parentId: null,
      order: Date.now() 
    };

    const updatedNodes = (data.projectNodes || []).map(n => {
      if (selectedNodeIds.has(n.id)) {
        return { ...n, parentId: newHeadNode.id };
      }
      return n;
    });

    onUpdate({
      ...data,
      projectNodes: [...updatedNodes, newHeadNode]
    });

    setHeadName('');
    setShowHeadNameModal(false);
    setSelectedNodeIds(newSet => { newSet.clear(); return newSet; });
    setIsEditMode(false);
    setExpandedGroupIds(prev => new Set(prev).add(newHeadNode.id)); // Auto expand new head
  };

  const toggleGroupExpand = (id: string) => {
    const newSet = new Set(expandedGroupIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedGroupIds(newSet);
  };

  const handleRemoveNode = (node: ProjectNode) => {
    const updatedNodes = (data.projectNodes || []).filter(n => n.id !== node.id).map(n => {
       if (n.parentId === node.id) {
         return { ...n, parentId: null };
       }
       return n;
    });
    onUpdate({ ...data, projectNodes: updatedNodes });
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    if (!isEditMode) return;
    setDraggedNodeId(nodeId);
    e.dataTransfer.setData('text/plain', nodeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetNode: ProjectNode) => {
    if (!isEditMode || !draggedNodeId) return;
    // Only allow dropping on Groups
    if (targetNode.type !== 'GROUP') return;
    if (draggedNodeId === targetNode.id) return;
    
    // Prevent dragging parent into child (Circular Check)
    const isDescendant = (parent: string, child: string): boolean => {
      const childNode = relevantNodes.find(n => n.id === child);
      if (!childNode) return false;
      if (childNode.parentId === parent) return true;
      if (childNode.parentId === null) return false;
      return isDescendant(parent, childNode.parentId);
    };
    if (isDescendant(draggedNodeId, targetNode.id)) return;

    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent, targetNode: ProjectNode) => {
    e.preventDefault();
    if (!draggedNodeId || targetNode.type !== 'GROUP') return;

    const updatedNodes = (data.projectNodes || []).map(n => 
      n.id === draggedNodeId ? { ...n, parentId: targetNode.id } : n
    );
    
    onUpdate({ ...data, projectNodes: updatedNodes });
    setDraggedNodeId(null);
    setExpandedGroupIds(prev => new Set(prev).add(targetNode.id)); // Auto expand target
  };

  if (!category) return null;

  const renderNodeContent = (node: ProjectNode, isLeft: boolean) => {
    const isSelected = selectedNodeIds.has(node.id);
    const isGroup = node.type === 'GROUP';
    const tx = node.transactionId ? data.transactions.find(t => t.id === node.transactionId) : null;
    const totalAmount = nodeTotals[node.id] || 0;

    return (
      <div 
        draggable={isEditMode}
        onDragStart={(e) => handleDragStart(e, node.id)}
        onDragOver={(e) => handleDragOver(e, node)}
        onDrop={(e) => handleDrop(e, node)}
        className={`bg-white dark:bg-dark-card border rounded-2xl p-3 shadow-sm transition-all duration-200 relative
          ${isSelected ? 'border-ios-blue bg-blue-50 dark:bg-blue-900/20 ring-2 ring-ios-blue' : 'border-gray-100 dark:border-gray-800'}
          ${isPickerMode && !isGroup ? 'active:scale-95 cursor-pointer' : ''}
          ${isEditMode ? 'cursor-grab active:cursor-grabbing hover:border-ios-blue border-dashed' : ''}
          ${isEditMode && isGroup && draggedNodeId && draggedNodeId !== node.id ? 'hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''}
        `}
        onClick={() => {
          if (isEditMode) handleToggleSelect(node.id);
          if (isPickerMode && onPickNode) onPickNode(node.id);
          if (isGroup && !isEditMode && !isPickerMode) toggleGroupExpand(node.id);
        }}
      >
        {isEditMode && (
           <div className={`absolute -top-2 -right-2 bg-white dark:bg-black rounded-full p-0.5 border ${isSelected ? 'border-ios-blue' : 'border-gray-300'}`}>
              {isSelected ? <CheckCircle2 size={16} className="text-ios-blue fill-ios-blue/20" /> : <Circle size={16} className="text-gray-300" />}
           </div>
        )}

        {isGroup ? (
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 dark:bg-yellow-500/20 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
               {expandedGroupIds.has(node.id) ? <FolderOpen size={20} /> : <Folder size={20} />}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-gray-100">{node.name}</span>
                  <span className={`text-xs font-mono font-bold ${totalAmount < 0 ? 'text-gray-900 dark:text-gray-100' : 'text-green-500'}`}>
                    {totalAmount > 0 ? '+' : ''}{totalAmount}
                  </span>
               </div>
               <p className="text-[10px] text-gray-400">
                  {relevantNodes.filter(n => n.parentId === node.id).length} items
                  {isEditMode && <span className="ml-2 text-ios-blue">{t.dragHint}</span>}
               </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
             <span className="text-sm font-medium truncate">{tx?.note || 'No Note'}</span>
             <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-gray-400">{tx?.date}</span>
                <span className={`text-xs font-mono font-bold ${tx?.type === TransactionType.EXPENSE ? 'text-gray-900 dark:text-gray-100' : 'text-green-500'}`}>
                   {tx?.type === TransactionType.EXPENSE ? '-' : '+'}{tx?.amount}
                </span>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative bg-gray-50/50 dark:bg-black/20">
      {/* Header */}
      {!isPickerMode && (
        <div className="flex items-center justify-between px-4 py-3 bg-ios-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
             {onBack && (
               <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all">
                 <ChevronLeft size={24} className="text-ios-blue" />
               </button>
             )}
             <h2 className="text-xl font-bold">{category.name}</h2>
          </div>
          {isEditMode && <div className="text-xs text-ios-blue font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">{t.editMode}</div>}
        </div>
      )}

      {/* Main Tree View */}
      <div className="flex-1 overflow-y-auto pb-32 relative px-4 pt-6">
        
        {/* Top Actions Area (Moved from Bottom) */}
        {!isPickerMode && (
          <div className="flex gap-3 mb-10">
             {isEditMode ? (
               <>
                 <Button variant="secondary" onClick={() => { setIsEditMode(false); setSelectedNodeIds(new Set()); }}>
                   {t.cancel}
                 </Button>
                 {selectedNodeIds.size > 0 && (
                   <Button onClick={() => setShowHeadNameModal(true)}>
                     <FolderTree size={18} /> {t.addHead}
                   </Button>
                 )}
                 {selectedNodeIds.size > 0 && (
                   <Button variant="danger" className="w-auto" onClick={() => {
                      selectedNodeIds.forEach(id => {
                         const n = relevantNodes.find(rn => rn.id === id);
                         if(n) handleRemoveNode(n);
                      });
                      setSelectedNodeIds(new Set());
                   }}>
                     <Trash2 size={18} />
                   </Button>
                 )}
               </>
             ) : (
               <>
                 <Button onClick={handleSync} disabled={unlinkedTransactions.length === 0} className="flex-1 shadow-lg shadow-ios-blue/20">
                   <RefreshCw size={18} /> {t.syncBills} {unlinkedTransactions.length > 0 && `(${unlinkedTransactions.length})`}
                 </Button>
                 <Button variant="secondary" onClick={() => setIsEditMode(true)} className="flex-1 shadow-sm">
                   <Layers size={18} /> {t.hierarchySettings}
                 </Button>
               </>
             )}
          </div>
        )}

        {/* Central Trunk Line */}
        <div className="absolute left-1/2 top-24 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 -translate-x-1/2 rounded-full z-0"></div>

        {rootNodes.map((node, index) => {
           const isLeft = index % 2 === 0;
           const isGroup = node.type === 'GROUP';
           const isExpanded = expandedGroupIds.has(node.id);
           const children = relevantNodes.filter(n => n.parentId === node.id).sort((a, b) => a.order - b.order);

           return (
             <div key={node.id} className="mb-8 relative z-10">
                {/* Main Node Row */}
                <div className={`flex w-full items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                   {/* Content Side */}
                   <div className={`w-[45%] ${isLeft ? 'pr-6 text-right' : 'pl-6 text-left'}`}>
                      {renderNodeContent(node, isLeft)}
                   </div>
                   
                   {/* Center Dot */}
                   <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-ios-blue rounded-full border-4 border-ios-bg dark:border-dark-bg shadow-sm z-10"></div>
                   
                   {/* Empty Side */}
                   <div className="w-[45%]"></div>
                </div>

                {/* Expanded Children for Group */}
                {isGroup && isExpanded && children.length > 0 && (
                   <div className={`mt-4 flex flex-col gap-3 ${isLeft ? 'items-end pr-6' : 'items-start pl-6'}`}>
                      {children.map(child => (
                         <div key={child.id} className={`w-[45%] relative ${isLeft ? 'mr-[50%]' : 'ml-[50%]'}`}>
                           <div className={`w-full scale-90 opacity-90`}>
                             {renderNodeContent(child, isLeft)}
                           </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
           );
        })}

        {rootNodes.length === 0 && (
             <div className="text-gray-400 text-sm italic py-10 text-center relative z-10 bg-ios-bg dark:bg-dark-bg mx-auto w-fit px-4">
               {unlinkedTransactions.length > 0 ? t.syncDesc : "No nodes yet."}
             </div>
        )}
      </div>

      {/* Helper for Picker */}
      {isPickerMode && (
         <div className="absolute bottom-0 left-0 right-0 p-4 bg-ios-bg border-t dark:bg-dark-card z-30">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm text-ios-blue">{t.waiting}</span>
                <Button onClick={() => onPickNode && onPickNode(null)} className="w-auto text-xs py-1 px-3 bg-white shadow-sm text-black">
                   {t.root}
                </Button>
            </div>
         </div>
      )}

      {/* Head Name Modal */}
      <Modal isOpen={showHeadNameModal} onClose={() => setShowHeadNameModal(false)} title={t.addHead}>
         <div className="space-y-4">
            <p className="text-sm text-gray-500">{t.selectItems}: {selectedNodeIds.size}</p>
            <Input 
              value={headName} 
              onChange={e => setHeadName(e.target.value)} 
              placeholder={t.headNamePlaceholder} 
              autoFocus 
            />
            <Button onClick={handleCreateHead} disabled={!headName.trim()}>
               {t.createHead}
            </Button>
         </div>
      </Modal>
    </div>
  );
};
