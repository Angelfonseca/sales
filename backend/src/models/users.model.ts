import { Schema, model, Document } from 'mongoose';
import { User as IUser } from '../interfaces/users.interface';
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sells: [{ type: Schema.Types.ObjectId, ref: 'Sell' }],
  role: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (next: (err?: any) => void) {
  const user: IUser & Document = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err: any, salt: string) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err: any, hash: string) => {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: Error | null, isMatch: boolean) => void) {
  bcrypt.compare(candidatePassword, this.password, (err: Error | null, isMatch: boolean) => {
    cb(err, isMatch); 
  });
};


const User = model("User", UserSchema)

export default User