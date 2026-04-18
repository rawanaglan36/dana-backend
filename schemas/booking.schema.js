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
exports.BookSchema = exports.Book = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Book = class Book {
    parentId;
    childId;
    doctorId;
    date;
    time;
    visitStatus;
    detectionPrice;
    currency;
    status;
    paymentStatus;
    paymentProvider;
    paymobOrderId;
    paymobTransactionId;
    paymentMethod;
    notes;
};
exports.Book = Book;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Parent',
        required: true
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Book.prototype, "parentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Child',
        required: true
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Book.prototype, "childId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Doctor',
        required: true
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Book.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true
    }),
    __metadata("design:type", String)
], Book.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true
    }),
    __metadata("design:type", String)
], Book.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['examination', 'follow-up']
    }),
    __metadata("design:type", String)
], Book.prototype, "visitStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true
    }),
    __metadata("design:type", Number)
], Book.prototype, "detectionPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'EGP' }),
    __metadata("design:type", String)
], Book.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }),
    __metadata("design:type", String)
], Book.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }),
    __metadata("design:type", String)
], Book.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: 'paymob' }),
    __metadata("design:type", String)
], Book.prototype, "paymentProvider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Book.prototype, "paymobOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Book.prototype, "paymobTransactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: ['on-visit', 'visa'],
        default: 'on-visit'
    }),
    __metadata("design:type", String)
], Book.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, }),
    __metadata("design:type", String)
], Book.prototype, "notes", void 0);
exports.Book = Book = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Book);
exports.BookSchema = mongoose_1.SchemaFactory.createForClass(Book);
exports.BookSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });
//# sourceMappingURL=booking.schema.js.map