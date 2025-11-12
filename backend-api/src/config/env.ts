import dotenv from "dotenv";
dotenv.config();

export const env = {
  firebase: {
    projectId: process.env.PROJECT_ID!,
    clientEmail: process.env.CLIENT_EMAIL!,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n")!,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  },
};
