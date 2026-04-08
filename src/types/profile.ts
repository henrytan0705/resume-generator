export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Certification {
  id: string;
  name: string;
  authority: string;
  startDate?: string;
  endDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
}

export interface LinkedInProfile {
  id: string;
  name: string;
  headline: string;
  summary?: string;
  profilePictureBase64?: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
}
