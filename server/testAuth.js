import mongoose from "mongoose";
import User from "./models/User.js";

const runTest = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/kolhapurDB");

    console.log("✅ DB Connected");

    const user = await User.findOne({
      email: "admin@bus.com",
    });

    if (!user) {
      console.log("❌ Admin user not found");
      process.exit(0);
    }

    console.log("✅ Admin user found");

    console.log("Password check →");

    const result = await user.comparePassword("admin123");

    console.log(result);

    process.exit(0);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

runTest();
