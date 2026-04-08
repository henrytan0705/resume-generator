import axios from 'axios';
import { LinkedInProfile, Experience, Education, Skill, Certification, Project } from '@/types/profile';

// Optional strict generic payload matching defining structural layouts
export interface ApifyRawProfile {
  [key: string]: any;
}

export async function parseApifyProfile(person: ApifyRawProfile): Promise<Omit<LinkedInProfile, 'id' | 'profilePictureBase64'> & { profilePictureBase64?: string }> {
  const name = person.name || person.fullName || `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'Extracted Name';
  const headline = person.headline || person.jobTitle || 'LinkedIn Profile';

  // --- Profile Picture Extraction ---
  let profilePictureBase64: string | undefined = undefined;
  const rawPic = person.profilePictureUrl || person.profilePicUrl || person.profilePicture || person.profile_pic_url || person.photoUrl;
  
  let profilePicUrl: string | undefined = undefined;
  if (typeof rawPic === 'string') profilePicUrl = rawPic;
  else if (rawPic && typeof rawPic === 'object' && typeof rawPic.url === 'string') profilePicUrl = rawPic.url;

  if (profilePicUrl && profilePicUrl.startsWith('https://')) {
    let retries = 2;
    while (retries >= 0) {
      try {
        const picRes = await axios.get(profilePicUrl, { responseType: 'arraybuffer', timeout: 5000 });
        const mimeType = picRes.headers['content-type'] || 'image/jpeg';
        profilePictureBase64 = `data:${mimeType};base64,${Buffer.from(picRes.data).toString('base64')}`;
        break;
      } catch (err: any) {
        retries--;
        if (retries < 0) {
          console.warn('Silent skip: Failed to fetch profile picture safely.', err.message);
        }
      }
    }
  }

  const rawExperiences = person.experiences || person.experience || person.positions || person.employment_history || [];
  
  const cleanExperiences: Experience[] = rawExperiences.filter((work: ApifyRawProfile) => {
    const lowerTitle = (work.title || work.name || work.position || '').toLowerCase();
    if (lowerTitle.includes('career break') || lowerTitle.includes('sabbatical') || lowerTitle.includes('gap')) {
      return false;
    }
    return true;
  }).map((work: ApifyRawProfile, index: number) => {
    const expDescription = work.description || work.summary || undefined;
    const expTitle = work.title || work.position || work.name || '';
    const expCompany = work.companyName || work.company || work.organization_name || '';
    const expLocation = work.locationName || work.location || work.geolocation || '';
    
    let expStartRaw = work.startDate?.text || work.startDate?.year || work.startDate || work.start_date || work.startYear || (work.dateRange && work.dateRange.split('-')[0]) || '';
    let expEndRaw = work.endDate?.text || work.endDate?.year || work.endDate || work.end_date || work.endYear || (work.dateRange && work.dateRange.split('-')[1]) || '';
    
    if (typeof expStartRaw === 'object') expStartRaw = '';
    if (typeof expEndRaw === 'object') expEndRaw = 'Present';
    
    if (!expEndRaw || String(expEndRaw).toLowerCase().includes('present')) {
      expEndRaw = 'Present';
    }

    return {
      id: `apify-exp-${index}`,
      title: expTitle,
      company: expCompany,
      location: expLocation,
      startDate: String(expStartRaw).trim().split('T')[0],
      endDate: String(expEndRaw) === 'Present' ? 'Present' : String(expEndRaw).trim().split('T')[0],
      description: expDescription
    };
  });

  const rawEducations = person.educations || person.education || person.educational_history || [];
  const educations: Education[] = rawEducations.map((edu: ApifyRawProfile, i: number) => {
    let eduStartRaw = edu.startDate?.text || edu.startDate?.year || edu.startDate || edu.startYear || (edu.dateRange && edu.dateRange.split('-')[0]) || '';
    let eduEndRaw = edu.endDate?.text || edu.endDate?.year || edu.endDate || edu.endYear || (edu.dateRange && edu.dateRange.split('-')[1]) || 'Present';
    
    if (typeof eduStartRaw === 'object') eduStartRaw = '';
    if (typeof eduEndRaw === 'object') eduEndRaw = 'Present';

    const rawDegree = edu.degreeName || edu.degree || '';
    const cleanDegree = rawDegree.toLowerCase().includes('unknown') ? '' : rawDegree;

    return {
      id: `apify-edu-${i}`,
      institution: edu.schoolName || edu.school || edu.institutionName || '',
      degree: cleanDegree,
      startDate: String(eduStartRaw),
      endDate: String(eduEndRaw)
    };
  });

  let skills: Skill[] = [];
  if (person.topSkills && typeof person.topSkills === 'string') {
    skills = person.topSkills.split('•').map((sName: string, i: number) => ({
      id: `apify-skill-${i}`,
      name: sName.trim()
    })).filter((s: Skill) => s.name.length > 0);
  } else {
    const rawSkills = person.skills || [];
    skills = rawSkills.map((s: ApifyRawProfile, i: number) => ({
      id: `apify-skill-${i}`,
      name: s.name || ''
    })).slice(0, 15);
  }

  const rawCerts = person.certifications || [];
  const certifications: Certification[] = rawCerts.map((c: ApifyRawProfile, i: number) => ({
    id: `apify-cert-${i}`,
    name: c.name || c.title || '',
    authority: c.authority || c.issuedBy || '',
    startDate: c.startDate?.year ? `${c.startDate.year}` : (c.issuedAt || ''),
    endDate: c.endDate?.year ? `${c.endDate.year}` : ''
  }));

  const rawProjects = person.projects || [];
  const projects: Project[] = rawProjects.map((p: ApifyRawProfile, i: number) => ({
    id: `apify-proj-${i}`,
    title: p.title || '',
    description: p.description || '',
    startDate: p.startDate?.year ? `${p.startDate.year}` : '',
    endDate: p.endDate?.year ? `${p.endDate.year}` : ''
  }));

  return { name, headline, profilePictureBase64, experiences: cleanExperiences, educations, skills, certifications, projects };
}
