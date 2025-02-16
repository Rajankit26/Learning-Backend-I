import dotenv from "dotenv";

dotenv.config()

const config = {
    PORT : process.env.PORT || 5000,
    MONGODB_URL : process.env.MONGODB_URL || 'mongodb://localhost:27017/e-comm',
    JWT_SECRET : process.env.JWT_SECRET || "secretkey",
    JWT_EXPIRY : process.env.JWT_EXPIRY || "15d"
}
export default config