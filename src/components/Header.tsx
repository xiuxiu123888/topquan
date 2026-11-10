import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { COMPANY_INFO, PRODUCT_CATEGORIES } from '../data/companyData';
import { 
  ChevronDown, 
  PhoneCall, 
  Menu, 
  X, 
  ArrowRight,
} from 'lucide-react';

import { TopQuantLogo } from './TopQuantLogo';

export const Header: React.FC = () => {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProductDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* 顶部微型金融级服务保障栏 */}
      <div className="bg-[#0B2545] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="inline-flex items-center text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              金融级低时延服务器 · 自主创新与严格品控
            </span>
            <span className="hidden md:inline text-slate-400">
              服务于证券、期货及量化交易机构 · 始于2015年
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={`tel:${COMPANY_INFO.hotline}`} 
              className="text-slate-300 hover:text-white transition-colors hidden sm:flex items-center text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              <span>服务专线: <strong className="ml-1 text-white font-medium">{COMPANY_INFO.hotline}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* 主导航条：严格遵照定稿独立页面与独立路由（首页 /、产品中心 /products、服务支持 /service、联系我们 /contact） */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* 品牌 Logo (跳转首页 /) */}
        <Link 
          to="/" 
          className="flex items-center cursor-pointer group select-none py-1"
        >
          <TopQuantLogo className="h-16" />
        </Link>

        {/* 核心桌面独立路由导航菜单（首页、产品中心、服务支持、联系我们） */}
        <nav className="hidden lg:flex items-center space-x-1">
          {/* 1. 首页 (Route: /) */}
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-[#0263E0] bg-sky-50 font-semibold' : 'text-slate-700 hover:text-[#0263E0] hover:bg-slate-50'
            }`}
          >
            首页
          </NavLink>

          {/* 2. 产品中心 (Route: /products) */}
          <div 
            className="relative"
            onMouseEnter={() => setProductDropdownOpen(true)}
            onMouseLeave={() => setProductDropdownOpen(false)}
          >
            <NavLink 
              to="/products"
              className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${
                isActive ? 'text-[#0263E0] bg-sky-50 font-semibold' : 'text-slate-700 hover:text-[#0263E0] hover:bg-slate-50'
              }`}
            >
              <span>产品中心</span>
              <ChevronDown className={`ml-1.5 w-4 h-4 text-slate-400 transition-transform duration-200 ${productDropdownOpen ? 'rotate-180 text-[#0263E0]' : ''}`} />
            </NavLink>

            {productDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-white rounded-xl shadow-xl border border-slate-200/90 p-4 grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-150 z-50">
                {PRODUCT_CATEGORIES.map(cat => (
                  <Link 
                    key={cat.id}
                    to={`/products?cat=${cat.id}`}
                    onClick={() => setProductDropdownOpen(false)}
                    className="p-3 rounded-lg border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-[#0263E0] flex items-center">
                        {cat.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        Intel / AMD
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{cat.desc}</p>
                  </Link>
                ))}
                <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>均提供详细配置与 PDF 规格书在线预览/下载</span>
                  <Link 
                    to="/products" 
                    onClick={() => setProductDropdownOpen(false)}
                    className="text-[#0263E0] font-medium hover:underline inline-flex items-center"
                  >
                    浏览完整产品中心页面 <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. 合作伙伴 (Route: /partners) */}
          <NavLink 
            to="/partners" 
            className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-[#0263E0] bg-sky-50 font-semibold' : 'text-slate-700 hover:text-[#0263E0] hover:bg-slate-50'
            }`}
          >
            合作伙伴
          </NavLink>

          {/* 4. 服务支持 (Route: /service) */}
          <NavLink 
            to="/service" 
            className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'text-[#0263E0] bg-sky-50 font-semibold' : 'text-slate-700 hover:text-[#0263E0] hover:bg-slate-50'
            }`}
          >
            服务支持
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link 
            to="/contact" 
            className="h-9 px-4 text-xs font-semibold text-white bg-[#0263E0] hover:bg-[#0052cc] rounded-md shadow-sm shadow-sky-600/20 transition-all inline-flex items-center active:scale-95"
          >
            <span>联系我们</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* 移动端菜单开关 */}
        <button 
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="打开菜单"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 移动端折叠导航 */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <button 
            onClick={() => handleMobileNav('/')} 
            className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            首页（公司介绍 · 核心优势 · 关键技术）
          </button>
          <button 
            onClick={() => handleMobileNav('/products')} 
            className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            产品中心（高频 / GPU / 普通 / 配件 · Intel / AMD · PDF）
          </button>
          <button 
            onClick={() => handleMobileNav('/partners')} 
            className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            合作伙伴
          </button>
          <button 
            onClick={() => handleMobileNav('/service')} 
            className="w-full text-left px-3 py-2 rounded text-base font-medium text-slate-800 hover:bg-sky-50"
          >
            服务支持（驱动下载 · 技术联系 · 7×24热线）
          </button>
          <button
            onClick={() => handleMobileNav('/contact')}
            className="w-full mt-2 py-2.5 text-sm font-semibold text-white bg-[#0263E0] hover:bg-[#0052cc] rounded-md inline-flex items-center justify-center"
          >
            联系我们
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      )}
    </header>
  );
};
