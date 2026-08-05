const mongoose = require("mongoose");

// MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME - এই আলাদা variable গুলো দিয়ে
// connection string বানিয়ে MongoDB এর সাথে connect করা হচ্ছে
const connectDB = async () => {
  try {
    const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME, MONGODB_CLUSTER } = process.env;

    if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_DBNAME) {
      throw new Error(
        "MONGODB_USERNAME, MONGODB_PASSWORD এবং MONGODB_DBNAME .env ফাইলে দেওয়া আছে কি না চেক করুন"
      );
    }

    const username = encodeURIComponent(MONGODB_USERNAME);
    const password = encodeURIComponent(MONGODB_PASSWORD);

    let uri;

    if (MONGODB_CLUSTER) {
      // MongoDB Atlas ব্যবহার করলে (cluster address দেওয়া থাকলে)
      uri = `mongodb+srv://${username}:${password}@${MONGODB_CLUSTER}/${MONGODB_DBNAME}?retryWrites=true&w=majority`;
    } else {
      // Local MongoDB ব্যবহার করলে
      uri = `mongodb://${username}:${password}@localhost:27017/${MONGODB_DBNAME}?authSource=admin`;
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
