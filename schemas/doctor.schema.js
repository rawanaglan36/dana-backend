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
exports.DoctorSchema = exports.Doctor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Doctor = class Doctor {
    doctorName;
    email;
    password;
    phone;
    address;
    city;
    ratingAverage;
    ratingQuantity;
    specialty;
    detectionPrice;
    expirtes;
    patintQuantity;
    avilableDate;
    avilableTime;
    role;
    verficationCode;
    isVerified;
    isActive;
    provider;
    providerId;
    details;
    profileImage;
    profileImagePublicId;
    bookings;
};
exports.Doctor = Doctor;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 character'],
        max: [30, 'name must be at  most 30 character']
    }),
    __metadata("design:type", String)
], Doctor.prototype, "doctorName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], Doctor.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'password must be at least 3 characters'],
        max: [20, "password must be at most 30 characters"],
        select: false
    }),
    __metadata("design:type", String)
], Doctor.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], Doctor.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'address must be at least 3 character'],
        max: [30, 'address must be at  most 30 character']
    }),
    __metadata("design:type", String)
], Doctor.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'city must be at least 3 character'],
        max: [30, 'city must be at  most 30 character']
    }),
    __metadata("design:type", String)
], Doctor.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0.0
    }),
    __metadata("design:type", Number)
], Doctor.prototype, "ratingAverage", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0
    }),
    __metadata("design:type", Number)
], Doctor.prototype, "ratingQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], Doctor.prototype, "specialty", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], Doctor.prototype, "detectionPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        min: [1, 'must be at least 1 year experience']
    }),
    __metadata("design:type", Number)
], Doctor.prototype, "expirtes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Doctor.prototype, "patintQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        required: true
    }),
    __metadata("design:type", Array)
], Doctor.prototype, "avilableDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        required: true
    }),
    __metadata("design:type", Array)
], Doctor.prototype, "avilableTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'doctor',
    }),
    __metadata("design:type", String)
], Doctor.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], Doctor.prototype, "verficationCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Doctor.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], Doctor.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Doctor.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Doctor.prototype, "providerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Doctor.prototype, "details", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        nullable: true
    }),
    __metadata("design:type", String)
], Doctor.prototype, "profileImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        nullable: true
    }),
    __metadata("design:type", String)
], Doctor.prototype, "profileImagePublicId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: 'booking' }],
    }),
    __metadata("design:type", Array)
], Doctor.prototype, "bookings", void 0);
exports.Doctor = Doctor = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Doctor);
exports.DoctorSchema = mongoose_1.SchemaFactory.createForClass(Doctor);
//# sourceMappingURL=doctor.schema.js.map