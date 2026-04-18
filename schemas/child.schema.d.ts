import { HydratedDocument, Types } from 'mongoose';
export type ChildDocument = HydratedDocument<Child>;
export declare class Child {
    childName: string;
    age?: number;
    gender: string;
    role?: string;
    birthDate: Date;
    isActive: boolean;
    parentId: Types.ObjectId;
    bookings?: Types.ObjectId[];
}
export declare const ChildSchema: import("mongoose").Schema<Child, import("mongoose").Model<Child, any, any, any, import("mongoose").Document<unknown, any, Child, any, {}> & Child & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Child, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Child>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Child> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
