import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceSupport } from '../components/ServiceSupport';
import { ChevronRight, Cpu, HardDrive } from 'lucide-react';

export const ServiceSupportPage: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* 驱动下载与服务保障主模块 */}
      <ServiceSupport />
    </div>
  );
};
