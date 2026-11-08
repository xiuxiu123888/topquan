import React, { useState } from 'react';
import { COMPANY_INFO, DRIVER_DOWNLOADS, DriverDownloadItem } from '../data/companyData';
import { 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  PhoneCall, 
  Phone,
  Mail, 
  Clock, 
  MapPin,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  Server
} from 'lucide-react';

export const ServiceSupport: React.FC = () => {
  const [driverCategory, setDriverCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  const filteredDrivers = DRIVER_DOWNLOADS.filter(item => {
    if (driverCategory !== 'all' && item.category !== driverCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || 
             item.supportedOS.some(os => os.toLowerCase().includes(q)) ||
             item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDownloadDriver = (item: DriverDownloadItem) => {
    setDownloadSuccessItem(item.id);
    const a = document.createElement('a');
    a.href = '#';
    a.download = item.name.replace(/\s+/g, '_') + '.tar.gz';
    document.body.appendChild(a);
    setTimeout(() => {
      setDownloadSuccessItem(null);
    }, 3000);
  };

  return (
    <section id="service" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 标题 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-widest mb-2">
            <Cpu className="w-4 h-4 mr-1.5" />
            <span>服务支持与技术保障</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            驱动下载与技术联系方式
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            提供经过实盘严格检验的专用网卡驱动、FPGA开发包、低时延Linux内核脚本及专享BIOS固件下载；配备 7×24 小时技术应急专线与原厂工程师支持。
          </p>
        </div>

        {/* 
          模块一：各种驱动下载专区 (Drivers & Firmware Downloads)
        */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 mb-16 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <HardDrive className="w-5 h-5 text-[#0263E0] mr-2" />
                官方驱动与固件下载中心
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                包含 Solarflare Onload、Silicom FPGA、Mellanox OFED、BIOS固件与低延迟调优脚本
              </p>
            </div>

            {/* 搜索框 */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="搜索驱动名称、操作系统版本..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* 驱动类别过滤器 */}
          <div className="pt-4 pb-6 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setDriverCategory('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                driverCategory === 'all'
                  ? 'bg-[#0263E0] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部下载 ({DRIVER_DOWNLOADS.length})
            </button>
            <button
              onClick={() => setDriverCategory('nic')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                driverCategory === 'nic'
                  ? 'bg-[#0263E0] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              网卡与内核旁路驱动
            </button>
            <button
              onClick={() => setDriverCategory('fpga')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                driverCategory === 'fpga'
                  ? 'bg-[#0263E0] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              FPGA开发包与DMA驱动
            </button>
            <button
              onClick={() => setDriverCategory('bios')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                driverCategory === 'bios'
                  ? 'bg-[#0263E0] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              锁频 BIOS 固件
            </button>
            <button
              onClick={() => setDriverCategory('os')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                driverCategory === 'os'
                  ? 'bg-[#0263E0] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              低时延 Linux 内核脚本
            </button>
            <button
              onClick={() => setDriverCategory('ptp')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                driverCategory === 'ptp'
                  ? 'bg-[#0263E0] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              PTP 纳秒时钟套件
            </button>
          </div>

          {/* 驱动列表表格/卡片 */}
          <div className="space-y-3">
            {filteredDrivers.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.version}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-100">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      更新日期: {item.releaseDate} · 文件大小: {item.fileSize}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {item.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 mr-1">支持系统:</span>
                    {item.supportedOS.map((os, osIdx) => (
                      <span key={osIdx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {os}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleDownloadDriver(item)}
                    className="w-full md:w-auto px-4 py-2 bg-[#0263E0] hover:bg-[#0052cc] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                  >
                    {downloadSuccessItem === item.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>已开始下载</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>立即下载</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filteredDrivers.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs">
                没有找到符合条件的驱动程序，请尝试调整搜索关键词。
              </div>
            )}
          </div>
        </div>

        {/* 
          模块二：官方问题联系方式与技术支持通道（精简纯信息展示，无工单表单）
        */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
              <PhoneCall className="w-6 h-6 text-[#0263E0] mr-2.5" />
              技术问题联系方式与支持渠道
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              如遇时钟抖动、BIOS调优、内核丢包或机房硬件技术问题，可通过以下官方电话及邮箱与资深工程师直接对接。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 电话支持卡片 */}
            <div className="bg-[#0B2545] text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">技术咨询与应急电话</h4>
                    <p className="text-xs text-sky-200">7×24小时全时在线响应</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="text-xs text-sky-200">办公座机电话</div>
                    <div className="text-2xl font-black font-mono tracking-wider text-white mt-0.5">
                      0755-23003729
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="text-xs text-sky-200">技术负责人手机 / 微信</div>
                    <div className="text-2xl font-black font-mono tracking-wider text-emerald-400 mt-0.5">
                      18923779722
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 邮箱支持卡片 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0263E0] flex items-center justify-center border border-sky-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">技术支持与驱动邮箱</h4>
                    <p className="text-xs text-slate-500">邮件直达技术委员会</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs text-slate-500">官方技术支持与商务邮箱</div>
                    <div className="text-lg font-bold font-mono text-[#0263E0] mt-1 break-all select-all">
                      zhouwd@topquant.com.cn
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    欢迎将故障日志（dmesg、Onload诊断包、IPMI事件日志）发送至此邮箱，工程师将在 30 分钟内分析并回复优化方案。
                  </p>
                </div>
              </div>
            </div>

            {/* 办公地址与机房驻场卡片 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0263E0] flex items-center justify-center border border-sky-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">总部地址与现场技术接待</h4>
                    <p className="text-xs text-slate-500">深圳硬件实验室与测试中心</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                    <div className="text-slate-500">公司地址</div>
                    <div className="font-bold text-slate-900 mt-1 leading-relaxed">
                      深圳市宝安区留仙一路2号高新奇园区2期1栋A601
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
