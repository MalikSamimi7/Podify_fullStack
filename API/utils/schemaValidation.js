const { isValidObjectId } = require("mongoose");
const yup = require("yup");
const categories = require("./audio_category");

const userSchemaValidation = yup.object().shape({
  name: yup
    .string()
    .required("name is required")
    .trim()
    .min(3, "name is too short")
    .max(20, "name is too long"),
  email: yup.string().required("email is required").email("invalid email"),
  password: yup
    .string()
    .trim()
    .required("password is required")
    .min(8, "password too short")
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
      "password is too simple"
    ),
});

const emailVerificationSchema = yup.object().shape({
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("invalid user Id"),
  token: yup.string().trim().required("invalid token"),
});

const emailReVerificationSchema = yup.object().shape({
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("invalid user Id"),
});

const verifyUserByMailVShema = yup.object().shape({
  email: yup.string().email("invlaid mail").required("invalid mail"),
});

const resetPasswordVSchema = yup.object().shape({
  token: yup.string().min(6, "invalid token").required("token required!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("invalid user Id"),
  password: yup
    .string()
    .trim()
    .required("password is required")
    .min(8, "password too short")
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
      "password is too simple"
    ),
});

const signInValidatinSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("email required"),
  password: yup
    .string()
    .trim()
    .required("password is required")
    .min(8, "password too short")
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
      "password is too simple"
    ),
});

const audioValidationSchema = yup.object().shape({
  title: yup.string().required("audion title missing"),
  about: yup.string().required("about is missing"),
  category: yup
    .string()
    .oneOf(categories, "invalid category")
    .required("category is missing"),
});

const audioUpdateValidationSchema = yup.object().shape({
  title: yup.string(),
  about: yup.string(),
  category: yup.string().oneOf(categories, "invalid category"),
});

const playlistValidationSchema = yup.object().shape({
  title: yup.string().required("title is missing"),
  resId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "visibility must be public or private")
    .required("visibility missing!"),
});

const updatePlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("title is missing"),
  //validating audio id
  item: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  //validating playlist id
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "visibility must be public or private"),
});

const updateHistoryValidtionSchema = yup.object().shape({
  audio: yup
    .string()
    .transform(function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : "";
    })
    .required("audio id is missing!"),
  progress: yup.string().required("history progress is required!"),
  date: yup
    .string()
    .transform(function (value) {
      const date = new Date(value);
      if (date instanceof Date) return value;
      return "";
    })
    .required("valid date required!"),
});

module.exports = {
  userSchemaValidation,
  emailVerificationSchema,
  emailReVerificationSchema,
  verifyUserByMailVShema,
  resetPasswordVSchema,
  signInValidatinSchema,
  audioValidationSchema,
  audioUpdateValidationSchema,
  playlistValidationSchema,
  updatePlaylistValidationSchema,
  updateHistoryValidtionSchema,
};
