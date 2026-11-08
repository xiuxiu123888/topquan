import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../data/companyData';
import { TopQuantLogo } from './TopQuantLogo';
import { Server, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1E36] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* 公司品牌与简介 */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center group py-1">
              <TopQuantLogo variant="light" className="h-14" />
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed pr-6">
              深圳冠量科技有限公司成立于2015年，是一家具有自主创新能力并为金融市场客户提供高频交易设备的金融科技企业。
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 font-mono">
              <div className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-sky-400 shrink-0" />
                <span>联系电话: <strong className="text-white font-sans">0755-23003729 / 18923779722</strong></span>
              </div>
              <div className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2 text-sky-400 shrink-0" />
                <span>官方邮箱: <strong className="text-white font-sans">{COMPANY_INFO.email}</strong></span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-3.5 h-3.5 mr-2 text-sky-400 shrink-0 mt-0.5" />
                <span>地址: {COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* 1. 产品中心导航 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              产品中心 (Intel / AMD)
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="hover:text-white transition-colors block">
                  高频服务器 (极致低时延)
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors block">
                  GPU服务器 (多卡AI/量化回测)
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors block">
                  普通服务器 (行情清洗与通用计算)
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors block">
                  配件 (低延迟网卡 / FPGA / 超频内存)
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sky-400 hover:text-white transition-colors inline-flex items-center">
                  <span>PDF 规格书跳转与下载</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* 2. 首页生态与服务支持 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              生态与服务支持
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/partners" className="hover:text-white transition-colors block">
                  合作伙伴
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors block">
                  驱动下载中心 (Solarflare / FPGA / BIOS)
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors block">
                  7×24小时应急技术电话
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-white transition-colors block">
                  原厂底层参数定制与调优
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. 联系我们 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              联系我们
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors block">
                  研发总部地址
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors block">
                  联系电话与邮箱
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors block">
                  返回网站首页
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 底部版权与合规声明 */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} 深圳冠量科技有限公司 保留所有权利. 粤ICP备XXXXXXXX号
          </div>
          <div className="mt-3 sm:mt-0 flex items-center space-x-6">
            <span>金融级硬件可靠性合规</span>
            <span>严格保密协议 (NDA)</span>
            <span>ISO9001 质量管理体系认证</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
