import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCenter } from '../components/ProductCenter';
import { ProductItem } from '../data/companyData';
import { ChevronRight, Server, ShieldCheck, FileText } from 'lucide-react';

interface ProductCenterPageProps {
  onOpenPdf: (product: ProductItem) => void;
}

export const ProductCenterPage: React.FC<ProductCenterPageProps> = ({ onOpenPdf }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* 核心产品中心列表 */}
      <ProductCenter
        onOpenPdf={onOpenPdf}
        onRequestPoC={() => navigate('/contact')}
      />
    </div>
  );
};
