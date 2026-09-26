/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ClinicalCognitiveSummary,
  GameSessionResult,
  MedicationRoutineItem,
  SupportedLanguage,
} from '../../types';
import {
  INITIAL_CLINICAL_SUMMARY,
  INITIAL_GAME_HISTORY,
  INITIAL_MEDICATIONS,
} from '../../data/mockCaregiverData';
import { UI_STRINGS } from '../../data/culturalData';
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Pill,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface CaregiverDashboardProps {
  language: SupportedLanguage;
  sessionHistory: GameSessionResult[];
  onSwitchToElderMode: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  language,
  sessionHistory,
}) => {
  const strings = UI_STRINGS[language];
  const [summary, setSummary] = useState<ClinicalCognitiveSummary>(INITIAL_CLINICAL_SUMMARY);
  const [isGeneratingAIReport, setIsGeneratingAIReport] = useState<boolean>(false);
  const [medications] = useState<MedicationRoutineItem[]>(INITIAL_MEDICATIONS);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'meds' | 'sundowning'>('overview');
  const [caregiverNotes, setCaregiverNotes] = useState<string[]>([
    language === 'hi'
      ? '२५ सितंबर: ढोलक की मधुर थाप सुनकर बहुत प्रसन्न हुईं। मुस्कुराते हुए पुराने दिनों की रसोई याद की।'
      : language === 'mr'
      ? '२५ सप्टेंबर: मृदुंगाचा नाद ऐकून चेहऱ्यावर खूप आनंद दिसला. हसतमुखाने जुन्या दिवसांतील स्वयंपाकघराची आठवण काढली.'
      : 'Sep 25: Responded with deep joy when hearing gentle folk drum rhythms. Smiled and recalled family kitchen memories.',
    language === 'hi'
      ? '२३ सितंबर: शाम ५:१५ बजे गोधूलि वेला में हल्की बेचैनी; बारिश की शांत धुन बजाने पर १० मिनट में पूर्ण शांति।'
      : language === 'mr'
      ? '२३ सप्टेंबर: संध्याकाळी ५:१५ वाजता सांजवेळेला थोडी अस्वस्थता; पावसाचे शांत सूर लावताच १० मिनिटांत शांतता लाभली.'
      : 'Sep 23: Slight restlessness around 5:15 PM twilight; playing peaceful rain soundscapes restored calmness within 10 minutes.',
  ]);
  const [newNote, setNewNote] = useState<string>('');

  const combinedHistory = [...sessionHistory, ...INITIAL_GAME_HISTORY];

  // Refresh AI Clinical Assessment
  const handleGenerateAIReport = async () => {
    setIsGeneratingAIReport(true);
    try {
      const res = await fetch('/api/gemini/clinical-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameStats: combinedHistory.slice(0, 8),
          sentimentHistory: ['peaceful', 'nostalgic', 'peaceful', 'calm'],
          patientAge: 74,
          language: language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English',
        }),
      });
      const data = await res.json();
      if (data.overallStabilityScore) {
        setSummary(data);
      }
    } catch (e) {
      console.error('Error generating AI clinical report:', e);
    } finally {
      setIsGeneratingAIReport(false);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const formatted = `${new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US', { month: 'short', day: 'numeric' })}: ${newNote.trim()}`;
    setCaregiverNotes([formatted, ...caregiverNotes]);
    setNewNote('');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const activeClinicalSummary =
    summary.translations?.[language]?.clinicalSummary || summary.clinicalSummary;
  const activeRecommendations =
    summary.translations?.[language]?.caregiverRecommendations || summary.caregiverRecommendations;
  const activeSundowningRisk =
    summary.translations?.[language]?.sundowningRisk || summary.sundowningRisk;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Patient Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-[#2d6a4f]/20 shrink-0 shadow-xs">
            <img
              src="/src/assets/images/ne_family_memory_1790407141661.jpg"
              alt={strings.patientName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold text-[#0f382c]">
                {strings.patientName}
              </h2>
              <span className="text-xs font-bold text-[#2d6a4f] bg-[#eef7f2] px-2.5 py-0.5 rounded-full border border-[#2d6a4f]/30">
                {strings.patientID}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#1a2e26]/70 mt-1">
              <span>{strings.patientDetails}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{strings.safeZoneStatusNotice}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleGenerateAIReport}
            disabled={isGeneratingAIReport}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-[#2d6a4f] hover:bg-[#1f4e39] text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isGeneratingAIReport ? 'animate-spin' : ''}`}
            />
            <span>{isGeneratingAIReport ? strings.analyzingBtn : strings.aiAnalysisBtn}</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center justify-center gap-2 bg-[#eef7f2] hover:bg-[#d8ece1] text-[#0f382c] text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer border border-[#2d6a4f]/20 transition-colors"
            title="Export / Print Clinical Assessment"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{strings.exportReportBtn}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Overview, Cognitive Sessions, Medication Adherence, Sundowning Monitor) */}
      <div className="flex items-center gap-2 p-1.5 bg-[#eef7f2] rounded-2xl border border-[#2d6a4f]/20 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-[#0f382c] shadow-xs'
              : 'text-[#1a2e26]/70 hover:text-[#0f382c]'
          }`}
        >
          {strings.tabOverview}
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sessions'
              ? 'bg-white text-[#0f382c] shadow-xs'
              : 'text-[#1a2e26]/70 hover:text-[#0f382c]'
          }`}
        >
          {strings.tabSessions} ({combinedHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('meds')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'meds'
              ? 'bg-white text-[#0f382c] shadow-xs'
              : 'text-[#1a2e26]/70 hover:text-[#0f382c]'
          }`}
        >
          {strings.tabMeds}
        </button>
        <button
          onClick={() => setActiveTab('sundowning')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sundowning'
              ? 'bg-white text-[#0f382c] shadow-xs'
              : 'text-[#1a2e26]/70 hover:text-[#0f382c]'
          }`}
        >
          {strings.tabSundowning}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & AI CLINICAL SUMMARY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tile 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#0f382c]/10 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.csiTitle}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#2d6a4f] tabular-nums">
                  {summary.overallStabilityScore}
                </span>
                <span className="text-sm text-[#1a2e26]/60">/ 100</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-medium">
                {strings.csiTrend}
              </p>
            </div>

            {/* Tile 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#0f382c]/10 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.visuospatialMetric}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#0f382c] tabular-nums">
                  {summary.domainScores.visuoSpatial}%
                </span>
              </div>
              <p className="text-xs text-[#1a2e26]/70 mt-1 font-medium">
                {strings.visuospatialMetricSub}
              </p>
            </div>

            {/* Tile 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#0f382c]/10 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.auditoryMetric}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-[#0f382c] tabular-nums">
                  {summary.domainScores.auditoryAttention}%
                </span>
              </div>
              <p className="text-xs text-[#1a2e26]/70 mt-1 font-medium">
                {strings.auditoryMetricSub}
              </p>
            </div>

            {/* Tile 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#0f382c]/10 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.sundowningMetric}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-emerald-700">
                  {activeSundowningRisk}
                </span>
              </div>
              <p className="text-xs text-[#1a2e26]/70 mt-1 font-medium">
                {strings.sundowningMetricSub}
              </p>
            </div>
          </div>

          {/* AI Clinical Geriatric Synthesis Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#2d6a4f]">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{strings.aiClinicalHeading}</span>
            </div>

            <p className="text-base text-[#1a2e26] leading-relaxed font-medium">
              {activeClinicalSummary}
            </p>

            <div className="pt-4 border-t border-[#0f382c]/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f382c] mb-3">
                {strings.caregiverDirectivesHeading}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#eef7f2] border border-[#2d6a4f]/20 text-xs sm:text-sm text-[#0f382c] font-medium flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MoCA Domain Breakdown Visual Bars */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0f382c]">
              {strings.mocaBreakdownHeading || strings.mocaDomainsHeading}
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-[#1a2e26] mb-1">
                  <span>{strings.visuospatialDomain} ({strings.gameMatchTitle})</span>
                  <span className="tabular-nums">{summary.domainScores.visuoSpatial}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2d6a4f] h-full rounded-full transition-all duration-500"
                    style={{ width: `${summary.domainScores.visuoSpatial}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-[#1a2e26] mb-1">
                  <span>{strings.auditoryDomain} ({strings.gameSoundTitle})</span>
                  <span className="tabular-nums">{summary.domainScores.auditoryAttention}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${summary.domainScores.auditoryAttention}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-[#1a2e26] mb-1">
                  <span>{strings.executiveDomain} ({strings.gameRoutineTitle})</span>
                  <span className="tabular-nums">{summary.domainScores.executiveSequencing}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${summary.domainScores.executiveSequencing}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold text-[#1a2e26] mb-1">
                  <span>{strings.semanticDomain} ({strings.gameFolkTitle})</span>
                  <span className="tabular-nums">{summary.domainScores.shortTermRecall}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${summary.domainScores.shortTermRecall}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COGNITIVE SESSIONS LOG */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0f382c]">
                {strings.sessionsLogHeading}
              </h3>
              <p className="text-xs sm:text-sm text-[#1a2e26]/70 mt-0.5">
                {strings.sessionsLogSub}
              </p>
            </div>
            <span className="text-xs font-bold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg">
              {combinedHistory.length} {language === 'hi' ? 'सत्र' : language === 'mr' ? 'सत्रे' : 'Sessions'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#0f382c]/10 text-xs font-bold uppercase text-[#1a2e26]/60">
                  <th className="py-3 px-4">{strings.colTimestamp}</th>
                  <th className="py-3 px-4">{strings.colGameActivity}</th>
                  <th className="py-3 px-4">{strings.colDomain}</th>
                  <th className="py-3 px-4 text-center">{strings.colAccuracy}</th>
                  <th className="py-3 px-4 text-right">{strings.colDuration}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {combinedHistory.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-[#1a2e26]/70 tabular-nums">
                      {s.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0f382c]">
                      {s.gameId === 'heritage-match'
                        ? strings.gameMatchTitle
                        : s.gameId === 'sound-recall'
                        ? strings.gameSoundTitle
                        : s.gameId === 'daily-routine'
                        ? strings.gameRoutineTitle
                        : strings.gameFolkTitle}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-[#eef7f2] text-[#2d6a4f] font-semibold">
                        {s.gameId === 'heritage-match'
                          ? strings.visuospatialDomain
                          : s.gameId === 'sound-recall'
                          ? strings.auditoryDomain
                          : s.gameId === 'daily-routine'
                          ? strings.executiveDomain
                          : strings.semanticDomain}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md tabular-nums">
                        {s.accuracyPercent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#1a2e26]/70 tabular-nums">
                      {s.durationSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MEDICATION SCHEDULE */}
      {activeTab === 'meds' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0f382c]">
                {strings.medsScheduleHeading}
              </h3>
              <p className="text-xs sm:text-sm text-[#1a2e26]/70 mt-0.5">
                {strings.medsScheduleSub}
              </p>
            </div>
            <span className="text-xs font-bold text-[#2d6a4f] bg-[#eef7f2] px-3 py-1 rounded-lg">
              {medications.filter((m) => m.takenToday).length}/{medications.length} {strings.statusAdministered}
            </span>
          </div>

          <div className="space-y-3">
            {medications.map((m) => {
              const mLoc = (m as any).translations?.[language] || {
                name: m.name,
                dose: m.dose,
                instructions: m.instructions,
                timeSlotLabel: m.timeSlot,
              };

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs">
                      {m.elderIcon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2d6a4f] bg-white px-2 py-0.5 rounded-md border border-[#2d6a4f]/20">
                          {mLoc.timeSlotLabel} · {m.timeLabel}
                        </span>
                        {m.takenToday ? (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            ✓ {strings.statusAdministered}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            ⏳ {strings.statusPending}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#0f382c] mt-1">{mLoc.name}</h4>
                      <p className="text-xs text-[#1a2e26]/70 mt-0.5">{mLoc.dose} · {mLoc.instructions}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SUNDOWNING & CAREGIVER NOTES */}
      {activeTab === 'sundowning' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0f382c]/10 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-[#0f382c]">
              {strings.sundowningSentinelHeading}
            </h3>
            <p className="text-xs sm:text-sm text-[#1a2e26]/70">
              {strings.sundowningSentinelSub}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-900 leading-relaxed font-medium">
              {strings.sundowningProtocolBox}
            </div>

            {/* Note Logging Form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-[#1a2e26]">
                {strings.logObservationLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={strings.logPlaceholder}
                  className="flex-1 p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
                />
                <button
                  type="submit"
                  className="bg-[#2d6a4f] hover:bg-[#1f4e39] text-white px-5 py-3 rounded-xl font-bold text-sm cursor-pointer shadow-xs whitespace-nowrap"
                >
                  {strings.addLogBtn}
                </button>
              </div>
            </form>

            {/* Log History */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e26]/60">
                {strings.observationHistoryTitle}
              </h4>
              <div className="space-y-2">
                {caregiverNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#1a2e26] font-medium"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
