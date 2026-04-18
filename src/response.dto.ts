// Generic Response DTO
export class responseDto<T> {
  status: number;
  message: string;
  data?: T;
  pagination?: any;

  constructor(status: number, message: string, data?: T, pagintion?: any) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.pagination = pagintion;
  }
}
