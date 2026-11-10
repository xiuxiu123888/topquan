import React, { useState } from 'react';
import { COMPANY_INFO, DRIVER_DOWNLOADS, DriverDownloadItem } from '../data/companyData';
import { 
  Download, 
  CheckCircle2, 
  PhoneCall, 
  Phone,
  Mail, 
  MapPin,
  HardDrive,
  Cpu,
} from 'lucide-react';

export const ServiceSupport: React.FC = () => {
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  const firmware = DRIVER_DOWNLOADS.filter(item => item.category === 'bios');

  const handleDownloadDriver = (item: DriverDownloadItem) => {
    const a = document.createElement('a');
    a.href = item.downloadUrl;
    a.download = item.downloadUrl.split('/').pop() || 'firmware.bin';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloadSuccessItem(item.id);
    setTimeout(() => setDownloadSuccessItem(null), 3000);
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
            提供经过实盘检验的专享 BIOS 固件；配备 7×24 小时技术应急专线与原厂工程师支持。
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
                官方固件下载
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                TQ1810R 专享金融锁频 BIOS 固件
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            {firmware.map(item => (
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
                        <span>固件下载</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}

            {firmware.length === 0 && (
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
