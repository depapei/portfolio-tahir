import { useQuery } from '@tanstack/react-query';
import { queryKeys, fetchProfile, fetchPortfolio, fetchSkills, fetchExperiences, fetchEducations, fetchCertificates, fetchHobbies } from '@/lib/services/api';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: fetchPortfolio,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: fetchSkills,
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: queryKeys.experiences,
    queryFn: fetchExperiences,
  });
}

export function useEducations() {
  return useQuery({
    queryKey: queryKeys.educations,
    queryFn: fetchEducations,
  });
}

export function useCertificates() {
  return useQuery({
    queryKey: queryKeys.certificates,
    queryFn: fetchCertificates,
  });
}

export function useHobbies() {
  return useQuery({
    queryKey: queryKeys.hobbies,
    queryFn: fetchHobbies,
  });
}
