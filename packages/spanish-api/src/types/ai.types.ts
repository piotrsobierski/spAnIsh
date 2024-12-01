export interface BatchExamplesRequest {
  words: string[];
  targetLang?: string;
  sentencesPerWord?: number;
}

export interface BatchExamplesResponse {
  examples: {
    word: string;
    sentences: {
      original: string;
      english: string;
    }[];
  }[];
}

export interface WordRequest {
  word: string;
  targetLang?: string;
}

export interface RelatedWordsResponse {
  word: string;
  category: string;
  related_words: {
    [key: string]: string;
    english: string;
    explanation?: string;
  }[];
}

export interface MemoryAssociationsResponse {
  memory_tips: {
    type: string;
    tip: string;
  }[];
}
