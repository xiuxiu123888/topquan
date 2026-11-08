import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  PRODUCT_CATEGORIES, 
  PRODUCTS_CATALOG, 
  ProductCategory, 
  ProductItem
} from '../data/companyData';
import serverImage from '../assets/images/server_product_1792684555426.jpg';
import { downloadMockPdf } from '../utils/mockPdf';
import { 
  Server, 
  Cpu, 
  FileText, 
  Download, 
  ExternalLink, 
  Check, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2, 
  Table as TableIcon,
  Layers,
  Sparkles,
  PhoneCall,
  HardDrive,
  Radio,
  Sliders,
  X,
  Gauge,
  SlidersHorizontal
} from 'lucide-react';

interface ProductCenterProps {
  onOpenPdf: (product: ProductItem) => void;
  onRequestPoC: (modelId: string) => void;
}

export const ProductCenter: React.FC<ProductCenterProps> = ({ onOpenPdf, onRequestPoC }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 从 URL 读取参数：cat (一级品类), platform (Intel / AMD), id (机型)
  const catParam = searchParams.get('cat') as ProductCategory | null;
  const platformParam = searchParams.get('platform') as 'Intel' | 'AMD' | null;
  const idParam = searchParams.get('id');

  // 一级分类：高频服务器、GPU服务器、普通服务器、配件
  const validCategories: ProductCategory[] = ['hft', 'gpu', 'general', 'accessory'];
  const initialCategory: ProductCategory = (catParam && validCategories.includes(catParam)) ? catParam : 'hft';

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  // 二级大类：分 Intel 与 AMD 两大类
  const [selectedPlatform, setSelectedPlatform] = useState<'Intel' | 'AMD'>(platformParam === 'AMD' ? 'AMD' : 'Intel');
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // 滚动监听：当滚动到具体型号区域时，在上方显示面包屑
  const [showStickyBreadcrumb, setShowStickyBreadcrumb] = useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        // 当 stageRef 顶部进入视口上方 160px 内时（说明已经滚动到具体型号介绍区域）
        setShowStickyBreadcrumb(rect.top <= 160);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. 根据当前一级分类 (selectedCategory) 计算可用的平台选项
  const categoryProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const hasIntel = useMemo(() => categoryProducts.some(p => p.platform === 'Intel' || p.platform === 'Universal'), [categoryProducts]);
  const hasAmd = useMemo(() => categoryProducts.some(p => p.platform === 'AMD' || p.platform === 'Universal'), [categoryProducts]);

  // 2. 根据一级分类与所选平台（Intel / AMD）过滤出的当前机型列表
  const currentPlatformProducts = useMemo(() => {
    if (selectedCategory === 'accessory') {
      return categoryProducts;
    }
    // 服务器类（高频服务器、GPU服务器、普通服务器）：严格分 Intel 和 AMD 两大类
    return categoryProducts.filter(p => p.platform === selectedPlatform);
  }, [categoryProducts, selectedCategory, selectedPlatform]);

  // 3. 当前选中的具体机型 ID
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (idParam && PRODUCTS_CATALOG.some(p => p.id === idParam)) {
      return idParam;
    }
    return currentPlatformProducts[0]?.id || 'TQ1810R';
  });

  // 当外部传入 idParam 时，自动匹配其所属的一级分类与平台
  useEffect(() => {
    if (idParam) {
      const target = PRODUCTS_CATALOG.find(p => p.id === idParam);
      if (target) {
        setSelectedCategory(target.category);
        if (target.platform === 'AMD') {
          setSelectedPlatform('AMD');
        } else if (target.platform === 'Intel') {
          setSelectedPlatform('Intel');
        }
        setSelectedProductId(target.id);
      }
    }
  }, [idParam]);

  // 当一级分类改变或 URL catParam 变动时响应
  useEffect(() => {
    if (catParam && validCategories.includes(catParam) && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // 当平台变动或候选列表变化时，确保选中的产品属于当前列表
  useEffect(() => {
    if (currentPlatformProducts.length > 0) {
      const exists = currentPlatformProducts.some(p => p.id === selectedProductId);
      if (!exists) {
        const nextId = currentPlatformProducts[0].id;
        setSelectedProductId(nextId);
        setSearchParams({ cat: selectedCategory, platform: selectedPlatform, id: nextId }, { replace: true });
      }
    }
  }, [currentPlatformProducts, selectedCategory, selectedPlatform]);

  // 当前正在展示的单一产品
  const currentProduct: ProductItem = 
    PRODUCTS_CATALOG.find(p => p.id === selectedProductId) || 
    currentPlatformProducts[0] || 
    PRODUCTS_CATALOG[0];

  // 计算当前机型在当前大类列表中的序号
  const currentIndex = currentPlatformProducts.findIndex(p => p.id === currentProduct.id);
  const totalInGroup = currentPlatformProducts.length;

  // 切换具体产品
  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProductId(product.id);
    setSearchParams({ cat: product.category, platform: product.platform === 'AMD' ? 'AMD' : 'Intel', id: product.id }, { replace: true });
    const stage = document.getElementById('single-product-stage');
    if (stage) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevProduct = () => {
    if (totalInGroup <= 1) return;
    const prevIdx = (currentIndex - 1 + totalInGroup) % totalInGroup;
    handleSelectProduct(currentPlatformProducts[prevIdx]);
  };

  const handleNextProduct = () => {
    if (totalInGroup <= 1) return;
    const nextIdx = (currentIndex + 1) % totalInGroup;
    handleSelectProduct(currentPlatformProducts[nextIdx]);
  };

  // 键盘快捷键左右翻页
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevProduct();
      } else if (e.key === 'ArrowRight') {
        handleNextProduct();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalInGroup, currentPlatformProducts]);

  const handleDownloadPdf = (product: ProductItem) => {
    downloadMockPdf(product);
    setDownloadNotice(product.id);
    setTimeout(() => {
      setDownloadNotice(null);
    }, 3000);
  };

  const isServerCategory = ['hft', 'gpu', 'general'].includes(selectedCategory);
  const currentCategoryLabel = PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.label || '高频服务器';
  const currentPlatformLabel = isServerCategory 
    ? (currentProduct.platform === 'Intel' ? 'intel' : 'amd') 
    : '通用';

  return (
    <section id="products" className="py-10 md:py-14 bg-slate-50 min-h-screen">
      {/* 
        用户要求：往下滚动到具体型号的时候 上方显示面包屑 产品中心>高频服务器>intel>TQ1810R
      */}
      {showStickyBreadcrumb && (
        <div className="fixed top-[110px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4">
            
            {/* 面包屑导航: 产品中心 > 高频服务器 > intel > TQ1810R */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium text-slate-500 overflow-x-auto scrollbar-none">
              <button
                onClick={() => {
                  const el = document.getElementById('products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-600 hover:text-[#0263E0] transition-colors cursor-pointer shrink-0"
              >
                产品中心
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

              <button
                onClick={() => {
                  const el = document.getElementById('category-selector');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-600 hover:text-[#0263E0] transition-colors cursor-pointer shrink-0"
              >
                {currentCategoryLabel}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

              <button
                onClick={() => {
                  const el = document.getElementById('platform-selector');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-600 hover:text-[#0263E0] transition-colors cursor-pointer shrink-0 lowercase"
              >
                {currentPlatformLabel}
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

              <span className="font-mono font-bold text-[#0263E0] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 shrink-0">
                {currentProduct.id}
              </span>
            </nav>

            {/* 右侧：快速操作与翻页切换 */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="hidden lg:inline text-xs font-medium text-slate-600 truncate max-w-xs">
                {currentProduct.name}
              </span>

              <button
                type="button"
                onClick={() => onOpenPdf(currentProduct)}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                title="在线预览 PDF 白皮书"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">PDF预览</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPdf(currentProduct)}
                className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0263E0] text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                title="下载 PDF 规格说明书"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">下载PDF</span>
              </button>

              <button
                type="button"
                onClick={() => onRequestPoC(currentProduct.id)}
                className="px-3 py-1 rounded bg-[#0263E0] hover:bg-[#0052cc] text-white text-[11px] font-semibold flex items-center space-x-1 cursor-pointer shadow-xs transition-colors"
              >
                <span>联系我们</span>
              </button>

              {totalInGroup > 1 && (
                <div className="inline-flex rounded border border-slate-200 bg-slate-50 p-0.5 ml-1">
                  <button
                    onClick={handlePrevProduct}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
                    title="上一款"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextProduct}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
                    title="下一款"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 顶部标题区 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-widest mb-2">
                <Server className="w-4 h-4 mr-1.5" />
                <span>产品中心 · 金融级算力矩阵</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                产品中心 · 全系硬件配置体系
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
                包含高频服务器、GPU服务器、普通服务器与专用配件，分 <strong>Intel</strong>、<strong>AMD</strong> 两大类平台，大类下展示详细配置与工程规格。
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCompareModalOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                title="横向查看该分类参数对比矩阵"
              >
                <TableIcon className="w-3.5 h-3.5 text-[#0263E0]" />
                <span>查看全系参数对比表</span>
              </button>
            </div>
          </div>
        </div>

        {/* 
          1. 一级大类选择（高频服务器、GPU服务器、普通服务器、配件）
        */}
        <div id="category-selector" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 scroll-mt-32">
          {PRODUCT_CATEGORIES.map(cat => {
            const isCurrent = selectedCategory === cat.id;
            const count = PRODUCTS_CATALOG.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as ProductCategory);
                  setSearchParams({ cat: cat.id }, { replace: true });
                }}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0F2847] text-white border-[#0F2847] shadow-md shadow-slate-900/15 ring-2 ring-[#0263E0]/50'
                    : 'bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                    {cat.label}
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    isCurrent ? 'bg-sky-500/30 text-sky-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count} 款
                  </span>
                </div>
                <p className={`text-[11px] mt-1.5 line-clamp-1 leading-snug ${
                  isCurrent ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* 
          2. 二级平台分类选择：分 Intel、AMD 两大类（如果是服务器系列）
        */}
        <div id="platform-selector" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8 scroll-mt-32">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Intel vs AMD 两大类切换控制器 */}
            {isServerCategory ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-[#0263E0]" />
                </span>

                <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 shadow-inner">
                  <button
                    onClick={() => {
                      setSelectedPlatform('Intel');
                      setSearchParams({ cat: selectedCategory, platform: 'Intel' }, { replace: true });
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-2 cursor-pointer ${
                      selectedPlatform === 'Intel'
                        ? 'bg-[#0263E0] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Intel 平台大类</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      selectedPlatform === 'Intel' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {categoryProducts.filter(p => p.platform === 'Intel').length} 款机型
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPlatform('AMD');
                      setSearchParams({ cat: selectedCategory, platform: 'AMD' }, { replace: true });
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center space-x-2 cursor-pointer ${
                      selectedPlatform === 'AMD'
                        ? 'bg-[#C43A1A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>AMD 平台大类</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      selectedPlatform === 'AMD' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {categoryProducts.filter(p => p.platform === 'AMD').length} 款机型
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <Radio className="w-4 h-4 text-[#0263E0]" />
                <span>配件与硬件加速卡 · 纳秒级网卡、FPGA加速卡与特挑超频内存</span>
              </div>
            )}

            {/* 机型横向切换标签 (在大类下面再贴机型快速切换) */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none flex-1 justify-start md:justify-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center">
                <Sliders className="w-3.5 h-3.5 mr-1 text-slate-400" />
                切换机型:
              </span>

              {currentPlatformProducts.map(prod => {
                const isActive = prod.id === currentProduct.id;
                return (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center space-x-1.5 border cursor-pointer ${
                      isActive
                        ? prod.platform === 'AMD'
                          ? 'bg-[#C43A1A] text-white border-[#C43A1A] shadow-sm'
                          : 'bg-[#0263E0] text-white border-[#0263E0] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="font-mono">{prod.id}</span>
                    {prod.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        {prod.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 翻页指示器 */}
            {totalInGroup > 1 && (
              <div className="flex items-center justify-between sm:justify-end space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className="text-xs text-slate-500 font-mono">
                  {currentIndex + 1} / {totalInGroup}
                </span>

                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    onClick={handlePrevProduct}
                    className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    title="上一款机型 (快捷键 ←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextProduct}
                    className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    title="下一款机型 (快捷键 →)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 下载提示 Toast 浮层 */}
        {downloadNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0B2545] text-white px-5 py-3 rounded-lg shadow-xl border border-sky-500 flex items-center space-x-3 animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <div className="font-bold">已触发规格书 PDF 下载</div>
              <div className="text-slate-300">正在下载 {downloadNotice} 完整硬件白皮书文档</div>
            </div>
          </div>
        )}

        {/* 
          3. 【大类下面贴详细配置或介绍 · 一页一个产品介绍】
        */}
        <div id="single-product-stage" ref={stageRef} className="space-y-8 animate-in fade-in duration-150 scroll-mt-36">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* 顶栏信息与行动按钮 */}
            <div className="p-6 sm:p-8 lg:p-10 border-b border-slate-100">
              
              {/* 面包屑导航：产品中心 > 高频服务器 > intel > TQ1810R */}
              <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium text-slate-500 mb-4 pb-3 border-b border-slate-100 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => {
                    const el = document.getElementById('products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-slate-600 hover:text-[#0263E0] transition-colors cursor-pointer shrink-0"
                >
                  产品中心
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                <button
                  onClick={() => {
                    const el = document.getElementById('category-selector');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-slate-600 hover:text-[#0263E0] transition-colors cursor-pointer shrink-0"
                >
                  {currentCategoryLabel}
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                <button
                  onClick={() => {
                    const el = document.getElementById('platform-selector');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-slate-600 hover:text-[#0263E0] transition-colors cursor-pointer shrink-0 lowercase"
                >
                  {currentPlatformLabel}
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                <span className="font-mono font-bold text-[#0263E0] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 shrink-0">
                  {currentProduct.id}
                </span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                <div className="space-y-3 max-w-3xl">
                  {/* 状态徽章条 */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white bg-[#0F2847] px-2.5 py-1 rounded">
                      型号: {currentProduct.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {currentProduct.categoryName}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                      currentProduct.platform === 'Intel'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : currentProduct.platform === 'AMD'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {currentProduct.platform === 'Universal' ? '通用平台兼容' : `${currentProduct.platform} 架构平台`}
                    </span>
                    {currentProduct.badge && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-100 text-[#0263E0]">
                        {currentProduct.badge}
                      </span>
                    )}
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> CCC 认证
                    </span>
                  </div>

                  {/* 产品主标题 */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {currentProduct.name}
                  </h2>

                  {/* 用户真实工程副标题 */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {currentProduct.tagline}
                  </p>
                </div>

                {/* 核心操作按钮组 */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenPdf(currentProduct)}
                    className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 hover:border-sky-400 group cursor-pointer"
                    title="在线打开并阅读完整规格白皮书"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span>PDF跳转预览</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 ml-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(currentProduct)}
                    className="px-4 py-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0263E0] text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                    title="直接下载 PDF 规格说明书"
                  >
                    <Download className="w-4 h-4 text-[#0263E0]" />
                    <span>下载 PDF ({currentProduct.pdfFileSize})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRequestPoC(currentProduct.id)}
                    className="px-5 py-2.5 rounded-lg bg-[#0263E0] hover:bg-[#0052cc] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>联系我们</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>

              </div>

              {/* 
                第一模块：左侧服务器实物图片 + 右侧硬件技术规格明细
              */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* 左侧：服务器实物图片 */}
                <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-950 to-[#0F2847] rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono">
                      <span className="text-sky-400 font-semibold flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                        实机工程实物展示
                      </span>
                      <span className="text-slate-400 bg-white/10 px-2 py-0.5 rounded text-[11px]">
                        {currentProduct.formFactor} 标准机架式
                      </span>
                    </div>

                    {/* 图片容器 */}
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-inner group">
                      <img 
                        src={serverImage} 
                        alt={`${currentProduct.id} ${currentProduct.name}`} 
                        className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 bg-[#0F2847]/90 backdrop-blur-sm text-sky-300 text-[11px] font-mono font-bold px-2.5 py-1 rounded border border-sky-500/40 shadow-sm">
                        {currentProduct.id} 工业级样机
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
                        <span className="bg-emerald-950/90 backdrop-blur-sm text-emerald-300 font-medium px-2 py-0.5 rounded border border-emerald-500/40 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> 72H 满载烤机出厂
                        </span>
                        <span className="bg-slate-900/90 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                          {currentProduct.cooling.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 服务器实物核心架构参数速览 */}
                  <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="text-slate-400 font-mono text-[10px] uppercase">处理器架构</div>
                      <div className="font-bold text-white mt-1 truncate" title={currentProduct.processor}>
                        {currentProduct.processor.split('(')[0]}
                      </div>
                      <div className="text-sky-400 font-mono text-[11px] font-semibold mt-0.5">
                        {currentProduct.maxFreq}
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="text-slate-400 font-mono text-[10px] uppercase">整机供电</div>
                      <div className="font-bold text-white mt-1 truncate" title={currentProduct.powerSupply}>
                        {currentProduct.powerSupply}
                      </div>
                      <div className="text-emerald-400 font-medium text-[11px] mt-0.5">
                        1年保修 · 7×24 支持
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧：硬件技术规格明细 */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                          <TableIcon className="w-3.5 h-3.5 mr-1.5 text-[#0263E0]" />
                          硬件技术规格明细
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                          {currentProduct.id} 真实工程参数矩阵
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onOpenPdf(currentProduct)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
                          title="在线预览技术白皮书"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-500 mr-1" />
                          <span>PDF预览</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(currentProduct)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0263E0] transition-colors flex items-center space-x-1 cursor-pointer"
                          title="下载标准工程 PDF 规格说明书"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          <span>下载规格表</span>
                        </button>
                      </div>
                    </div>

                    {/* 规格明细表格 */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                        <thead className="bg-[#0F2847] text-white">
                          <tr>
                            <th scope="col" className="px-4 py-2.5 w-1/3 font-semibold uppercase tracking-wider">
                              工程参数项
                            </th>
                            <th scope="col" className="px-4 py-2.5 font-semibold uppercase tracking-wider">
                              配置详情与测试指标
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {currentProduct.specsTable.map((spec, sIdx) => (
                            <tr 
                              key={sIdx} 
                              className={sIdx % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/50 hover:bg-slate-100/60'}
                            >
                              <td className="px-4 py-2.5 font-semibold text-slate-700 whitespace-nowrap bg-slate-50/30">
                                {spec.label}
                              </td>
                              <td className="px-4 py-2.5 text-slate-900 font-medium">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>* 具体技术配置支持按需增配及软硬件协同定制</span>
                    <span className="text-[#0263E0] font-mono font-semibold">CCC 认证 · 严苛实盘验证</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 核心特点与定制优势文案 */}
            <div className="p-6 sm:p-8 lg:p-10 bg-slate-50/50 border-b border-slate-200">
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-[#0263E0]" />
                  核心特点与架构优势
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {currentProduct.id} 专属软硬件协同调优
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentProduct.keyFeatures.map((feat, idx) => {
                  const parts = feat.split('：');
                  const title = parts.length > 1 ? parts[0] : `核心特点 0${idx + 1}`;
                  const desc = parts.length > 1 ? parts[1] : feat;

                  return (
                    <div 
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0263E0] font-bold text-xs flex items-center justify-center mb-3 border border-sky-100">
                          0{idx + 1}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">
                          {title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                        <span>金融严苛可靠性通过</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 推荐交易与量化应用场景 */}
            <div className="p-6 sm:p-8 lg:p-10 bg-slate-50/50">
              <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#0263E0] mr-2"></span>
                    推荐交易与量化应用场景
                  </div>
                  <div className="text-xs text-slate-500">
                    经过头部证券期货机构实盘测试，{currentProduct.id} 推荐部署于以下核心业务线：
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentProduct.targetScenarios.map((sc, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1.5 bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 shadow-xs"
                    >
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 
            底部分页控制器 (当同大类机型数量 > 1 时显示)
          */}
          {totalInGroup > 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <button
                onClick={handlePrevProduct}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-slate-50 transition-all flex items-center space-x-3 cursor-pointer group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0263E0] group-hover:text-white transition-colors flex items-center justify-center text-slate-600">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">上一款机型</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    {currentPlatformProducts[(currentIndex - 1 + totalInGroup) % totalInGroup]?.id}
                  </div>
                </div>
              </button>

              <div className="text-center">
                <span className="text-xs text-slate-500 font-mono">
                  {currentProduct.platform} 大类 · 当前展示第 <strong className="text-slate-900 font-bold">{currentIndex + 1}</strong> 款（共 {totalInGroup} 款）
                </span>
                <div className="mt-1 flex items-center justify-center space-x-1.5">
                  {currentPlatformProducts.map((p, pIdx) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        pIdx === currentIndex 
                          ? p.platform === 'AMD' ? 'w-6 bg-[#C43A1A]' : 'w-6 bg-[#0263E0]'
                          : 'w-2 bg-slate-200 hover:bg-slate-400'
                      }`}
                      title={`切换到 ${p.id}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextProduct}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-slate-50 transition-all flex items-center space-x-3 cursor-pointer group text-right justify-end"
              >
                <div>
                  <div className="text-[11px] text-slate-400">下一款机型</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    {currentPlatformProducts[(currentIndex + 1) % totalInGroup]?.id}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0263E0] group-hover:text-white transition-colors flex items-center justify-center text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

            </div>
          )}

          {/* 底部按需定制提示条 */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center space-x-3.5">
              <Cpu className="w-6 h-6 text-sky-400 shrink-0" />
              <div>
                <div className="text-sm font-bold">需要针对量化策略或金融机房浅机柜进行深度非标定制？</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  冠量科技支持从特定进深机箱、主板 PCIe 拓扑、闭环液冷结构到 FPGA 网卡固件的全栈联调。
                </div>
              </div>
            </div>

            <button
              onClick={() => onRequestPoC('CUSTOM_CONFIG')}
              className="shrink-0 px-5 py-2.5 bg-[#0263E0] hover:bg-[#0052cc] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              提交非标定制需求
            </button>
          </div>

        </div>

      </div>

      {/* 
        全系参数横向对比弹窗
      */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 bg-[#0F2847] text-white flex items-center justify-between border-b border-slate-700">
              <div>
                <div className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                  {PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({selectedPlatform} 平台) · 横向对比
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  标准参数对比矩阵
                </h3>
              </div>

              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto flex-1 bg-slate-50">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-bold w-36 uppercase">规格对比项</th>
                    {currentPlatformProducts.map(p => (
                      <th key={p.id} className="px-4 py-3 min-w-[200px]">
                        <div className="font-mono font-bold text-sm text-[#0263E0]">{p.id}</div>
                        <div className="text-[11px] text-slate-500 font-normal truncate">{p.name}</div>
                        <button
                          onClick={() => {
                            setCompareModalOpen(false);
                            handleSelectProduct(p);
                          }}
                          className="mt-2 px-2.5 py-1 rounded bg-[#0263E0] text-white text-[11px] font-semibold hover:bg-[#0052cc] transition-colors cursor-pointer"
                        >
                          切换到本款
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">机箱形态</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-900">{p.formFactor}</td>
                    ))}
                  </tr>
                  <tr className="bg-blue-50/20">
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">主频/超频</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 font-bold text-[#0263E0] font-mono">{p.maxFreq}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">处理器 (CPU)</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-900">{p.processor}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">主板芯片组</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-800">{p.chipset || '专属架构'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">内存配置</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-800">{p.memory}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">硬盘存储</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-800">{p.storage}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">冷却系统</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-800">{p.cooling}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">专用交易网卡</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-900 font-medium">{p.networking}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">供电系统</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5 text-slate-800">{p.powerSupply}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-700 bg-slate-50">白皮书文档</td>
                    {currentPlatformProducts.map(p => (
                      <td key={p.id} className="px-4 py-2.5">
                        <button
                          onClick={() => {
                            setCompareModalOpen(false);
                            onOpenPdf(p);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-500 mr-1" />
                          <span>PDF预览</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>点击“切换到本款”即可在主舞台详细查阅该机型全部软硬件参数与架构</span>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                关闭对比窗口
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
