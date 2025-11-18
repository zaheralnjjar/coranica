export interface Lesson {
  id: string;
  title: string;
  rule: string;
  studentTip: string;
  originalTable: string;
  quranicExamples?: {
    note?: string;
    table: string;
  };
  additionalExamples?: {
    title: string;
    content: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}