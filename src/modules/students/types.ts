export interface CreateStudentInput {
  fullName: string;
  phone: string;
  code: string;
  faculty: string;
  semester: number;
}

export interface UpdateStudentInput {
  fullName?: string;
  phone?: string;
  faculty?: string;
  semester?: number;
  active?: boolean;
}

export interface StudentFilters {
  faculty?: string;
  semester?: number;
  active?: boolean;
}

export interface CreateStudentInput {
  fullName: string;
  phone: string;
  code: string;
  faculty: string;
  semester: number;
}
 
export interface UpdateStudentInput {
  fullName?: string;
  phone?: string;
  faculty?: string;
  semester?: number;
  active?: boolean;
}
 
export interface StudentFilters {
  faculty?: string;
  semester?: number;
  active?: boolean;
  search?: string;
}