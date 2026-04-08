import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { UserCircle2, CheckCircle2, Briefcase, GraduationCap, RotateCcw, FolderGit2, Award, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { LinkedInProfile, Experience, Education, Project, Certification } from '@/types/profile';
import { CuratableSection } from './CuratableSection';
import { SectionManager, SectionItem } from './SectionManager';

const ResumeDownloadButton = dynamic(
  () => import('@/components/pdf/ResumeDownloadButton'),
  { 
    ssr: false,
    loading: () => (
      <button 
        disabled
        className="inline-flex h-12 w-full mt-4 items-center justify-center rounded-md bg-zinc-300 px-8 text-sm font-medium text-zinc-500 sm:w-auto"
      >
        Loading PDF Engine...
      </button>
    )
  }
);

interface DataPreviewProps {
  profile: LinkedInProfile;
  onReset: () => void;
}

const DEFAULT_LAYOUT: SectionItem[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'skills', label: 'Skills' }
];

export function DataPreview({ profile, onReset }: DataPreviewProps) {
  // Compute exactly which sections have data to hide empty ones from the reorderer
  const getInitialLayout = () => {
    return DEFAULT_LAYOUT.filter(section => {
      // Correctly map singular IDs to plural profile properties
      const profileKey = section.id === 'experience' ? 'experiences' : 
                         section.id === 'education' ? 'educations' : 
                         section.id as keyof LinkedInProfile;
      const data = profile[profileKey];
      return Array.isArray(data) && data.length > 0;
    });
  };

  // Layout Management State
  const [layoutOrder, setLayoutOrder] = useState<SectionItem[]>(getInitialLayout);

  // Local state for soft individual deletes
  const [optedOutExps, setOptedOutExps] = useState<Set<string>>(new Set());
  const [optedOutEdus, setOptedOutEdus] = useState<Set<string>>(new Set());
  const [optedOutSkills, setOptedOutSkills] = useState<Set<string>>(new Set());
  const [optedOutProjects, setOptedOutProjects] = useState<Set<string>>(new Set());
  const [optedOutCerts, setOptedOutCerts] = useState<Set<string>>(new Set());

  // Global Section Opt Outs
  const [optOutSkillsSection, setOptOutSkillsSection] = useState(false);
  const [optOutProjectsSection, setOptOutProjectsSection] = useState(false);
  const [optOutCertsSection, setOptOutCertsSection] = useState(false);

  const toggleSet = (id: string, setStore: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    const newSet = new Set(setStore);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setter(newSet);
  };

  const finalProfile: LinkedInProfile = {
    ...profile,
    experiences: profile.experiences.filter(exp => !(exp.id && optedOutExps.has(exp.id))),
    educations: profile.educations.filter(edu => !(edu.id && optedOutEdus.has(edu.id))),
    skills: optOutSkillsSection ? [] : profile.skills.filter(s => !(s.id && optedOutSkills.has(s.id))),
    projects: optOutProjectsSection ? [] : profile.projects.filter(p => !(p.id && optedOutProjects.has(p.id))),
    certifications: optOutCertsSection ? [] : profile.certifications.filter(c => !(c.id && optedOutCerts.has(c.id))),
  };

  return (
    <div className="w-full mx-auto mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-3xl">
      
      <button 
        onClick={onReset}
        className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm transition-all mb-4 px-1"
      >
        <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
        Back to Search
      </button>

      <div className="bg-white rounded-t-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {profile.profilePictureBase64 ? (
            <img src={profile.profilePictureBase64} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm border border-slate-200" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <UserCircle2 className="w-12 h-12 text-slate-400" />
            </div>
          )}
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-slate-600">{profile.headline}</p>
          </div>
        </div>
      </div>

      {/* Render the Master Reorder UI mapped cleanly */}
      <SectionManager 
        sections={layoutOrder} 
        onOrderChange={setLayoutOrder} 
      />

      {/* Conditionally loop checking structural layout logic dynamically over active component trees! */}
      {layoutOrder.map((section, layoutIdx) => {
        const isFirst = layoutIdx === 0;
        const isLast = layoutIdx === layoutOrder.length - 1;

        switch (section.id) {
          case 'experience':
            return (
              <CuratableSection<Experience>
                key="exp"
                title="Experience"
                items={profile.experiences}
                icon={Briefcase}
                showRecordCount={true}
                optedOutIds={optedOutExps}
                onToggleItem={(id: string) => toggleSet(id, optedOutExps, setOptedOutExps)}
                getId={(item: Experience) => item.id}
                renderTitle={(item: Experience) => item.title}
                renderSubtitle={(item: Experience) => (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-600 text-xs font-medium">{item.company}</span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-slate-500 text-xs">{item.startDate} - {item.endDate}</span>
                  </div>
                )}
                isFirst={isFirst}
                isLast={isLast}
              />
            );
          
          case 'education':
            return (
              <CuratableSection<Education>
                key="edu"
                title="Education"
                items={profile.educations}
                icon={GraduationCap}
                showRecordCount={true}
                optedOutIds={optedOutEdus}
                onToggleItem={(id: string) => toggleSet(id, optedOutEdus, setOptedOutEdus)}
                getId={(item: Education) => item.id}
                renderTitle={(item: Education) => item.institution}
                renderSubtitle={(item: Education) => {
                  const hasValidDegree = item.degree && !item.degree.toLowerCase().includes('unknown');
                  const hasDates = item.startDate && item.startDate !== 'Unknown' && item.startDate !== '';
                  return (
                    <div className="flex items-center gap-2 mt-1">
                      {hasValidDegree && <span className="text-slate-600 text-xs font-medium">{item.degree}</span>}
                      {hasValidDegree && hasDates && <span className="text-slate-300 text-xs">•</span>}
                      {hasDates && <span className="text-slate-500 text-xs">{item.startDate} - {item.endDate}</span>}
                    </div>
                  );
                }}
                isFirst={isFirst}
                isLast={isLast}
              />
            );

          case 'projects':
            return (
              <CuratableSection<Project>
                key="proj"
                title="Projects"
                items={profile.projects}
                icon={FolderGit2}
                optOutSection={optOutProjectsSection}
                onToggleSection={() => setOptOutProjectsSection(!optOutProjectsSection)}
                emptyMessage="No project extracts resolved."
                optedOutIds={optedOutProjects}
                onToggleItem={(id: string) => toggleSet(id, optedOutProjects, setOptedOutProjects)}
                getId={(item: Project) => item.id}
                renderTitle={(item: Project) => item.title}
                renderSubtitle={(item: Project) => (
                  <p className="text-slate-500 text-xs mt-1 line-clamp-1">{item.description}</p>
                )}
                isFirst={isFirst}
                isLast={isLast}
              />
            );

          case 'certifications':
            return (
              <CuratableSection<Certification>
                key="cert"
                title="Certifications"
                items={profile.certifications}
                icon={Award}
                optOutSection={optOutCertsSection}
                onToggleSection={() => setOptOutCertsSection(!optOutCertsSection)}
                emptyMessage="No organizational certs matched."
                optedOutIds={optedOutCerts}
                onToggleItem={(id: string) => toggleSet(id, optedOutCerts, setOptedOutCerts)}
                getId={(item: Certification) => item.id}
                renderTitle={(item: Certification) => item.name}
                renderSubtitle={(item: Certification) => (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-600 text-xs font-medium">{item.authority}</span>
                  </div>
                )}
                isFirst={isFirst}
                isLast={isLast}
              />
            );

          case 'skills':
            return (
              <div key="skills" className={`bg-slate-50 p-6 sm:p-8 border-x border-b ${isFirst ? 'border-t rounded-t-2xl' : ''} border-slate-200 transition-all duration-500 ${optOutSkillsSection ? 'grayscale opacity-75' : ''} ${isLast ? 'rounded-b-2xl' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className={`w-5 h-5 ${optOutSkillsSection ? 'text-slate-400' : 'text-slate-500'}`} />
                    <h3 className={`text-lg font-bold ${optOutSkillsSection ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      Skills
                    </h3>
                  </div>
                  {profile.skills.length > 0 && (
                    <button onClick={() => setOptOutSkillsSection(!optOutSkillsSection)} className="flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-full text-xs font-semibold transition-colors">
                      {optOutSkillsSection ? <><ToggleLeft className="w-4 h-4 text-slate-500" /> Opted Out</> : <><ToggleRight className="w-4 h-4 text-emerald-600" /> Opt Out</>}
                    </button>
                  )}
                </div>

                <div className={`flex flex-wrap gap-2 ${optOutSkillsSection ? 'pointer-events-none opacity-50' : ''}`}>
                  {profile.skills.map((s) => {
                    const isOptedOut = s.id ? optedOutSkills.has(s.id) : false;
                    return (
                      <button 
                        key={s.id}
                        type="button"
                        onClick={() => s.id && toggleSet(s.id, optedOutSkills, setOptedOutSkills)}
                        title={isOptedOut ? "Restore skill" : "Remove skill"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isOptedOut ? 'bg-slate-200 text-slate-400 line-through opacity-70' : 'bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600 hover:line-through'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                  {profile.skills.length === 0 && (
                    <p className="text-sm italic text-slate-500">No top skills fetched securely.</p>
                  )}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <button 
          onClick={onReset}
          className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors px-4 py-2"
        >
          &larr; Back to Search
        </button>
        <ResumeDownloadButton profile={finalProfile} layoutOrder={layoutOrder} />
      </div>

    </div>
  );
}
