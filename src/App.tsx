import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { ProductCenterPage } from './pages/ProductCenterPage';
import { ServiceSupportPage } from './pages/ServiceSupportPage';
import { ContactPage } from './pages/ContactPage';
import { PartnersPage } from './pages/PartnersPage';
import { PdfViewerModal } from './components/PdfViewerModal';
import { ProductItem } from './data/companyData';

export default function App() {
  const [selectedPdfProduct, setSelectedPdfProduct] = useState<ProductItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handleOpenPdf = (product: ProductItem) => {
    setSelectedPdfProduct(product);
    setIsPdfModalOpen(true);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-sky-500 selection:text-white flex flex-col">
        {/* 路由切换时自动重置滚动条至顶部 */}
        <ScrollToTop />

        {/* 顶部企业级导航栏 (独立页面与独立路由) */}
        <Header />

        {/* 独立页面路由系统 */}
        <main className="flex-1">
          <Routes>
            {/* 1. 首页 (公司介绍、优势、技术之类) */}
            <Route path="/" element={<HomePage />} />

            {/* 2. 产品中心 (高频服务器、GPU服务器、普通服务器、配件，分Intel/AMD，详细配置，PDF跳转与下载) */}
            <Route 
              path="/products" 
              element={<ProductCenterPage onOpenPdf={handleOpenPdf} />} 
            />

            {/* 3. 合作伙伴 */}
            <Route path="/partners" element={<PartnersPage />} />

            {/* 4. 服务支持 (提供各种驱动下载，问题联系方式等) */}
            <Route path="/service" element={<ServiceSupportPage />} />

            {/* 5. 联系我们 (公司地址、邮箱、电话等) */}
            <Route path="/contact" element={<ContactPage />} />

            {/* 未匹配路由重定向至首页 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* 官方页脚系统 */}
        <Footer />

        {/* 高保真 PDF 规格书跳转预览与下载弹窗 (全站全局可用) */}
        <PdfViewerModal
          product={selectedPdfProduct}
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
        />

      </div>
    </HashRouter>
  );
}
