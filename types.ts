
export interface ContactInfo {
  phone: string;
  email: string;
  linkedin: string;
  location: string;
}

export interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  year?: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  link?: string;
  image?: string;
}

export interface CertificationItem {
  id?: string;
  title: string;
  issuer: string;
  year?: string;
  link?: string; // URL to the certificate image or verification page
}

export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary?: string;
  profileImage?: string;
  contact: ContactInfo;
  skills: string[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  certifications: CertificationItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
