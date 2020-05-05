import { prop, getModelForClass, arrayProp } from '@typegoose/typegoose';
import * as tgoose from "@typegoose/typegoose/lib/types";

export class User {
  @prop()
  public username: string;

  @prop()
  public discriminator: string;

  @prop()
  public password: string;

  public get fullUsername() {
    return `${this.username}#${this.discriminator}`;
  }

  @arrayProp({ ref: 'User' })
  public friends?: tgoose.Ref<User>[] = []; 


  constructor(username: string, discriminator: string, password: string) {
    this.username = username;
    this.discriminator = discriminator;
    this.password = password;
  }


  public getUsername(this: tgoose.DocumentType<User>) { // this is an Instance Method
    return this.username; // thanks to "DocumentType" "this" has type information
  }

  public static findByName(this: tgoose.ReturnModelType<typeof User>, username: string) { // this is an Instance Method
    return this.find({ username }).exec(); // thanks to "ReturnModelType" "this" has type information
  }
}

export const UserModel = getModelForClass(User); // UserModel is a regular Mongoose Model with correct types
