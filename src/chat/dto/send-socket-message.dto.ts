export class SendSocketMessageDto {
    parentId: string;
    doctorId: string;
    roomId: string;
    senderId: string;
    receiverId: string;
    senderModel: 'Parent' | 'Doctor';
    message: string;
    type?: 'TEXT' | 'IMAGE' | 'DOCUMENT';
    clientMessageId?: string;
  }
