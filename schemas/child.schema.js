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
exports.ChildSchema = exports.Child = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Child = class Child {
    childName;
    age;
    gender;
    role;
    birthDate;
    isActive;
    parentId;
    bookings;
};
exports.Child = Child;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        min: [3, 'name must be at least 3 character'],
        max: [30, 'name must be at  most 30 character']
    }),
    __metadata("design:type", String)
], Child.prototype, "childName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], Child.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['male', 'female']
    }),
    __metadata("design:type", String)
], Child.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'child',
    }),
    __metadata("design:type", String)
], Child.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        required: true
    }),
    __metadata("design:type", Date)
], Child.prototype, "birthDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], Child.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Parent',
        required: true
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Child.prototype, "parentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: 'booking' }],
    }),
    __metadata("design:type", Array)
], Child.prototype, "bookings", void 0);
exports.Child = Child = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Child);
exports.ChildSchema = mongoose_1.SchemaFactory.createForClass(Child);
//# sourceMappingURL=child.schema.js.map