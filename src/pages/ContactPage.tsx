import React from 'react';
import { Link } from 'react-router-dom';
import { ContactSection } from '../components/ContactSection';
import { ChevronRight, Building2, MapPin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* 联系我们与预约主模块 */}
      <ContactSection />
    </div>
  );
};
