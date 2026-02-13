import { create } from "zustand";

export type createElectionStage = "META" | "CONFIG" | "REVIEW";

export interface candidateDraft {
    id:string;
  name:string;
  description: string;
  image?: File | null;
}

export interface electionDraft {
  name: string;
  description: string;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface votingAccessDraft {
  votingAccess: "public" | "private";
  votingType: "1" | "2" | "3";
}

interface createElectionStore {
  stage: createElectionStage;

  meta: electionDraft;
  candidates: candidateDraft[];
  voting: votingAccessDraft;

  setMeta: (data: Partial<electionDraft>) => void;

  // Pick defines a subset of a larger type .
  addCandidate: (candidate: Pick<candidateDraft, "id" | "name" | "description">) => void;
  updateCandidate: (id: number, data: Partial<candidateDraft>) => void;
  deleteCandidate: (id: number) => void;

  setVoting: (data: Partial<votingAccessDraft>) => void;

  nextStage: () => void;
  previousStage: () => void;
  reset: () => void;
}

export const useCreateElectionStore = create<createElectionStore>((set, get) => ({
  stage: "META",

  meta: {
    name: "",
    description: "",
    fromDate: null,
    toDate: null,
  },

  candidates: [],

  voting: {
    votingAccess: "public",
    votingType: "1",
  },

  // setting the current meta data..
  setMeta: (metaData) =>
    set((state) => ({
      meta: { ...state.meta, ...metaData },
    })),

    
  // Add a new candidate.  
  addCandidate: (candidateData) =>
    set((state) => ({
      candidates: [...state.candidates, candidateData],
    })),

  updateCandidate: (id, data) =>
    set((state) => ({
      candidates: state.candidates.map((c, index) =>
        index === id ? { ...c, ...data } : c
      ),
    })),

  deleteCandidate: (id) =>
    set((state) => ({
      candidates: state.candidates.filter((_, index) => index !== id),
    })),

  setVoting: (data) =>
    set((state) => ({
      voting: { ...state.voting, ...data },
    })),

  nextStage: () =>
    set((state) => ({
      stage:
        state.stage === "META"
          ? "CONFIG"
          : state.stage === "CONFIG"
          ? "REVIEW"
          : "REVIEW",
    })),

  previousStage: () =>
    set((state) => ({
      stage:
        state.stage === "REVIEW"
          ? "CONFIG"
          : state.stage === "CONFIG"
          ? "META"
          : "META",
    })),

  reset: () =>
    set({
      stage: "META",
      meta: {
        name: "",
        description: "",
        fromDate: null,
        toDate: null,
      },
      candidates: [],
      voting: {
        votingAccess: "public",
        votingType: "1",
      },
    }),
}));


// hardcoded Values Store

