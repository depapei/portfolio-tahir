import { create } from 'zustand';
import {
  PortfolioItem,
  Skill,
  Experience,
  Education,
  Certificate,
  Hobby,
  ModalState,
} from '@/types';

interface ModalStore extends ModalState {
  openModal: (
    type: ModalState['type'],
    data: PortfolioItem | Skill | Experience | Education | Certificate | Hobby
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  openModal: (type, data) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: null }),
}));
