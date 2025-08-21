import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UIState, Theme, ViewType, LoadingState, ModalState, ToastNotification } from '@/types';

interface UIStore extends UIState {
  // Actions
  setTheme: (theme: Theme) => void;
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  setViewType: (viewType: ViewType) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  setModal: (modal: ModalState) => void;
  openModal: (content: ModalState['content'], data?: unknown) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<ToastNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'system',
        currentTheme: 'light',
        viewType: 'grid',
        loading: 'idle',
        error: null,
        modal: {
          isOpen: false,
          content: null,
          data: null,
        },
        notifications: [],
        sidebarOpen: false,
        mobileMenuOpen: false,

        // Actions
        setTheme: (theme: Theme) => {
          set({ theme });
        },

        setCurrentTheme: (currentTheme: 'light' | 'dark') => {
          set({ currentTheme });
        },

        setViewType: (viewType: ViewType) => {
          set({ viewType });
        },

        setLoading: (loading: LoadingState) => {
          set({ loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setModal: (modal: ModalState) => {
          set({ modal });
        },

        openModal: (content: ModalState['content'], data?: unknown) => {
          set({
            modal: {
              isOpen: true,
              content,
              data,
            },
          });
        },

        closeModal: () => {
          set({
            modal: {
              isOpen: false,
              content: null,
              data: null,
            },
          });
        },

        addNotification: (notification: Omit<ToastNotification, 'id'>) => {
          const id = Date.now().toString();
          const newNotification: ToastNotification = {
            ...notification,
            id,
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remove notification after duration
          const duration = notification.duration || 5000;
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        },

        removeNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter(
              (notification) => notification.id !== id
            ),
          }));
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        setSidebarOpen: (sidebarOpen: boolean) => {
          set({ sidebarOpen });
        },

        setMobileMenuOpen: (mobileMenuOpen: boolean) => {
          set({ mobileMenuOpen });
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        toggleMobileMenu: () => {
          set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
        },
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          viewType: state.viewType,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);