import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Layers, 
  Activity, 
  HardDrive, 
  Radio, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const HomeProductSeriesSection: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToCategory = (catId: string) => {
    navigate(`/products?cat=${catId}`);
  };

  const SERIES_DATA = [
    {
      seriesNo: '系列 01',
      badge: 'Intel / AMD',
      title: '高频服务器',
      catId: 'hft',
      desc: '酷睿、至强 W、至强 6、锐龙、线程撕裂者。2U 机架含导轨，高效 2U 闭环液冷，网卡选配。',
      tags: ['高频服务器', '做市商 / 期货套利'],
      buttonText: '查看机型',
      icon: Server,
      color: '#0263E0',
      lightBg: 'bg-blue-50/70',
      borderHover: 'hover:border-blue-400'
    },
    {
      seriesNo: '系列 02',
      badge: '多卡分体液冷',
      title: 'GPU服务器',
      catId: 'gpu',
      desc: 'TQ-G8000 / TQ-G4000，4-8卡 GPU 满载液冷，赋能 AI 量化多因子与实时推理。',
      tags: ['GPU服务器', '深度学习 / 策略推理'],
      buttonText: '查看机型',
      icon: Cpu,
      color: '#76B900',
      lightBg: 'bg-emerald-50/70',
      borderHover: 'hover:border-emerald-400'
    },
    {
      seriesNo: '系列 03',
      badge: '大容量存储回测',
      title: '普通服务器',
      catId: 'general',
      desc: 'TQ-S2200 / TQ-S4200，标准企业级计算与高密 36 盘位历史行情存储数据湖。',
      tags: ['普通服务器', '历史回测 / 数据存储'],
      buttonText: '查看机型',
      icon: HardDrive,
      color: '#0068B5',
      lightBg: 'bg-indigo-50/70',
      borderHover: 'hover:border-indigo-400'
    },
    {
      seriesNo: '系列 04',
      badge: '低延迟加速卡',
      title: '配件 (含网卡等)',
      catId: 'accessory',
      desc: 'Solarflare X2522 网卡、FPGA 纳秒级硬件旁路卡、超低损耗跳线与分体液冷模组。',
      tags: ['配件与网卡', '内核旁路网卡'],
      buttonText: '查看配件',
      icon: Radio,
      color: '#F59E0B',
      lightBg: 'bg-amber-50/70',
      borderHover: 'hover:border-amber-400'
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 标题区（用户指定文案） */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-widest mb-2.5">
              <Layers className="w-4 h-4 mr-1.5" />
              <span>四大产品系列 · 支持 Intel 与 AMD 双架构</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              产品中心全系谱系
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-3xl leading-relaxed">
              高频服务器、GPU服务器、普通服务器、配件（含低延时网卡等），全系提供详细配置手册与 PDF 预览
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#0263E0] hover:bg-[#0052cc] shadow-sm shadow-sky-600/20 transition-all group"
            >
              <span>进入产品中心查看详细工程配置与 PDF 预览</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 四大系列卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERIES_DATA.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.seriesNo}
                className={`bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group ${item.borderHover}`}
              >
                <div>
                  {/* 系列标签栏 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {item.seriesNo}
                    </span>
                    <span className={`text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full ${item.lightBg} text-slate-700`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* 图标与系列大标题 */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0263E0] group-hover:bg-sky-50 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0263E0] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* 详细描述 */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[44px]">
                    {item.desc}
                  </p>

                  {/* 适用场景与标签 */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 mb-6">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[11px] border border-slate-200/70 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 底部行动按钮 */}
                <button
                  type="button"
                  onClick={() => handleNavigateToCategory(item.catId)}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-[#0263E0] text-slate-700 hover:text-white border border-slate-200 hover:border-[#0263E0] text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-2xs group/btn"
                >
                  <span>{item.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
