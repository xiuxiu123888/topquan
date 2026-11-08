import React from 'react';
import { PARTNERS } from '../data/companyData';
import { Award, ExternalLink } from 'lucide-react';

export const PartnersSection: React.FC = () => {
  return (
    <section className="min-h-[calc(100vh-8rem)] py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center text-xs font-bold text-[#0263E0] uppercase tracking-widest mb-3">
            <Award className="w-4 h-4 mr-1.5" />
            <span>生态合作</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            合作伙伴
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
            冠量科技与芯片、网络、服务器与金融技术厂商保持合作。点击下方合作商，进入其公司官网。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PARTNERS.map(partner => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group min-h-64 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="h-28 flex items-center justify-center mb-6">
                  <img
                    src={partner.logo}
                    alt={`${partner.name}标志`}
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 group-hover:text-[#0263E0] transition-colors">
                  {partner.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500 tracking-wide">
                  {partner.enName}
                </p>
              </div>
              <div className="mt-8 inline-flex items-center text-sm font-semibold text-[#0263E0]">
                <span>进入官网</span>
                <ExternalLink className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
