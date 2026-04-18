import { HydratedDocument, Types } from 'mongoose';
export type BookingDocument = HydratedDocument<Book>;
export declare class Book {
    parentId: Types.ObjectId;
    childId: Types.ObjectId;
    doctorId: Types.ObjectId;
    date: string;
    time: string;
    visitStatus: string;
    detectionPrice: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentProvider: string;
    paymobOrderId?: string;
    paymobTransactionId?: string;
    paymentMethod: string;
    notes: string;
}
export declare const BookSchema: import("mongoose").Schema<Book, import("mongoose").Model<Book, any, any, any, import("mongoose").Document<unknown, any, Book, any, {}> & Book & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Book, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Book>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Book> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
