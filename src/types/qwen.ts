// Misal di file: types/qwen.ts

export interface QwenNumber {
  value: string;
  type: string;
  label: string;
  context: string;
  page_index: number;
  page_hint: string;
  document_hint: string;
  confidence: number;
}

export interface QwenTranscriptCourse {
  course_name: string;
  course_code: string;
  semester: string;
  sks: string;
  grade_letter: string;
  grade_numeric: string;
  context: string;
}

export interface QwenTranscriptGpa {
  ip_per_semester: any[]; // bisa kamu ketatkan nanti
  ipk_final: string;
}

export interface QwenTranscriptDetails {
  exists: boolean;
  courses: QwenTranscriptCourse[];
  gpa: QwenTranscriptGpa;
}

export interface QwenDocResult {
  summary: string;
  numbers: QwenNumber[];
  transcript_details: QwenTranscriptDetails;
}
