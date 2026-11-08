import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { HomeProductSeriesSection } from '../components/HomeProductSeriesSection';
import { ArrowRight, Server } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* 
        首页首屏视觉区：
        包含：淡蓝色（#D7EEFD）到纯白（#FFFFFF）渐变、公司介绍精简版、核心指标与关于我们团队文化
      */}
      <HeroSection
        onOpenPocModal={() => navigate('/contact')}
        onNavigateToProducts={() => navigate('/products')}
        onNavigateToContact={() => navigate('/contact')}
      />

      {/* 
        用户要求新增：四大产品系列 · 支持 Intel 与 AMD 双架构
        产品中心全系谱系（高频服务器、GPU服务器、普通服务器、配件）
      */}
      <HomeProductSeriesSection />

      {/* 首页底部通向产品中心与联系我们的快速行动区 */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B2545] rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 z-10 max-w-2xl">
              <span className="text-xs font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded border border-sky-800">
                专为量化交易打造的物理硬件底座
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                准备好为您的量化策略升级纳秒级计算底座了吗？
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                全线 TQ 系列高频服务器、GPU 算力集群及 Solarflare 低延迟网卡均经过 72 小时全负载热应力烤机验证，工程师随时待命为您提供售前技术咨询与架构支持。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0 w-full md:w-auto">
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3.5 bg-white text-slate-900 font-bold text-xs rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <Server className="w-4 h-4 text-[#0263E0]" />
                <span>浏览全部产品与配置</span>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3.5 bg-[#0263E0] hover:bg-[#0052cc] text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center space-x-2 shadow-md shadow-sky-600/30"
              >
                <span>联系我们</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
