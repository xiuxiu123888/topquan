import React, { useState } from 'react';
import { ProductItem, COMPANY_INFO } from '../data/companyData';
import { TopQuantLogo } from './TopQuantLogo';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Check, 
  Cpu, 
  Server, 
  Zap, 
  Layers, 
  Clock, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { downloadMockPdf, generateMockPdfBlob } from '../utils/mockPdf';

interface PdfViewerModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ product, isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const totalPages = product.pdfPages || 4;

  const handleDownload = () => {
    setDownloadSuccess(true);
    // Real mock PDF file download
    downloadMockPdf(product);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3500);
  };

  const handleOpenNativePdf = () => {
    const blob = generateMockPdfBlob(product);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* PDF 浏览器顶栏控制器 (类似 Chrome/Acrobat PDF 查看器) */}
        <div className="bg-[#1E293B] text-slate-200 px-6 py-3 flex items-center justify-between border-b border-slate-700 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {product.id}_Technical_Datasheet_v2026.pdf
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                  {product.pdfFileSize}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                深圳冠量科技有限公司 · 官方技术规格白皮书 · 金融机密级别
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 翻页控制器 */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg px-2 py-1 text-xs space-x-2 border border-slate-700">
              <button 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-200 text-xs">
                {currentPage} / {totalPages}
              </span>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 下载 PDF 按钮 */}
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded bg-[#0263E0] hover:bg-[#0052cc] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? '已下载 PDF' : '下载 PDF 文件'}</span>
            </button>

            <button
              onClick={handleOpenNativePdf}
              className="hidden sm:flex px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors items-center space-x-1 cursor-pointer"
              title="在新窗口打开标准 PDF"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>新标签页打开</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden md:flex p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="打印白皮书"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="关闭预览"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF 页面模拟渲染视窗 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/80">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl border border-slate-300 p-8 sm:p-12 relative font-sans text-slate-800">
            
            {/* 水印 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
              <span className="text-8xl font-black font-mono rotate-[-30deg] tracking-widest text-slate-900">
                TOPQUANT CONFIDENTIAL
              </span>
            </div>

            {/* 页眉与企业抬头 */}
            <div className="pb-6 border-b-2 border-slate-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TopQuantLogo className="h-14" />
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-[#0263E0] font-mono">PRODUCT SPECIFICATION SHEET</div>
                <div className="text-[11px] text-slate-400 font-mono">DOCUMENT ID: TQ-DS-{product.id}-2026</div>
                <div className="text-[10px] text-slate-400">发行日期: 2026年4月 · 金融核心机密</div>
              </div>
            </div>

            {/* PDF 内容区：第 1 页或通用页 */}
            {currentPage === 1 && (
              <div className="mt-8 space-y-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold mb-2">
                    <span>{product.categoryName}</span>
                    <span>·</span>
                    <span>{product.platform} 平台</span>
                    <span>·</span>
                    <span>{product.series}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {product.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {product.tagline}
                  </p>
                </div>

                {/* 硬件形态与技术规格摘要大卡片 */}
                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">FORM FACTOR</div>
                    <div className="font-bold text-slate-900 mt-0.5">{product.formFactor.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500">{product.formFactor}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">CPU CLOCK</div>
                    <div className="font-bold text-[#0263E0] mt-0.5">{product.maxFreq.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500">全核持续锁频</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">TICK-TO-TRADE</div>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">{product.latencyBench}</div>
                    <div className="text-[10px] text-slate-500">超低纳秒级时延</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">COOLING</div>
                    <div className="font-bold text-slate-900 mt-0.5">{product.cooling.includes('液冷') || product.cooling.includes('水冷') ? '闭环水冷' : '高效风冷'}</div>
                    <div className="text-[10px] text-slate-500">工业防漏液设计</div>
                  </div>
                </div>

                {/* 详细技术指标参数矩阵 (优先呈现 specsTable) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200 flex items-center justify-between">
                    <span>一、 核心硬件工程参数配置清单 (Engineering Spec Matrix)</span>
                    <span className="font-mono text-[11px] text-slate-400">SECTION 1.0</span>
                  </h4>

                  <table className="w-full text-xs mt-3 border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      {product.specsTable && product.specsTable.length > 0 ? (
                        product.specsTable.map((spec, sIdx) => (
                          <tr key={sIdx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600 w-1/3 bg-slate-50/40 px-2.5 rounded-l">
                              {spec.label}
                            </td>
                            <td className="py-2.5 text-slate-900 px-2.5 font-medium">
                              {spec.value}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600 w-1/3">处理器 (Processor)</td>
                            <td className="py-2.5 text-slate-900">{product.processor}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">时钟频率 (Clock Frequency)</td>
                            <td className="py-2.5 text-[#0263E0] font-semibold">{product.maxFreq}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">内存系统 (Memory Subsystem)</td>
                            <td className="py-2.5 text-slate-900">{product.memory}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">存储阵列 (Storage Topology)</td>
                            <td className="py-2.5 text-slate-900">{product.storage}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">PCIe 扩展通道 (Expansion)</td>
                            <td className="py-2.5 text-slate-900">{product.pcieSlots}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">网络与加速卡 (Networking)</td>
                            <td className="py-2.5 text-slate-900">{product.networking}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">散热设计 (Thermal Solution)</td>
                            <td className="py-2.5 text-slate-900">{product.cooling}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-600">供电与冗余 (Power Supply)</td>
                            <td className="py-2.5 text-slate-900">{product.powerSupply}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 架构亮点 */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">
                    二、 军工金融级软硬件定制亮点
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-700">
                    {product.keyFeatures.map((f, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentPage >= 2 && (
              <div className="mt-8 space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">SECTION 2.0</div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    出厂 72 小时全应力测试与 PCIe 眼图抖动实测报告
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    每一台 {product.id} 在进入证券/期货机房前，均必须通过冠量科技硬件实验室的标准出厂检验：
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500">TEST ITEM</span>
                    <span className="text-slate-500">CRITERIA</span>
                    <span className="text-slate-500">RESULT</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span>Prime95 All-Core 72h Stress</span>
                    <span>Zero Hardware Error (0/72h)</span>
                    <span className="text-emerald-600 font-bold">PASSED [100%]</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span>1U Chassis 10980XE Liquid Cooling Temp</span>
                    <span>&le; 65&deg;C Sustained Load</span>
                    <span className="text-emerald-600 font-bold">PASSED [63.2&deg;C]</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span>PCIe Gen5 Signal Eye Height</span>
                    <span>&gt; 250 mV Open Area</span>
                    <span className="text-emerald-600 font-bold">PASSED [285 mV]</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span>Clock Jitter Peak-to-Peak</span>
                    <span>&lt; 15 ps RMS</span>
                    <span className="text-emerald-600 font-bold">PASSED [9.8 ps]</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span>Thermal Throttling Drop Count</span>
                    <span>Strictly 0 Drops</span>
                    <span className="text-emerald-600 font-bold">PASSED [LOCKED]</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1">
                  <div className="font-bold flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-[#0263E0]" />
                    金融合规与实盘环境保障声明
                  </div>
                  <p className="text-[11px] text-sky-800 leading-relaxed">
                    本设备符合中国各大金融期货与证券交易所机柜托管标准。冠量科技对本型号提供为期 3 年的原厂整机质保及全国 4 小时紧急现场驻场维保服务。
                  </p>
                </div>
              </div>
            )}

            {/* 页脚签章与联络 */}
            <div className="mt-12 pt-6 border-t-2 border-slate-900 flex items-end justify-between text-[11px] text-slate-500">
              <div>
                <div>深圳冠量科技有限公司 · 硬件工程技术委员会</div>
                <div className="font-sans">地址: 深圳市宝安区留仙一路2号高新奇园区2期1栋A601</div>
                <div className="font-mono mt-0.5">联系电话: 0755-23003729 / 18923779722 · zhouwd@topquant.com.cn</div>
              </div>

              {/* 红色官方技术检验印章 */}
              <div className="w-24 h-24 rounded-full border-2 border-red-600 flex flex-col items-center justify-center text-red-600 text-center font-bold tracking-widest text-[9px] transform rotate-[-8deg] opacity-85 select-none pointer-events-none">
                <span>深圳冠量科技</span>
                <span className="text-[11px] my-0.5">★</span>
                <span>质检验收合格</span>
                <span className="text-[7px] font-mono mt-0.5">QC APPROVED</span>
              </div>
            </div>

            {/* 页码指示 */}
            <div className="mt-4 text-center font-mono text-[10px] text-slate-400">
              - Page {currentPage} of {totalPages} -
            </div>

          </div>
        </div>

        {/* 底部条 */}
        <div className="bg-slate-100 border-t border-slate-300 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <span>如需该机型定制配置报价或安排样机借测，请直接致电 0755-23003729 或 18923779722</span>
          <button
            onClick={handleDownload}
            className="text-[#0263E0] font-semibold hover:underline flex items-center"
          >
            <span>另存为本地 PDF 文件</span>
            <Download className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
