export interface AssessmentJustifikasi {
  valid: string;
  autentik: string;
  terkini: string;
  memadai: string;
  nilai: string;
}

export interface AssessmentResult {
  valid: boolean;
  autentik: boolean;
  terkini: boolean;
  memadai: boolean;
  penilaian_assesmen: string;
  nilai: number;
  justifikasi: AssessmentJustifikasi;
}

export interface SkorAssessmentJustifikasi {
  portofolio: string;
  tulis: string;
  wawancara: string;
  demo: string;
  skor_rata_rata: string;
  diakui: string;
  nilai_huruf: string;
}

export interface SkorAssessmentResult {
  portofolio: number;
  tulis: number;
  wawancara: number;
  demo: number;
  skor_rata_rata: number;
  diakui: boolean;
  nilai_huruf: "A" | "B" | "C" | "D" | "E";
  justifikasi: SkorAssessmentJustifikasi;
}
