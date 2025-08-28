// User schema
export const UserSchema = {
  userId: String,
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: Date,
  kdfSalt: ArrayBuffer,
  verifier: ArrayBuffer,
  kdfParams: Object,
  settings: Object
};

// Vault, Documents, Passwords etc. ka schema yahin define hoga
