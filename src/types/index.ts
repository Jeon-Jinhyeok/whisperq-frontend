// Session Types
export interface Session {
  id: string;
  code: string;
  facilitatorId: string;
  title?: string;
  createdAt: number;
  endedAt?: number;
  status: 'active' | 'ended';
}

// Reaction Types
export type ReactionType = 'confused' | 'more';

export interface Reaction {
  type: ReactionType;
  timestamp: number;
  sessionId: string;
}

export interface ReactionCount {
  confused: number;
  more: number;
}

// Question Types
export interface Question {
  id: string;
  text: string;
  timestamp: number;
  sessionId: string;
}

// STT Types
export interface TranscriptSegment {
  text: string;
  startTime: number;
  endTime: number;
}

// Analysis Types
export interface AnalysisResult {
  totalReactions: number;
  reactionsByType: ReactionCount;
  timeDistribution: TimeSlot[];
  segments: AnalysisSegment[];
  faqs: FAQ[];
}

export interface TimeSlot {
  startMinute: number;
  endMinute: number;
  confused: number;
  more: number;
}

export interface AnalysisSegment {
  timeRange: string;
  reactionType: ReactionType;
  count: number;
  transcript: string;
}

export interface FAQ {
  question: string;
  similarCount: number;
}

// WebSocket Event Types
export interface ReactionUpdateEvent {
  type: ReactionType;
  count: number;
  intensity: number; // 0-100
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
