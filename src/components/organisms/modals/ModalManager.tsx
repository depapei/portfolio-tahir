'use client';

import { useModalStore } from '@/store/modal-store';
import { PortfolioModal } from './PortfolioModal';
import { SkillModal } from './SkillModal';
import { ExperienceModal } from './ExperienceModal';
import { EducationModal } from './EducationModal';
import { CertificateModal } from './CertificateModal';
import { HobbyModal } from './HobbyModal';

export function ModalManager() {
  const { type } = useModalStore();

  switch (type) {
    case 'portfolio':
      return <PortfolioModal />;
    case 'skill':
      return <SkillModal />;
    case 'experience':
      return <ExperienceModal />;
    case 'education':
      return <EducationModal />;
    case 'certificate':
      return <CertificateModal />;
    case 'hobby':
      return <HobbyModal />;
    default:
      return null;
  }
}
