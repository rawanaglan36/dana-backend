import { HydratedDocument, Types } from 'mongoose';
export type ParentDocument = HydratedDocument<Parent>;
export declare class Parent {
    parentName: string;
    age?: number;
    email: string;
    phone: string;
    role?: string;
    verficationCode?: number;
    isVerified: boolean;
    isActive: boolean;
    government?: string;
    address?: string;
    password: string;
    provider?: string;
    providerId?: string;
    children: Types.ObjectId[];
    bookings?: Types.ObjectId[];
    profileImage: string;
    profileImagePublicId: string;
}
export declare const ParentSchema: import("mongoose").Schema<Parent, import("mongoose").Model<Parent, any, any, any, import("mongoose").Document<unknown, any, Parent, any, {}> & Parent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Parent, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Parent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Parent> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
