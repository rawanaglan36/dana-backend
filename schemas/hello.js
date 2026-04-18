"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DoctorSchema = new mongoose_1.Schema({
    doctorName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    ratingAverage: { type: Number, default: 0.0 },
    ratingQuantity: { type: Number, default: 0 },
    specialty: { type: String, required: true },
    detectionPrice: { type: Number, default: 0 },
    expirtes: { type: Number },
    patintQuantity: { type: Number },
    phone: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    profileImage: { type: String },
    details: { type: String },
    bookings: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "booking" }],
    avilableDate: [{ type: Date }],
    avilableTime: [{ type: Date }],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Doctor", DoctorSchema);
//# sourceMappingURL=hello.js.map