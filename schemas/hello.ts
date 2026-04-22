import { Schema, model } from "mongoose";

const DoctorSchema = new Schema(
  {
    doctorName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },

    ratingAverage: { type: Number, default: 0.0 },
    ratingQuantity: { type: Number, default: 0 },

    specialty: { type: String, required: true },
    detectionPrice: { type: Number, default: 0 },

    expirtes: { type: Number }, // years of experience
    patintQuantity: { type: Number },

    phone: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    profileImage: { type: String },

    details: { type: String },

    bookings: [{ type: Schema.Types.ObjectId, ref: "booking" }],

    availability: [
      {
        date: { type: String, required: true },
        times: [{ type: String, required: true }]
      }
    ],
  },
  { timestamps: true }
);

export default model("Doctor", DoctorSchema);
