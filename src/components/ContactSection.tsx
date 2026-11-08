import React from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Server,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 标题 */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-widest mb-2">
            <Building2 className="w-4 h-4 mr-1.5" />
            <span>联系我们</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            联系我们 · 官方联系方式
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            欢迎各证券期货自营团队、量化对冲基金及做市商客户随时联系我们，交流超频温控、板级优化与服务器硬件配置方案。
          </p>
        </div>

        {/* 核心三大联系方式卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* 卡片 1: 联系电话 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0263E0] flex items-center justify-center mb-5 border border-sky-100 group-hover:bg-[#0263E0] group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                联系电话
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                工作日及交易时段随时致电咨询
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">办公座机电话</div>
                  <a 
                    href="tel:0755-23003729" 
                    className="text-xl font-black font-mono text-slate-900 hover:text-[#0263E0] transition-colors mt-0.5 block"
                  >
                    0755-23003729
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">移动电话 / 微信</div>
                  <a 
                    href="tel:18923779722" 
                    className="text-xl font-black font-mono text-[#0263E0] hover:underline mt-0.5 block"
                  >
                    18923779722
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>专人接听 · 快速响应</span>
            </div>
          </div>

          {/* 卡片 2: 官方邮箱 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0263E0] flex items-center justify-center mb-5 border border-sky-100 group-hover:bg-[#0263E0] group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                官方邮箱
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                商务采购、样机申请与技术调优对接
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">联系邮箱</div>
                  <a 
                    href="mailto:zhouwd@topquant.com.cn" 
                    className="text-base sm:text-lg font-bold font-mono text-[#0263E0] hover:underline break-all block select-all"
                  >
                    zhouwd@topquant.com.cn
                  </a>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed px-1">
                  欢迎通过邮件发送您的硬件需求、技术参数要求或配置清单，我们将尽快为您回复。
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#0263E0] mr-1.5 shrink-0" />
              <span>严格遵守金融行业保密协议</span>
            </div>
          </div>

          {/* 卡片 3: 公司地址 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0263E0] flex items-center justify-center mb-5 border border-sky-100 group-hover:bg-[#0263E0] group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                公司地址
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                深圳研发总部与硬件实验室
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">详细办公地址</div>
                  <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                    深圳市宝安区留仙一路2号高新奇园区2期1栋A601
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#0263E0]" />
                    <span>接待时间: 工作日 08:30 - 22:00</span>
                  </div>
                  <div className="text-[11px] text-slate-400">与国内证券日盘及期货夜盘交易时段同步护航</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>研发总部 · 原厂硬件实验室</span>
            </div>
          </div>

        </div>

        {/* 详细信息横向展示区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 左侧：公司基本概况 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center">
              <Building2 className="w-5 h-5 text-[#0263E0] mr-2" />
              企业概况与自主研发
            </h4>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-900">{COMPANY_INFO.name}</strong>成立于2015年，是一家具有自主创新能力并为金融市场客户提供高频交易设备的金融科技企业。自创立初期开始，冠量科技就在高起点为客户提供具有领先水平的IT设备和服务。“冠量科技”始终把技术创新视为企业核心竞争力，不断推出高性能、低延迟解决方案、产品，并拓展算力市场，推出适应客户需要的解决方案、系列产品。
              </p>
              <p>
                冠量科技拥有经验丰富的团队、具备成熟的产品研发和项目实施能力、覆盖全国的技术支持服务体系，除提供通用产品外，也为客户提供技术咨询、服务和产品定制。
              </p>
              <p>
                冠量科技与众多高性能硬件产品供应商、低延迟产品供应商合作，并与市场上通用应用软件、主要的自研软件产品进行过适配、验证，冠量产品具有良好的性能和稳定性、可靠性。此外，冠量科技与业界众多集成商协同，已为大多数证券、期货、私募企业提供了产品和服务并得到认可。
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                国家强制 CCC 认证
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                技术咨询与产品定制
              </span>
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                72至120小时连续可靠性测试
              </span>
            </div>
          </div>

          {/* 右侧：技术支持与服务保障承诺 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-5 h-5 text-[#0263E0] mr-2" />
              技术支持与服务保障
            </h4>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                冠量科技坚持客户至上的原则，为每一位合作伙伴提供高标准的技术响应。资深低时延硬件工程师全程参与售前方案制定与售后底层参数调优。
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800">全时段技术护航</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">与证券及期货夜盘交易时段同步在线</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800">原厂深度调优</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">BIOS锁频、内核微调与网卡旁路支持</div>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>严格遵守金融机构保密协议 (NDA)</span>
              <span className="font-bold text-[#0263E0]">7×24 小时技术保障</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
