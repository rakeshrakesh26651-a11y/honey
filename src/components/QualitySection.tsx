import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './Icons';
import { LAB_REPORT, QUALITY_CONTENT } from '../data/content';

export const QualitySection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="quality" className="w-full py-20 lg:py-32 bg-[#FAF8F0] border-t border-[#D9D5C8]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-[1120px] mx-auto">
          
          {/* LEFT: Large Certificate Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:max-w-[520px] flex-shrink-0 cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="relative w-full rounded-[20px] bg-white border border-[#D9D5C8] p-7 sm:p-9 shadow-[0_4px_20px_rgba(18,60,45,0.05)] hover:shadow-[0_12px_32px_rgba(18,60,45,0.1)] transition-all duration-300 transform group-hover:scale-[1.01]">
              
              {/* Document Header */}
              <div className="border-b border-[#D9D5C8] pb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#D6A83A] font-semibold">
                    Analytical Test Report
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#123C2D]/10 text-[#123C2D] font-mono text-[10px] font-semibold tracking-wider uppercase">
                    IS 4941:1994
                  </span>
                </div>
                <h3 className="font-serif text-[22px] font-semibold text-[#123C2D] leading-snug">
                  {LAB_REPORT.laboratory}
                </h3>
                <p className="font-sans text-[12px] text-[#607568] mt-0.5">
                  Official Quality Documentation for Honey Sample
                </p>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="py-4 grid grid-cols-2 gap-3 border-b border-[#D9D5C8] font-sans text-[13px]">
                <div>
                  <span className="text-[#607568] block text-[11px] uppercase font-mono">Report Number</span>
                  <span className="font-mono font-medium text-[#123C2D] text-[12px]">{LAB_REPORT.testReportNumber}</span>
                </div>
                <div>
                  <span className="text-[#607568] block text-[11px] uppercase font-mono">Report Date</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.reportDate}</span>
                </div>
                <div>
                  <span className="text-[#607568] block text-[11px] uppercase font-mono">Sample</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.sampleDescription}</span>
                </div>
                <div>
                  <span className="text-[#607568] block text-[11px] uppercase font-mono">Standard</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.gradeDescription}</span>
                </div>
              </div>

              {/* Key Tested Parameters Preview */}
              <div className="py-4 space-y-2.5">
                <span className="font-mono text-[11px] uppercase text-[#607568] tracking-wider block">
                  Key Parameters Tested
                </span>
                <div className="space-y-1.5 font-sans text-[13px]">
                  <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]/50">
                    <span className="text-[#2A2118]/80">Specific Gravity @ 27°C</span>
                    <span className="font-mono font-medium text-[#123C2D]">1.41 (Min 1.37)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]/50">
                    <span className="text-[#2A2118]/80">Moisture</span>
                    <span className="font-mono font-medium text-[#123C2D]">18.79% (Max 20%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]/50">
                    <span className="text-[#2A2118]/80">Total Reducing Sugar</span>
                    <span className="font-mono font-medium text-[#123C2D]">72.0% (Min 70%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]/50">
                    <span className="text-[#2A2118]/80">Fiehe's Test</span>
                    <span className="font-mono font-medium text-[#123C2D]">Negative</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#2A2118]/80">HMF</span>
                    <span className="font-mono font-medium text-[#123C2D]">Negative</span>
                  </div>
                </div>
              </div>

              {/* Remark Box */}
              <div className="mt-2 p-3.5 rounded-xl bg-[#F5F1E6] border border-[#D9D5C8] text-[12px] text-[#2A2118]/80 leading-relaxed">
                <strong className="text-[#123C2D] font-medium block mb-0.5">Laboratory Remark:</strong>
                Honey sample largely complies with the requirements of IS 4941:1994 for Special Grade honey.
              </div>

              {/* Hover Trigger */}
              <div className="mt-5 pt-3 border-t border-[#D9D5C8] flex items-center justify-between text-[#123C2D] font-mono text-[12px] tracking-wide font-medium">
                <span>CLICK TO EXPAND REPORT</span>
                <span className="group-hover:translate-x-1 transition-transform text-[#D6A83A]">→</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Quality Content Block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:max-w-[520px] flex flex-col items-start space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#123C2D] font-medium leading-[18.2px]">
                {QUALITY_CONTENT.eyebrow}
              </span>
            </div>

            <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#123C2D] leading-[1.1] tracking-[-0.01em]">
              {QUALITY_CONTENT.heading}
            </h2>

            <p className="font-sans text-[17px] md:text-[19px] font-normal text-[#2A2118]/85 leading-[1.55]">
              {QUALITY_CONTENT.body}
            </p>

            {/* Verification Metadata Box */}
            <div className="w-full p-5 rounded-[16px] bg-white border border-[#D9D5C8] space-y-3 font-sans text-[14px] shadow-2xs">
              <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]">
                <span className="text-[#607568]">Tested by:</span>
                <span className="font-medium text-[#123C2D] text-right">{QUALITY_CONTENT.testHouse}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]">
                <span className="text-[#607568]">Report:</span>
                <span className="font-mono font-medium text-[#123C2D]">{QUALITY_CONTENT.reportNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]">
                <span className="text-[#607568]">Date:</span>
                <span className="font-medium text-[#123C2D]">{QUALITY_CONTENT.reportDate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#D9D5C8]">
                <span className="text-[#607568]">Sample:</span>
                <span className="font-medium text-[#123C2D]">{QUALITY_CONTENT.sampleName}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#607568]">Standard:</span>
                <span className="font-medium text-[#123C2D]">{QUALITY_CONTENT.standard} (Special Grade)</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center h-[50px] px-8 rounded-full bg-[#123C2D] hover:bg-[#08291F] text-white font-sans text-[15px] font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
              >
                {QUALITY_CONTENT.secondaryCta}
              </button>
              <a
                href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0APlease%20share%20the%20laboratory%20test%20report%20documentation%20(TNTH/M-0366/2026-27).%20Thank%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center h-[50px] px-6 rounded-full border border-[#D9D5C8] bg-white hover:bg-[#FAF8F0] hover:border-[#123C2D] text-[#123C2D] font-sans text-[14px] font-medium transition-colors"
              >
                Request on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FULL TEST REPORT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-[#08291F]/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[760px] bg-[#FAF8F0] rounded-[24px] p-6 sm:p-10 shadow-2xl z-10 border border-[#D9D5C8] max-h-[90vh] overflow-y-auto space-y-6 my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#D9D5C8] pb-5">
                <div>
                  <span className="font-mono text-[11px] text-[#D6A83A] tracking-widest uppercase font-semibold block mb-1">
                    Official Analysis Certificate
                  </span>
                  <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold text-[#123C2D]">
                    {LAB_REPORT.laboratory}
                  </h3>
                  <p className="font-sans text-[13px] text-[#607568] mt-1">
                    Analytical Test Report No: <span className="font-mono font-medium text-[#123C2D]">{LAB_REPORT.testReportNumber}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#123C2D] hover:opacity-60 transition-opacity rounded-full bg-white border border-[#D9D5C8]"
                  aria-label="Close modal"
                >
                  <CloseIcon size={22} />
                </button>
              </div>

              {/* Certificate Parameters Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white border border-[#D9D5C8] font-sans text-[13px]">
                <div>
                  <span className="text-[#607568] block text-[10px] uppercase font-mono">Sample</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.sampleDescription}</span>
                </div>
                <div>
                  <span className="text-[#607568] block text-[10px] uppercase font-mono">Report Date</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.reportDate}</span>
                </div>
                <div>
                  <span className="text-[#607568] block text-[10px] uppercase font-mono">Analysis Started</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.analysisStarted}</span>
                </div>
                <div>
                  <span className="text-[#607568] block text-[10px] uppercase font-mono">Completed</span>
                  <span className="font-medium text-[#123C2D]">{LAB_REPORT.analysisCompleted}</span>
                </div>
              </div>

              {/* Verified Results Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] uppercase text-[#123C2D] tracking-wider font-semibold">
                    Tested Parameters & Analysis Results
                  </span>
                  <span className="font-mono text-[11px] text-[#607568]">
                    Standard: {LAB_REPORT.standardReferenced}
                  </span>
                </div>

                <div className="w-full bg-white rounded-xl border border-[#D9D5C8] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-[13px]">
                      <thead className="bg-[#FAF8F0] border-b border-[#D9D5C8] font-mono text-[11px] uppercase text-[#123C2D]">
                        <tr>
                          <th className="py-3 px-4">Parameter</th>
                          <th className="py-3 px-4">Result</th>
                          <th className="py-3 px-4">Requirement ({LAB_REPORT.standardReferenced})</th>
                          <th className="py-3 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9D5C8]/60 text-[#2A2118]/85">
                        {LAB_REPORT.testResults.map((param, index) => (
                          <tr key={index} className="hover:bg-[#FAF8F0]/60 transition-colors">
                            <td className="py-2.5 px-4 font-medium text-[#123C2D]">{param.parameter}</td>
                            <td className="py-2.5 px-4 font-mono font-semibold text-[#123C2D]">{param.result}</td>
                            <td className="py-2.5 px-4 font-mono text-[#607568]">{param.requirement}</td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#123C2D]/10 text-[#123C2D]">
                                {param.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Report Remark */}
              <div className="p-4 rounded-xl bg-white border border-[#D9D5C8] space-y-1.5 font-sans">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#123C2D] font-semibold block">
                  Report Remark
                </span>
                <p className="text-[13px] text-[#2A2118]/85 leading-relaxed">
                  {LAB_REPORT.remark}
                </p>
                <p className="text-[11px] text-[#607568] pt-1">
                  Reference: IS 4941:1994 (Special Grade honey requirements). Analysis performed by {LAB_REPORT.laboratory}.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0APlease%20share%20the%20complete%20laboratory%20test%20report%20PDF%20documentation%20(TNTH/M-0366/2026-27).%20Thank%20you!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#123C2D] hover:bg-[#08291F] text-white font-sans text-sm font-medium text-center transition-colors shadow-sm"
                >
                  Request Full PDF Documentation on WhatsApp
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-3.5 px-8 rounded-full border border-[#D9D5C8] bg-white hover:bg-[#FAF8F0] text-[#123C2D] font-sans text-sm font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
