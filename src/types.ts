export interface InvestmentOption {
  id: string;
  title: string;
  desc: string;
  type: string;
  riskLevel: string;
  rescue: string;
  timeframe: string;
  iconKey: string;
  tag?: string;
}

export interface InvestmentData {
  accessibleMode: boolean;
  goal: string;
  timeframe: string;
  risk: string;
  selectedOption: InvestmentOption | null;
  value: string;
}

export type ScreenName =
  | 'HOME'
  | 'EXTRATO'
  | 'PERFIL'
  | 'WELCOME'
  | 'ACCESSIBLE_MODE'
  | 'SECURITY_CHECK'
  | 'GOAL_SELECTION'
  | 'PROFILE_QUESTIONS'
  | 'RECOMMENDATIONS'
  | 'INVESTMENT_DETAILS'
  | 'INSERT_VALUE'
  | 'REVIEW'
  | 'AUTHENTICATION'
  | 'SUCCESS';
