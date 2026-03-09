/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Filter, Home, Grid, Eye, Layout, FileText, Download, ShieldCheck, Users, Clock, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface ListItem {
  id: string;
  label: string;
  value: string;
  children?: ListItem[];
  isExpandable?: boolean;
  type?: 'date' | 'default';
}

const formatValue = (valStr: string, unit: string) => {
  if (!valStr.includes('亿元')) return valStr;
  const num = parseFloat(valStr.replace(/,/g, '').split(' ')[0]);
  if (isNaN(num)) return valStr;

  if (unit === '亿元') {
    return `${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 亿元`;
  } else if (unit === '万元') {
    const wan = num * 10000;
    return `${wan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 万元`;
  } else {
    const yuan = num * 100000000;
    return `${yuan.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} 元`;
  }
};

const MOCK_DATA: { source: ListItem[]; usage: ListItem[] } = {
  source: [
    {
      id: 's1',
      label: '自有资金',
      value: '25.00 亿元',
      isExpandable: true,
      children: [
        { id: 's1-1', label: '股东投资', value: '25.00 亿元' },
      ]
    },
    {
      id: 's2',
      label: '业务流入',
      value: '45.35 亿元',
      isExpandable: true,
      children: [
        { id: 's2-1', label: '投资流入', value: '10.00 亿元' },
        { id: 's2-2', label: '提供服务', value: '15.00 亿元' },
        { id: 's2-3', label: '销售产品', value: '18.00 亿元' },
        { id: 's2-4', label: '出租租赁', value: '2.35 亿元' },
      ]
    },
    {
      id: 's3',
      label: '外部融资',
      value: '20.50 亿元',
      isExpandable: true,
      children: [
        { id: 's3-1', label: '债券发行', value: '12.00 亿元', isExpandable: true },
        { id: 's3-2', label: '银行贷款', value: '8.50 亿元' },
      ]
    },
    {
      id: 's4',
      label: '客户资金',
      value: '13.00 亿元',
      isExpandable: true,
      children: [
        { id: 's4-1', label: '保证金', value: '5.00 亿元' },
        { id: 's4-2', label: '委托资金', value: '8.00 亿元' },
      ]
    },
  ],
  usage: [
    {
      id: 'u1',
      label: '业务投入',
      value: '12,842.17 亿元',
      isExpandable: true,
      children: [
        { id: 'u1-1', label: '主要业务投入', value: '12,840.94 亿元', isExpandable: true },
        { id: 'u1-2', label: '其他业务投入', value: '1.23 亿元', isExpandable: true },
      ]
    },
    {
      id: 'u2',
      label: '费用支出',
      value: '0.62 亿元',
      isExpandable: true,
      children: [
        {
          id: 'u2-1',
          label: '销售费用',
          value: '0.15 亿元',
          isExpandable: true,
          children: [
            { 
              id: 'u2-1-1', label: '招待费', value: '0.03 亿元', isExpandable: true,
              children: [{ id: 'u2-1-1-1', label: '机构/部门A', value: '0.03 亿元', isExpandable: true, children: [{ id: 'u2-1-1-1-1', label: '2025-04-10', value: '0.03 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-1-2', label: '业务宣传费', value: '0.04 亿元', isExpandable: true,
              children: [{ id: 'u2-1-2-1', label: '机构/部门B', value: '0.04 亿元', isExpandable: true, children: [{ id: 'u2-1-2-1-1', label: '2025-04-11', value: '0.04 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-1-3', label: '广告费', value: '0.05 亿元', isExpandable: true,
              children: [{ id: 'u2-1-3-1', label: '机构/部门C', value: '0.05 亿元', isExpandable: true, children: [{ id: 'u2-1-3-1-1', label: '2025-04-12', value: '0.05 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-1-4', label: '市内交通费', value: '0.01 亿元', isExpandable: true,
              children: [{ id: 'u2-1-4-1', label: '机构/部门D', value: '0.01 亿元', isExpandable: true, children: [{ id: 'u2-1-4-1-1', label: '2025-04-13', value: '0.01 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-1-5', label: '会议费', value: '0.01 亿元', isExpandable: true,
              children: [{ id: 'u2-1-5-1', label: '机构/部门E', value: '0.01 亿元', isExpandable: true, children: [{ id: 'u2-1-5-1-1', label: '2025-04-14', value: '0.01 亿元', type: 'date' }] }]
            },
            {
              id: 'u2-1-6',
              label: '咨询费',
              value: '0.01 亿元',
              isExpandable: true,
              children: [
                {
                  id: 'u2-1-6-1',
                  label: '固定交易部',
                  value: '0.01 亿元',
                  isExpandable: true,
                  children: [
                    { id: 'u2-1-6-1-1', label: '2025-04-15', value: '0.01 亿元', isExpandable: false, type: 'date' },
                  ]
                }
              ]
            },
          ]
        },
        {
          id: 'u2-2',
          label: '办公费用',
          value: '0.10 亿元',
          isExpandable: true,
          children: [
            { 
              id: 'u2-2-1', label: '租赁费', value: '0.05 亿元', isExpandable: true,
              children: [{ id: 'u2-2-1-1', label: '机构/部门F', value: '0.05 亿元', isExpandable: true, children: [{ id: 'u2-2-1-1-1', label: '2025-04-16', value: '0.05 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-2', label: '物业管理费', value: '0.02 亿元', isExpandable: true,
              children: [{ id: 'u2-2-2-1', label: '机构/部门G', value: '0.02 亿元', isExpandable: true, children: [{ id: 'u2-2-2-1-1', label: '2025-04-17', value: '0.02 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-3', label: '交易所会员年费', value: '0.00 亿元', isExpandable: true,
              children: [{ id: 'u2-2-3-1', label: '机构/部门H', value: '0.00 亿元', isExpandable: true, children: [{ id: 'u2-2-3-1-1', label: '2025-04-18', value: '0.00 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-4', label: '投资者保护基金', value: '0.00 亿元', isExpandable: true,
              children: [{ id: 'u2-2-4-1', label: '机构/部门I', value: '0.00 亿元', isExpandable: true, children: [{ id: 'u2-2-4-1-1', label: '2025-04-19', value: '0.00 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-5', label: '邮电通信费', value: '0.01 亿元', isExpandable: true,
              children: [{ id: 'u2-2-5-1', label: '机构/部门J', value: '0.01 亿元', isExpandable: true, children: [{ id: 'u2-2-5-1-1', label: '2025-04-20', value: '0.01 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-6', label: '办公用品', value: '0.01 亿元', isExpandable: true,
              children: [{ id: 'u2-2-6-1', label: '机构/部门K', value: '0.01 亿元', isExpandable: true, children: [{ id: 'u2-2-6-1-1', label: '2025-04-21', value: '0.01 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-7', label: '水电费', value: '0.01 亿元', isExpandable: true,
              children: [{ id: 'u2-2-7-1', label: '机构/部门L', value: '0.01 亿元', isExpandable: true, children: [{ id: 'u2-2-7-1-1', label: '2025-04-22', value: '0.01 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-8', label: '暖气费', value: '0.00 亿元', isExpandable: true,
              children: [{ id: 'u2-2-8-1', label: '机构/部门M', value: '0.00 亿元', isExpandable: true, children: [{ id: 'u2-2-8-1-1', label: '2025-04-23', value: '0.00 亿元', type: 'date' }] }]
            },
            { 
              id: 'u2-2-9', label: '诉讼费', value: '0.00 亿元', isExpandable: true,
              children: [{ id: 'u2-2-9-1', label: '机构/部门N', value: '0.00 亿元', isExpandable: true, children: [{ id: 'u2-2-9-1-1', label: '2025-04-24', value: '0.00 亿元', type: 'date' }] }]
            },
          ]
        },
        { id: 'u2-3', label: '薪酬费用', value: '0.25 亿元' },
        { id: 'u2-4', label: '缴税支出', value: '0.12 亿元' },
      ]
    },
    {
      id: 'u3',
      label: '资产购入',
      value: '0.00 亿元',
      isExpandable: true,
      children: [
        { id: 'u3-1', label: '车辆购入', value: '0.00 亿元' },
        { id: 'u3-2', label: '房屋购入', value: '0.00 亿元' },
        { id: 'u3-3', label: '设备投入', value: '0.00 亿元' },
      ]
    },
    {
      id: 'u4',
      label: '借款归还',
      value: '13.71 亿元',
      isExpandable: true,
      children: [
        { id: 'u4-1', label: '本金归还', value: '13.52 亿元', isExpandable: true },
        { id: 'u4-2', label: '利息归还', value: '0.18 亿元', isExpandable: true },
      ]
    },
    {
      id: 'u5',
      label: '客户资产管理',
      value: '0.00 亿元',
      isExpandable: true,
      children: [
        { id: 'u5-1', label: '代销业务管理', value: '0.00 亿元' },
        { id: 'u5-2', label: '资管产品投资', value: '0.00 亿元' },
        { id: 'u5-3', label: '证券交易服务', value: '0.00 亿元' },
      ]
    },
  ]
};

interface CollapsibleItemProps {
  item: ListItem;
  depth?: number;
  valueColor?: string;
  unit: string;
  onDateClick?: (item: ListItem) => void;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ item, depth = 0, valueColor = 'text-blue-600', unit, onDateClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (item.type === 'date' && onDateClick) {
      onDateClick(item);
    } else if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer active:bg-gray-50 transition-colors`}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-1">
          <span className={`text-[15px] ${depth === 0 ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
            {item.label}
          </span>
          {item.isExpandable && (
            isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[15px] font-medium ${valueColor} font-mono`}>{formatValue(item.value, unit)}</span>
          {!item.isExpandable && !hasChildren && <ChevronRight size={14} className="text-gray-300" />}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children?.map(child => (
              <CollapsibleItem 
                key={child.id} 
                item={child} 
                depth={depth + 1} 
                valueColor={valueColor} 
                unit={unit}
                onDateClick={onDateClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Components
const Modal = ({ isOpen, onClose, title, children, showClose = true }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; showClose?: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: 0 }} 
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex-1 text-center">{title}</h3>
          {showClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight className="rotate-90" size={20} />
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const ExpenseDetailView = ({ item, unit, onShowEmployee }: { item: ListItem | null; unit: string; onShowEmployee: () => void }) => {
  const details = [
    { label: '报销机构/部门', value: '固定交易部' },
    { label: '报销人', value: '姚XX' },
    { label: '交易日期', value: item?.label || '2025-04-15' },
    { label: '交易金额', value: item ? formatValue(item.value, unit) : '2,000,000.00 元' },
    { label: '交易用途', value: '咨询服务费' },
  ];

  return (
    <div className="p-6 space-y-4">
      {details.map((detail, i) => (
        <div key={i} className="flex justify-between items-center py-1">
          <span className="text-gray-500 text-[15px]">{detail.label}</span>
          <span className="text-gray-800 text-[15px] font-medium">{detail.value}</span>
        </div>
      ))}
      <div className="flex justify-between items-center py-1">
        <span className="text-gray-500 text-[15px]">关联数</span>
        <button onClick={onShowEmployee} className="text-blue-600 text-[15px] font-medium underline">3</button>
      </div>
    </div>
  );
};

const EmployeeBehaviorView = ({ onShowDecision }: { onShowDecision: () => void }) => {
  const [tab, setTab] = useState('费用报销');
  return (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <div className="p-6 flex items-start gap-4 border-b border-gray-50">
        <img src="https://picsum.photos/seed/avatar/100/100" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xl font-bold">姚XX</h4>
            <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">💬</div>
              华创易信
            </button>
          </div>
          <div className="text-sm text-gray-500 space-y-0.5">
            <p>部门：固定交易部 &nbsp; 职位：交易员</p>
            <p>手机号：17634021010 &nbsp; 17623431010</p>
            <p>邮箱：211313123@qq.com</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-gray-50">
        {['业绩表现', '费用报销'].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`py-4 px-4 text-[15px] font-medium relative ${tab === t ? 'text-gray-900' : 'text-gray-400'}`}
          >
            {t}
            {tab === t && <motion.div layoutId="empTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        ))}
        <div className="flex-1 flex justify-end items-center">
          <Filter size={16} className="text-gray-400 mr-1" />
          <span className="text-xs text-gray-400">今日</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-y-auto">
        {tab === '费用报销' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '出差次数', value: '10次' },
                { label: '用餐次数', value: '5次' },
                { label: '报销金额', value: '15587.94元', color: 'text-orange-500' },
                { label: '用餐金额', value: '1500元', color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color || 'text-gray-800'}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h5 className="font-bold mb-3">报销明细</h5>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3">报销日期</th>
                      <th className="p-3">费用类别</th>
                      <th className="p-3">报销金额</th>
                      <th className="p-3">报销事由</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[1, 2, 3].map(i => (
                      <tr key={i} className="bg-white">
                        <td className="p-3">2025-9-8</td>
                        <td className="p-3">差旅费</td>
                        <td className="p-3">2,911.26</td>
                        <td className="p-3 truncate max-w-[100px]">固定收益部-王XX...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '项目笔数', value: '51笔' },
                { label: '累计收益', value: '4万' },
                { label: '累计规模', value: '4.6亿', color: 'text-orange-500' },
                { label: '未还本金', value: '4.7亿', color: 'text-blue-600' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color || 'text-gray-800'}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h5 className="font-bold mb-3">交易记录</h5>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3">客户姓名</th>
                      <th className="p-3">证券名称</th>
                      <th className="p-3">业务类型</th>
                      <th className="p-3">交易日期</th>
                      <th className="p-3">成交金额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: '张三', sec: '通泰MTN001', type: '卖出', date: '2025.9.12', val: '2,419万', color: 'text-blue-600' },
                      { name: '李四', sec: '通泰MTN001', type: '买入', date: '2025.9.12', val: '502万', color: 'text-orange-500' },
                      { name: '王五', sec: '通泰MTN001', type: '卖出', date: '2025.9.12', val: '702万', color: 'text-blue-600' },
                    ].map((row, i) => (
                      <tr key={i} className="bg-white">
                        <td className="p-3">{row.name}</td>
                        <td className={`p-3 ${row.color}`}>{row.sec}</td>
                        <td className={`p-3 ${row.color}`}>{row.type}</td>
                        <td className={`p-3 ${row.color}`}>{row.date}</td>
                        <td className={`p-3 ${row.color}`}>{row.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DecisionProcessView = ({ onShowDetail }: { onShowDetail: (item: any) => void }) => {
  const items = [
    {
      id: '1',
      category: '事前申请',
      title: '关于客户秦正明两融利率调整的申请',
      status: '流程中',
      applicant: '李宜航',
      date: '2025-04-15',
      canView: true
    },
    {
      id: '2',
      category: '费用报销',
      title: '差旅费报销单-李宜航',
      status: '已完成',
      applicant: '李宜航',
      date: '2025-04-16',
      canView: true
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="p-4 space-y-3">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-50"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center flex-shrink-0">
              <Layout className="text-white" size={24} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-[#3B82F6] text-[15px] font-bold">
                {item.category}
              </div>
            </div>

            {/* Action */}
            <button 
              onClick={item.canView ? () => onShowDetail(item) : undefined}
              className={`flex items-center gap-1.5 text-sm font-medium ${item.canView ? 'text-[#3B82F6] active:opacity-70' : 'text-gray-300 cursor-not-allowed'}`}
            >
              <Eye size={16} />
              <span>查看</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DecisionDetailView = () => (
  <div className="p-6 space-y-8">
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-gray-400 text-sm whitespace-nowrap">标题：</span>
        <p className="text-gray-800 text-sm font-medium">关于客户秦正明两融利率调整的申请</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">部门：</span>
        <span className="text-gray-800 text-sm">固定交易部--财富管理组--后台组</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">申请人：</span>
        <span className="text-gray-800 text-sm">李宜航</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">日期：</span>
        <span className="text-gray-800 text-sm">2025-04-15</span>
      </div>
    </div>

    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h5 className="font-bold">流程状态</h5>
        <div className="text-xs">
          <span className="text-gray-400">流程中</span>
          <span className="mx-2 text-gray-200">|</span>
          <span className="text-blue-600">办结</span>
        </div>
      </div>
      
      <div className="space-y-0">
        {[
          { 
            label: '创建', 
            active: true, 
            approver: '李宜航', 
            time: '2025-04-15 09:00', 
            opinion: '发起申请' 
          },
          { 
            label: '分支机构负责人审批意见审批岗', 
            active: true, 
            approver: '张三', 
            time: '2025-04-15 14:30', 
            opinion: '同意，请信用交易部初审。' 
          },
          { 
            label: '信用交易部初审', 
            active: false, 
            approver: '待处理', 
            time: '-', 
            opinion: '-' 
          },
          { 
            label: '信用交易部副总审批', 
            active: false, 
            approver: '待处理', 
            time: '-', 
            opinion: '-' 
          },
        ].map((step, i, arr) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border z-10 ${step.active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                {step.active ? '✓' : i + 1}
              </div>
              {i < arr.length - 1 && (
                <div className={`w-[2px] flex-1 -my-1 ${step.active && arr[i+1].active ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pb-8 flex-1">
              <div className="flex justify-between items-start mb-1">
                <h6 className={`text-sm font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</h6>
                <span className="text-[10px] text-gray-400">{step.time}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">审批人：</span>
                  <span className="text-gray-700 font-medium">{step.approver}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-gray-400">审批意见：</span>
                  <span className="text-gray-600 italic">{step.opinion}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <h5 className="font-bold">申请内容</h5>
      <p className="text-xs text-gray-400">立项说明：</p>
      <div className="text-sm text-gray-600 leading-relaxed">
        <p className="font-bold mb-2">上级领导：</p>
        <p>福泉洒金路营业部客户秦正明，信用资金账号：998600051，客户信用账户 开户/激活时间为2025年09月17日，目前净资产662万元，融资负债472万元。该客户属于优质类客户，目前融资利率为8.35%，由于客户觉得目前利率较高，特向我司申请降低融资利率至年化4.8%（同时申请重置客户存续融资合约利率）。</p>
        <button className="text-blue-600 mt-1">展开</button>
      </div>
      <p className="font-bold text-sm">妥否，请领导批示！</p>
    </div>

    <div className="space-y-4">
      <h5 className="font-bold">相关附件</h5>
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">附件名称</th>
              <th className="p-3">大小</th>
              <th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="p-3">秦正明两融利率申请表.pdf</td>
              <td className="p-3">612kb</td>
              <td className="p-3">
                <div className="flex gap-2 text-blue-600">
                  <span>预览</span>
                  <span>下载</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ContractListView = ({ onShowDetail }: { onShowDetail: () => void }) => {
  const contracts = [
    { id: '1', name: '信息产品销售合同', date: '2025-01-15' },
    { id: '2', name: '技术服务框架协议', date: '2025-02-20' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      <div className="p-4 space-y-3">
        {contracts.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-50"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-[15px] font-bold truncate">
                {item.name}
              </div>
              <div className="text-gray-400 text-xs mt-1">
                签署日期：{item.date}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onShowDetail}
                className="flex items-center gap-1 text-blue-600 text-sm font-medium"
              >
                <Eye size={14} />
                <span>查看</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                <Download size={14} />
                <span>下载</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContractDetailView = () => (
  <div className="bg-[#F8F9FB] min-h-full pb-20">
    <div className="bg-white p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded font-bold">已签署</span>
        <span className="text-gray-300 text-[10px]">GILDATA-2025-0115</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">信息产品销售合同</h2>
    </div>

    <div className="p-4 space-y-4">
      {/* Basic Info */}
      <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="font-bold text-gray-900">基本信息</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs">甲方单位 (采购方)</p>
              <h4 className="font-bold text-gray-900 text-[15px]">华创证券有限责任公司</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-500 text-xs">经办人：蔡昭兴</span>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">华创易信</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Users className="text-gray-400" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs">乙方单位 (销售方)</p>
              <h4 className="font-bold text-gray-900 text-[15px]">上海恒生聚源数据服务有限公司</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-500 text-xs">联系人：王峰</span>
                <span className="text-blue-600 text-xs">021-60897887</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-gray-400 text-xs">合同金额 (含税)</p>
            <p className="text-lg font-bold text-gray-900 mt-1">¥ 245,800.00</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">签署日期</p>
            <p className="text-lg font-bold text-gray-900 mt-1">2025-01-15</p>
          </div>
        </div>
      </div>

      {/* Core Terms */}
      <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="font-bold text-gray-900">核心条款</h3>
        </div>
        
        <div className="space-y-6">
          {[
            { id: '01', text: '甲方购买聚源基础数据库及外汇交易中心数据服务，总价含税共计人民币245,800元。' },
            { id: '02', text: '服务期限自 2025 年 1 月 15 日至 2026 年 1 月 14 日，为期一年。' },
            { id: '03', text: '付款方式：甲方应于收到等额有效增值税发票后的 10 个工作日内支付全部款项。' },
            { id: '04', text: '质量保障：乙方保障财务数据错误率控制在万分之一范围内，并提供24小时故障响应服务。' },
          ].map((term) => (
            <div key={term.id} className="flex gap-3">
              <span className="text-blue-600 font-bold text-xs mt-0.5">{term.id}</span>
              <p className="text-gray-600 text-sm leading-relaxed">{term.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Box */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white space-y-2">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="text-sm font-bold">履约关键点</span>
        </div>
        <p className="text-xs opacity-90 leading-relaxed">
          请确保在收到乙方发票后 10 个工作日内完成付款流程，以免产生逾期违约金。
        </p>
      </div>

      {/* Attachments */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="font-bold text-gray-900">相关附件</h3>
        </div>
        
        {[
          { name: '信息产品销售合同_华创...', size: '4.2 MB', type: 'PDF' },
          { name: '附件1_信息产品清单.pdf', size: '1.5 MB', type: 'PDF' },
          { name: '乙方营业执照及开户许...', size: '890 KB', type: 'IMAGE' },
        ].map((file, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${file.type === 'IMAGE' ? 'bg-blue-50' : 'bg-red-50'}`}>
              <FileText className={file.type === 'IMAGE' ? 'text-blue-600' : 'text-red-500'} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{file.size} • {file.type}</p>
            </div>
            <div className="flex gap-3 text-gray-400">
              <Eye size={18} />
              <Download size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom Nav */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-10 py-3 flex justify-between items-center z-50">
      <div className="flex flex-col items-center gap-1">
        <FileText size={20} className="text-blue-600" />
        <span className="text-[10px] text-blue-600 font-bold">详情</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Calendar size={20} className="text-gray-300" />
        <span className="text-[10px] text-gray-300">日程</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <User size={20} className="text-gray-300" />
        <span className="text-[10px] text-gray-300">我的</span>
      </div>
    </div>
  </div>
);

const AssociationView = ({ onShowDecisionDetail, onShowContractDetail }: { onShowDecisionDetail: (item: any) => void; onShowContractDetail: () => void }) => {
  const [activeTab, setActiveTab] = useState('员工信息');
  
  return (
    <div className="flex flex-col h-full">
      {/* Top Tabs */}
      <div className="flex px-6 border-b border-gray-100 bg-gray-50/50">
        {['员工信息', '决策流程', '合同信息'].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)}
            className={`py-4 px-4 text-[15px] font-bold relative transition-colors ${activeTab === t ? 'text-blue-600' : 'text-gray-400'}`}
          >
            {t}
            {activeTab === t && (
              <motion.div 
                layoutId="assocTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === '员工信息' ? (
          <EmployeeBehaviorView onShowDecision={() => {}} />
        ) : activeTab === '决策流程' ? (
          <DecisionProcessView onShowDetail={onShowDecisionDetail} />
        ) : (
          <ContractListView onShowDetail={onShowContractDetail} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('今日');
  const [activeToggle, setActiveToggle] = useState('来源'); // '来源' or '用途'
  const [unit, setUnit] = useState('亿元'); // '亿元', '万元', '元'
  const [modalType, setModalType] = useState<'none' | 'detail' | 'association' | 'decisionDetail' | 'contractDetail'>('none');
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [selectedDecisionItem, setSelectedDecisionItem] = useState<any>(null);

  const tabs = ['今日', '本周', '本月'];

  const handleDateClick = (item: ListItem) => {
    setSelectedItem(item);
    setModalType('detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f2ff] via-[#f0f7ff] to-white font-sans text-gray-900 pb-24">
      {/* Status Bar Placeholder */}
      <div className="h-12 flex items-center justify-between px-6 text-sm font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-black/10"></div>
          <div className="w-4 h-4 rounded-full bg-black/10"></div>
          <div className="w-6 h-3 rounded-sm bg-black/10"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-6 pt-4 pb-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-wider mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          资金流智能体
        </h1>

        {/* Tabs */}
        <div className="w-full bg-white/60 backdrop-blur-md rounded-xl p-1 flex relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[15px] font-medium transition-all relative z-10 ${
                activeTab === tab ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/50">
          <p className="text-gray-400 text-sm mb-2 text-center">资金变动</p>
          <p className="text-2xl font-bold text-[#f2413d] text-center">+2.53 亿元</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/50">
          <div className="flex items-center justify-center gap-1 mb-2">
            <p className="text-gray-400 text-sm">可用资金</p>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-800 text-center">7.50 亿元</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-white/50 overflow-hidden">
          {/* Card Header */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">资金总览</h2>
              <Filter size={20} className="text-gray-400" />
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-[#f2413d]">103.85 亿元</span>
              <span className="text-lg font-bold text-blue-600">12,856.50 亿元</span>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-3">
              <button
                onClick={() => setActiveToggle('来源')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  activeToggle === '来源' ? 'bg-[#f2413d] text-white shadow-md' : 'text-gray-500'
                }`}
              >
                资金来源
              </button>
              <button
                onClick={() => setActiveToggle('用途')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                  activeToggle === '用途' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'
                }`}
              >
                资金用途
              </button>
            </div>

            {/* Unit Switcher */}
            <div className="flex justify-end gap-2 mb-4">
              {['亿元', '万元', '元'].map(u => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    unit === u 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* List Items */}
            <div className="mt-2">
              {activeToggle === '来源' ? (
                MOCK_DATA.source.map(item => (
                  <CollapsibleItem key={item.id} item={item} valueColor="text-[#f2413d]" unit={unit} onDateClick={handleDateClick} />
                ))
              ) : (
                MOCK_DATA.usage.map(item => (
                  <CollapsibleItem key={item.id} item={item} valueColor="text-blue-600" unit={unit} onDateClick={handleDateClick} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalType === 'detail' && (
          <Modal isOpen={true} onClose={() => setModalType('none')} title={activeToggle === '来源' ? '事前申请' : '费用报销'}>
            <ExpenseDetailView item={selectedItem} unit={unit} onShowEmployee={() => setModalType('association')} />
          </Modal>
        )}
        {modalType === 'association' && (
          <Modal isOpen={true} onClose={() => setModalType('none')} title="关联信息" showClose={true}>
            <AssociationView 
              onShowDecisionDetail={(item) => {
                setSelectedDecisionItem(item);
                setModalType('decisionDetail');
              }} 
              onShowContractDetail={() => setModalType('contractDetail')}
            />
          </Modal>
        )}
        {modalType === 'decisionDetail' && (
          <Modal isOpen={true} onClose={() => setModalType('none')} title={selectedDecisionItem?.category || "详情"}>
            <DecisionDetailView />
          </Modal>
        )}
        {modalType === 'contractDetail' && (
          <Modal isOpen={true} onClose={() => setModalType('none')} title="合同详情">
            <ContractDetailView />
          </Modal>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-8 py-3 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Home size={22} />
          </div>
          <span className="text-[11px] font-medium text-blue-600">资金穿透</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 group-active:scale-95 transition-transform">
            <Grid size={22} />
          </div>
          <span className="text-[11px] font-medium text-gray-400">应用</span>
        </button>
      </nav>

      {/* iPhone Home Indicator */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-20 z-50"></div>
    </div>
  );
}
