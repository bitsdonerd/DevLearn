exports.up = (pgm) => {
  pgm.createTable("users", {
    // UUID = Universally Unique Identifier - generates unique IDS for each user
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // For reference, GitHub limits usernames to 39 characters
    username: { type: "varchar(30)", notNull: true, unique: true },

    // For reference varchar 254 - https://stackoverflow.com/a/1199238
    email: { type: "varchar(254)", notNull: true, unique: true },

    // bcrypt hash has 60 characters, but we use 72 to be future-proof - https://www.npmjs.com/package/bcrypt#hash-info
    password: { type: "varchar(60)", notNull: true },

    // Timestamp with time zone - https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
