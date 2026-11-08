import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  Gauge, 
  ShieldCheck, 
  Layers, 
  Award,
  Users,
  Zap,
  Target,
  Server,
  Droplets,
  Cpu,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import serverImage from '../assets/images/server_product_1792684555426.jpg';

interface HeroSectionProps {
  onOpenPocModal: () => void;
  onNavigateToProducts: () => void;
  onNavigateToContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPocModal,
  onNavigateToProducts,
}) => {
  return (
    <div id="home">
      {/* 
        首屏视觉规范（明亮金融风）：
        1. 色彩：首屏使用淡蓝色（#D7EEFD）到纯白（#FFFFFF）的平滑渐变背景。其余部分保持纯净留白。
        2. 风格：类似传统大型券商、纳斯达克或 IBM 等企业级金融设备的官网。大模块、对称排版。
        3. 主标题：“专注金融前端，赋能量化交易”
        4. 副标题：公司简介精简版
      */}
      <section 
        className="relative w-full pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-slate-200/80"
        style={{
          background: 'linear-gradient(180deg, #D7EEFD 0%, #EBF6FE 40%, #FFFFFF 100%)'
        }}
      >
        {/* 极简金融坐标微细网格修饰 */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{
            backgroundSize: '36px 36px',
            backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px)'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 顶部稳重企业背书标签 */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200/90 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#0263E0]"></span>
              <span className="text-xs font-semibold text-slate-800 tracking-wider">
                始于 2015 · 深圳冠量科技自主创新 · 专业高频交易服务器提供商
              </span>
            </div>
          </div>

          {/* 主标题区（严格遵照客户要求与真实文案） */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              专注金融前端，<span className="text-[#0263E0]">赋能量化交易</span>
            </h1>

            {/* 副标题（公司简介精简版） */}
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-normal max-w-3xl mx-auto">
              深圳冠量科技有限公司成立于2015年，是一家具有自主创新能力并为金融市场客户提供高频交易设备的金融科技企业。
            </p>

            {/* 关键决策行动组 CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                type="button"
                onClick={onOpenPocModal}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-md text-sm font-semibold text-white bg-[#0263E0] hover:bg-[#0052cc] shadow-md shadow-sky-600/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>联系我们</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={onNavigateToProducts}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-md text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>进入产品中心 (查看完整配置与PDF)</span>
              </button>
            </div>

            {/* 核心优势展示区（遵照指令更新为高性能与高可靠性两大核心优势） */}
            <div className="pt-10 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto text-left">
              {/* 核心优势 1: 高性能 */}
              <div className="bg-white/95 rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0263E0]"></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                      <Zap className="w-3.5 h-3.5 mr-1 text-[#0263E0]" />
                      核心优势
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">定制与融合优化</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 font-sans group-hover:text-[#0263E0] transition-colors">
                    高性能
                  </h3>

                  <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-normal">
                    <p>
                      每一台 TopQuant 高频服务器都采用定制部件并经集成优化、严格的可靠性测试流程生产，以保证能够满足用户的实际业务需求。
                    </p>
                    <p>
                      高频、量化交易现已成为金融市场中的重要一环。冠量系列高频服务器根据客户实际应用选择不同的配置，为客户提供具有竞争力的产品并在更佳性能和更大投资回报间取得完美平衡。冠量科技选用适合于高频服务器的高性能 CPU、主板、内存、低延迟网卡并配合定制组件（如定制机箱、高性能风扇、高效闭环液冷系统等），并进行严谨调校和融合优化，包括对 BIOS、内存、缓存、低延迟网卡进行匹配性调优，保证稳定性的同时，提升产品的性能，是高频、量化交易客户一站式产品优选。
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span className="flex items-center text-sky-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#0263E0]" />
                    匹配性调优
                  </span>
                  <span>一站式产品优选</span>
                </div>
              </div>

              {/* 核心优势 2: 高可靠性 */}
              <div className="bg-white/95 rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      核心优势
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">24×7 稳定运行</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 font-sans group-hover:text-emerald-700 transition-colors">
                    高可靠性
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    保证在生产环境中24×7连续稳定运行，避免宕机等意外风险，让交易员抓住每一次转瞬即逝的交易机会，是产品最关键的一环。基于高频服务器的特性，冠量科技以严谨的生产流程控制产品质量。包括CPU的筛选、主要部件的单独测试和主要部件的匹配性测试、性能测试、温度测试等。72小时至120小时的连续可靠性测试。在整个生产流程中保证每一台服务器的指标和参数正常。
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    72至120小时连续测试
                  </span>
                  <span>生产流程品控</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 
        首页模块：关于我们（左侧完整文案 + 3项核心指标，右侧真实服务器产品图）
        严格遵照用户指定真实文案与左右对称排版
      */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* 左侧：文字文案与三大核心数据 */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 顶部标签 */}
              <div className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-wider">
                <Award className="w-4 h-4 mr-1.5" />
                <span>关于我们</span>
              </div>

              {/* 主标题 */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                专注金融前端技术，<br className="hidden sm:inline" />
                <span className="text-[#0263E0]">铸造不可撼动的物理级算力底座。</span>
              </h2>

              {/* 正文第一段 */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                深圳冠量科技有限公司成立于2015年，是一家具有自主创新能力并为金融市场客户提供高频交易设备的金融科技企业。自创立初期开始，冠量科技就在高起点为客户提供具有领先水平的IT设备和服务。“冠量科技”始终把技术创新视为企业核心竞争力，不断推出高性能、低延迟解决方案、产品，并拓展算力市场，推出适应客户需要的解决方案、系列产品。
              </p>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                冠量科技拥有经验丰富的团队、具备成熟的产品研发和项目实施能力、覆盖全国的技术支持服务体系，除提供通用产品外，也为客户提供技术咨询、服务和产品定制。
              </p>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                冠量科技与众多高性能硬件产品供应商、低延迟产品供应商合作，并与市场上通用应用软件、主要的自研软件产品进行过适配、验证，冠量产品具有良好的性能和稳定性、可靠性。此外，冠量科技与业界众多集成商协同，已为大多数证券、期货、私募企业提供了产品和服务并得到认可。
              </p>

              {/* 关于我们 · 团队与价值观 */}
              <div className="p-5 sm:p-6 bg-slate-50/90 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="w-1.5 h-full bg-[#0263E0] absolute left-0 top-0"></div>
                <div className="pl-2">
                  <div className="text-xs font-bold text-[#0263E0] uppercase tracking-wider mb-1.5 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    <span>关于我们 · 团队与价值观</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    冠量公司是一个团结协作的团队，创新是冠量生存与发展的灵魂，我们富有拼搏精神，利用团队的智慧、毅力和满腔热情积极迎接挑战。冠量科技坚持诚信守法、客户至上的原则、坚持创新及团队精神。并要求每一位员工正直诚信、沟通包容，互相理解、行动迅速，注重成效；团队合作，勇于担当。让员工与公司共同成长。
                  </p>
                </div>
              </div>

              {/* 三大关键量化数据指标 */}
              <div className="pt-2 grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                  <div className="text-2xl sm:text-3xl font-black text-[#0263E0] font-mono tracking-tight">
                    2015年
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    深圳创立专注金融
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                  <div className="text-2xl sm:text-3xl font-black text-[#0263E0] font-mono tracking-tight">
                    5.8GHz
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    全核恒定极限锁频
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                  <div className="text-2xl sm:text-3xl font-black text-[#0263E0] font-mono tracking-tight">
                    100+项
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    严格可靠性验证控制
                  </div>
                </div>
              </div>

            </div>

            {/* 右侧：真实服务器产品实物图展示 (TopQuant 旗舰高频液冷服务器) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0B1E36] rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-2xl relative overflow-hidden text-white group">
                
                {/* 顶部机房照明微光装饰 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* 顶部标题与在线状态 */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-slate-200">
                      TopQuant 1U 旗舰高频液冷服务器 · 实物图解
                    </span>
                  </div>
                  <span className="text-[11px] text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    实体硬件隔离
                  </span>
                </div>

                {/* 服务器真实照片展示 */}
                <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-inner group">
                  <img 
                    src={serverImage} 
                    alt="TopQuant 旗舰超频液冷服务器实物图" 
                    className="w-full h-auto object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36]/90 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* 图片底部技术浮层 */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-[11px] text-slate-200">微通道纯铜液冷板 · 闭环温控</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800">
                      满载 ≤ 65℃
                    </span>
                  </div>
                </div>

                {/* 照片下方三大关键硬件说明 */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                    <div className="text-[11px] text-slate-400">核心主频</div>
                    <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">5.0~5.2GHz</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">全核极限锁频</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                    <div className="text-[11px] text-slate-400">交易网卡</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">X2522 25G</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">内核旁路穿透</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80">
                    <div className="text-[11px] text-slate-400">供电冗余</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">800W 1+1</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">双路热插拔</div>
                  </div>
                </div>

                {/* 底部保障与物理隔离背书 */}
                <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    纯物理硬件算力 · 零虚拟化抖动
                  </span>
                  <span>国家强制 CCC 认证</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
