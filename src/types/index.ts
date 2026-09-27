export interface Candidate {
  number: string;
  name: string;
  party: string;
  partyAcronym: string;
  viceName?: string;
  photoUrl: string;
  vicePhotoUrl?: string;
  coalition?: string;
}

export type VoteType = 'VALID' | 'WHITE' | 'NULL';

export interface VoteRecord {
  id: string;
  candidateNumber?: string;
  candidateName: string;
  partyAcronym?: string;
  voteType: VoteType;
  timestamp: string;
}

export type ViewTab = 'SIMULATOR' | 'CANDIDATES' | 'RESULTS';

export type VotingStage = 'INPUT' | 'CONFIRM_PROMPT' | 'RECORDING' | 'ENDED';
