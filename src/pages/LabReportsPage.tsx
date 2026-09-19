import React from 'react';
import { motion } from 'framer-motion';
import { LAB_REPORT } from '../data/himalayanHarvest';
import { AnimatedHeading } from '../components/motion/AnimatedHeading';
import { PageTransition } from '../components/motion/PageTransition';

interface LabReportsPageProps {
  onNavigate: (path: string) => void;
}

export const LabReportsPage: React.FC<LabReportsPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-10 md:py-18">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold">LAB REPORTS</span>
          </nav>

          {/* Editorial Banner */}
          <div className="text-center max-w-[800px] mx-auto mb-14 md:mb-18 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#242424] font-semibold">
                INDEPENDENT SCIENTIFIC VALIDATION
              </span>
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            </motion.div>

            <AnimatedHeading
              text="LAB REPORTS"
              as="h1"
              className="font-serif text-[38px] sm:text-[52px] md:text-[60px] font-semibold text-[#242424] leading-[1.05] tracking-[-0.02em]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="font-sans text-[17px] sm:text-[20px] text-[#242424]/85 leading-[1.55]"
            >
              Quality you can verify. Comprehensive chemical analysis performed by Tamilnadu Test House Private Limited under Indian Standard IS 4941:1994.
            </motion.p>
          </div>

          {/* Certificate Metadata Card */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[22px] p-6 sm:p-8 md:p-10 mb-10 shadow-[0_4px_20px_rgba(36, 36, 36,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D9D7D0]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block mb-1">
                  OFFICIAL TEST CERTIFICATE
                </span>
                <h2 className="font-serif text-[24px] sm:text-[28px] font-semibold text-[#242424]">
                  {LAB_REPORT.laboratory}
                </h2>
                <p className="font-mono text-[13px] text-[#686863] mt-1">
                  Report No: {LAB_REPORT.testReportNumber} • Issued: {LAB_REPORT.reportDate}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#242424] text-[#FAF9F5] font-mono text-[12px] font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#DDAA55] animate-pulse" />
                  IS 4941 SPECIAL GRADE
                </span>
              </div>
            </div>

            {/* Test Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#D9D7D0] text-[13px]">
              <div>
                <span className="block font-mono text-[#686863] uppercase text-[11px]">Sample</span>
                <span className="font-semibold text-[#242424]">{LAB_REPORT.sampleDescription}</span>
              </div>
              <div>
                <span className="block font-mono text-[#686863] uppercase text-[11px]">Standard</span>
                <span className="font-semibold text-[#242424]">{LAB_REPORT.standardReferenced}</span>
              </div>
              <div>
                <span className="block font-mono text-[#686863] uppercase text-[11px]">Testing Started</span>
                <span className="font-semibold text-[#242424]">{LAB_REPORT.analysisStarted}</span>
              </div>
              <div>
                <span className="block font-mono text-[#686863] uppercase text-[11px]">Testing Completed</span>
                <span className="font-semibold text-[#242424]">{LAB_REPORT.analysisCompleted}</span>
              </div>
            </div>

            {/* Summary Remark */}
            <div className="pt-6">
              <p className="font-sans text-[14px] sm:text-[15px] text-[#242424]/85 italic leading-[1.6]">
                "{LAB_REPORT.remark}"
              </p>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[22px] overflow-hidden mb-16 shadow-[0_4px_20px_rgba(36, 36, 36,0.04)]">
            <div className="px-6 py-5 bg-[#242424] text-[#FAF9F5] flex items-center justify-between">
              <h3 className="font-serif text-[18px] sm:text-[20px] font-semibold">
                Tested Chemical & Physical Parameters
              </h3>
              <span className="font-mono text-[12px] text-[#DDAA55] font-bold">
                11 PARAMETERS ANALYZED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-[14px]">
                <thead>
                  <tr className="bg-[#F4F1EA] border-b border-[#D9D7D0] text-[#242424] font-mono text-[12px] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Parameter</th>
                    <th className="py-3.5 px-6">Observed Value</th>
                    <th className="py-3.5 px-6">IS 4941 Requirement</th>
                    <th className="py-3.5 px-6 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D7D0]">
                  {LAB_REPORT.testResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F4F1EA]/60 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#242424]">
                        {row.parameter}
                      </td>
                      <td className="py-4 px-6 font-mono text-[#242424] font-semibold">
                        {row.result}
                      </td>
                      <td className="py-4 px-6 font-mono text-[#686863]">
                        {row.requirement}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#242424]/10 text-[#242424] font-mono text-[11px] font-bold">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="text-center py-10 bg-[#FAF9F5] rounded-[20px] border border-[#D9D7D0] space-y-4">
            <h3 className="font-serif text-[24px] font-semibold text-[#242424]">
              Experience Verified Mountain Honey
            </h3>
            <p className="font-sans text-[15px] text-[#686863] max-w-[500px] mx-auto">
              Every jar on our store is bottled according to these uncompromising laboratory standards.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/shop')}
                className="px-8 py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all cursor-pointer"
              >
                BROWSE OUR HONEYS
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
