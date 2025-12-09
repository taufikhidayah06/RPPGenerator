export enum EducationLevel {
  SMA = 'SMA/SMK/MA',
}

export interface RPPRequest {
  schoolName: string; // Nama Sekolah
  teacherName: string; // Nama Guru/Penyusun
  level: string; // Fixed to SMA
  grade: string;
  subject: string;
  topic: string; // Materi/Tema Input
  cp: string; // Capaian Pembelajaran
  conditions: string; // Kondisi Kelas
  academicYear: string; // Tahun Ajaran
  semester: string; // Semester
  timeAllocation: string; // Alokasi Waktu (Input User)
}

export interface DeepLearningFlow {
  phase: 'Memahami' | 'Mengaplikasi' | 'Merefleksi';
  activity: string; // Detailed activity with case study
  duration: string;
}

export interface DesignElements {
  pedagogical_practice: string; // Praktik Pedagogis
  learning_partnership: string; // Kemitraan Pembelajaran
  learning_environment: string; // Lingkungan Pembelajaran
  digital_utilization: string; // Pemanfaatan Digital
}

export interface DeepAssessments {
  as_learning: string[]; // Self/Peer assessment
  for_learning: string[]; // Feedback / Formative process
  of_learning: string[]; // Summative / Achievement
}

export interface LKPDTask {
  title: string; // Judul Tugas
  instructions: string; // Instruksi
  questions: string[]; // Daftar pertanyaan/tugas
}

export interface LKPD {
  title: string;
  activities: {
    understand: LKPDTask; // Fase Memahami
    apply: LKPDTask;      // Fase Mengaplikasi
    reflect: LKPDTask;    // Fase Merefleksi
  };
}

export interface RPPResponse {
  topic_refined: string; // Topik yang dipertajam AI
  graduate_profile_dimensions: string[]; // 8 Dimensi specific
  design_elements: DesignElements;
  learning_flow: DeepLearningFlow[];
  assessments: DeepAssessments;
  lkpd: LKPD; 
}