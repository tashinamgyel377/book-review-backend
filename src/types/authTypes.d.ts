import { Date, Document, Types } from "mongoose"

declare global {
  namespace Express {
    interface Request {
      user?: IUser & Document
      userId?: string;
    }
  }
}

export type CustomJwtPayload = {
  userId: string
  username: string
  email: string
}

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
//   avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IBook extends Document {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string[]; // e.g. ["Fiction", "Mystery"]
  publishedYear: Date;
  createdBy: Types.ObjectId// FK -> User.id

}