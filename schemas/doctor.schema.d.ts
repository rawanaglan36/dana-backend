import { HydratedDocument, Types } from 'mongoose';
export type DoctorDocument = HydratedDocument<Doctor>;
export declare class Doctor {
    doctorName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    ratingAverage?: number;
    ratingQuantity?: number;
    specialty: string;
    detectionPrice: number;
    expirtes: number;
    patintQuantity?: number;
    avilableDate: string[];
    avilableTime: string[];
    role?: string;
    verficationCode?: number;
    isVerified: boolean;
    isActive: boolean;
    provider?: string;
    providerId?: string;
    details?: string;
    profileImage?: string;
    profileImagePublicId?: string;
    bookings?: Types.ObjectId[];
}
export declare const DoctorSchema: import("mongoose").Schema<Doctor, import("mongoose").Model<Doctor, any, any, any, import("mongoose").Document<unknown, any, Doctor, any, {}> & Doctor & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Doctor, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Doctor>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Doctor> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
