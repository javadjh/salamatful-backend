import { isProduction } from "./util";

const env = (name, defaultVal) => {
  return process.env[name] || defaultVal;
};

const envBool = (name, defaultVal) => {
  let value = env(name, defaultVal);
  return value === "true" || value === true;
};

const envFloat = (name, defaultVal) => {
  return parseFloat(env(name, defaultVal));
};

const config = {
  serverURL: "https://salamatful.ir/admin",
  defaultImages: "/images/defaults",
  profiles: "/images/profiles",
  blogImages: "/images/blogs",
  storyFiles: "/images/stories",
  courseImages: "/images/courses",
  galleryImages: "/images/galleries",
  dailyPhoto: "/images/daily",
  backgrounds: "/images/backgrounds",
  imageCompression: {
    enable: envBool("IMAGE_COMPRESSION_ENABLE", true),
    quality: envFloat("IMAGE_COMPRESSION_QUALITY", 50),
    maxWidth: envFloat("IMAGE_COMPRESSION_MAX_WIDTH", 1900),
    maxHeight: envFloat("IMAGE_COMPRESSION_MAX_HEIGHT", 1900),
    useWebpForJPEG: envBool("IMAGE_COMPRESSION_USE_WEBP_FOR_JPEG", false),
    useWebpForPNG: envBool("IMAGE_COMPRESSION_USE_WEBP_FOR_PNG", true),
  },
};

export default config;
