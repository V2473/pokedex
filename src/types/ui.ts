// Theme types
export type Theme = 'light' | 'dark' | 'system';

// View types
export type ViewType = 'grid' | 'list';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Modal types
export interface ModalState {
  isOpen: boolean;
  content: null | 'pokemon' | 'settings' | 'filters';
  data?: unknown;
}

// Toast notification types
export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// UI store state
export interface UIState {
  theme: Theme;
  currentTheme: 'light' | 'dark'; // Resolved theme (system preference resolved)
  viewType: ViewType;
  loading: LoadingState;
  error: string | null;
  modal: ModalState;
  notifications: ToastNotification[];
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
}

// Pokemon card display options
export interface PokemonCardOptions {
  showId: boolean;
  showTypes: boolean;
  showStats: boolean;
  showFavoriteButton: boolean;
  imageSize: 'small' | 'medium' | 'large';
}

// Grid layout options
export interface GridLayoutOptions {
  columns: number;
  gap: number;
  responsive: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Filter panel options
export interface FilterPanelOptions {
  showTypeFilters: boolean;
  showGenerationFilters: boolean;
  showAdvancedFilters: boolean;
  expanded: boolean;
}

// Sort options UI
export interface SortOptionsUI {
  showSortDropdown: boolean;
  sortFields: {
    label: string;
    value: string;
  }[];
}

// Pagination UI
export interface PaginationUI {
  showPagination: boolean;
  itemsPerPage: number;
  maxVisiblePages: number;
}

// Search bar options
export interface SearchBarOptions {
  placeholder: string;
  showSearchButton: boolean;
  showClearButton: boolean;
  debounceMs: number;
}

// Pokemon modal tabs
export type PokemonModalTab = 'about' | 'stats' | 'evolution' | 'moves' | 'abilities';

// Pokemon modal state
export interface PokemonModalState {
  isOpen: boolean;
  pokemonId: number | null;
  activeTab: PokemonModalTab;
  loading: LoadingState;
  error: string | null;
}

// Settings modal state
export interface SettingsModalState {
  isOpen: boolean;
  activeTab: 'general' | 'appearance' | 'data';
}

// Keyboard navigation
export interface KeyboardNavigation {
  enabled: boolean;
  focusTrap: boolean;
  shortcuts: {
    [key: string]: () => void;
  };
}

// Accessibility options
export interface AccessibilityOptions {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// Animation options
export interface AnimationOptions {
  enabled: boolean;
  duration: number;
  easing: string;
  stagger: number;
}

// Responsive breakpoints
export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

// Device info
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

// Image optimization options
export interface ImageOptimizationOptions {
  lazyLoad: boolean;
  placeholder: 'blur' | 'empty';
  quality: number;
  formats: ('webp' | 'avif' | 'png' | 'jpg')[];
}

// Performance options
export interface PerformanceOptions {
  enableCache: boolean;
  cacheTTL: number;
  enablePrefetching: boolean;
  enableCodeSplitting: boolean;
}

// UI configuration
export interface UIConfig {
  theme: Theme;
  viewType: ViewType;
  pokemonCardOptions: PokemonCardOptions;
  gridLayoutOptions: GridLayoutOptions;
  filterPanelOptions: FilterPanelOptions;
  sortOptionsUI: SortOptionsUI;
  paginationUI: PaginationUI;
  searchBarOptions: SearchBarOptions;
  keyboardNavigation: KeyboardNavigation;
  accessibilityOptions: AccessibilityOptions;
  animationOptions: AnimationOptions;
  breakpoints: Breakpoints;
  imageOptimizationOptions: ImageOptimizationOptions;
  performanceOptions: PerformanceOptions;
}