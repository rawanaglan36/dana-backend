"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentSchema = exports.Parent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Parent = class Parent {
    parentName;
    age;
    email;
    phone;
    role;
    verficationCode;
    isVerified;
    isActive;
    government;
    address;
    password;
    provider;
    providerId;
    children;
    bookings;
    profileImage;
    profileImagePublicId;
};
exports.Parent = Parent;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 character'],
        max: [30, 'name must be at  most 30 character']
    }),
    __metadata("design:type", String)
], Parent.prototype, "parentName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], Parent.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Parent.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], Parent.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'parent',
    }),
    __metadata("design:type", String)
], Parent.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], Parent.prototype, "verficationCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Parent.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], Parent.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Parent.prototype, "government", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Parent.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'password must be at least 3 characters'],
        max: [20, "password must be at most 30 characters"],
        select: false
    }),
    __metadata("design:type", String)
], Parent.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Parent.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Parent.prototype, "providerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: 'Child' }],
        required: true
    }),
    __metadata("design:type", Array)
], Parent.prototype, "children", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: 'booking' }],
    }),
    __metadata("design:type", Array)
], Parent.prototype, "bookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, default: null }),
    __metadata("design:type", String)
], Parent.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, default: null }),
    __metadata("design:type", String)
], Parent.prototype, "profileImagePublicId", void 0);
exports.Parent = Parent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Parent);
exports.ParentSchema = mongoose_1.SchemaFactory.createForClass(Parent);
//# sourceMappingURL=parent.schema.js.map