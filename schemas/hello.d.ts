import { Schema } from "mongoose";
declare const _default: import("mongoose").Model<{
    detectionPrice: number;
    bookings: import("mongoose").Types.ObjectId[];
    doctorName: string;
    address: string;
    city: string;
    ratingAverage: number;
    ratingQuantity: number;
    specialty: string;
    avilableDate: NativeDate[];
    avilableTime: NativeDate[];
    email?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    expirtes?: number | null | undefined;
    patintQuantity?: number | null | undefined;
    details?: string | null | undefined;
    profileImage?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    detectionPrice: number;
    bookings: import("mongoose").Types.ObjectId[];
    doctorName: string;
    address: string;
    city: string;
    ratingAverage: number;
    ratingQuantity: number;
    specialty: string;
    avilableDate: NativeDate[];
    avilableTime: NativeDate[];
    email?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    expirtes?: number | null | undefined;
    patintQuantity?: number | null | undefined;
    details?: string | null | undefined;
    profileImage?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    detectionPrice: number;
    bookings: import("mongoose").Types.ObjectId[];
    doctorName: string;
    address: string;
    city: string;
    ratingAverage: number;
    ratingQuantity: number;
    specialty: string;
    avilableDate: NativeDate[];
    avilableTime: NativeDate[];
    email?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    expirtes?: number | null | undefined;
    patintQuantity?: number | null | undefined;
    details?: string | null | undefined;
    profileImage?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    detectionPrice: number;
    bookings: import("mongoose").Types.ObjectId[];
    doctorName: string;
    address: string;
    city: string;
    ratingAverage: number;
    ratingQuantity: number;
    specialty: string;
    avilableDate: NativeDate[];
    avilableTime: NativeDate[];
    email?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    expirtes?: number | null | undefined;
    patintQuantity?: number | null | undefined;
    details?: string | null | undefined;
    profileImage?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    detectionPrice: number;
    bookings: import("mongoose").Types.ObjectId[];
    doctorName: string;
    address: string;
    city: string;
    ratingAverage: number;
    ratingQuantity: number;
    specialty: string;
    avilableDate: NativeDate[];
    avilableTime: NativeDate[];
    email?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    expirtes?: number | null | undefined;
    patintQuantity?: number | null | undefined;
    details?: string | null | undefined;
    profileImage?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    detectionPrice: number;
    bookings: import("mongoose").Types.ObjectId[];
    doctorName: string;
    address: string;
    city: string;
    ratingAverage: number;
    ratingQuantity: number;
    specialty: string;
    avilableDate: NativeDate[];
    avilableTime: NativeDate[];
    email?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    expirtes?: number | null | undefined;
    patintQuantity?: number | null | undefined;
    details?: string | null | undefined;
    profileImage?: string | null | undefined;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
