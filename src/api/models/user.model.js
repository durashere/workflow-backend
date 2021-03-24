import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must enter name'],
    },
    email: {
      type: String,
      unique: [true, 'User with that email already exist'],
      required: [true, 'You must enter email'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    location: {
      type: String,
      enum: {
        values: ['kra', 'war'],
        message: 'Location must be set',
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, 'You must enter password'],
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // convert to UTC seconds
    return JWTTimestamp < changedTimestamp;
  }

  // Password not changed
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;
