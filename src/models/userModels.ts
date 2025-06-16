import { Schema, model } from "mongoose"
import { IUser } from "../types/authTypes"


const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  username: {type: String, required: true, unique: true },
  bio: { type: String},
  
}, {
timestamps: true
}
);

export default model<IUser>("User", UserSchema)