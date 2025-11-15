import { env } from "./env.js";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: env.cloudinary.cloud_name,
  api_key: env.cloudinary.api_key,
  api_secret: env.cloudinary.api_secret,
  secure: true,
});
export default cloudinary