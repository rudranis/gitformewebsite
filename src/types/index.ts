export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface MentalHealthForm {
  sleepHours: number;
  anxietyLevel: number;
  stressFrequency: number;
  financialStress: number;
  socialSupport: number;
  workLifeBalance: number;
  physicalActivity: number;
  substanceUse: number;
  moodChanges: number;
  suicidalThoughts: number;
}

export interface RiskAssessment {
  prediction: 'Low Risk' | 'Medium Risk' | 'High Risk';
  confidence: number;
  recommendations: string[];
  timestamp: string;
}

export interface Submission {
  id: string;
  userId: string;
  formData: MentalHealthForm;
  prediction: RiskAssessment;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}