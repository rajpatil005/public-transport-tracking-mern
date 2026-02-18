const mongoose = require("mongoose");
const Route = require("./models/Route");
const Bus = require("./models/Bus");

const { kolhapurRoutes, kolhapurBuses } = require("./data/kolhapurData");

mongoose.connect("mongodb://localhost:27017/kolhapurBusDB")
  .then(async () => {
    console.log("MongoDB Connected");

    // जुना data delete कर
    await Route.deleteMany();
    await Bus.deleteMany();

    // नवीन data insert कर
    await Route.insertMany(kolhapurRoutes);
    await Bus.insertMany(kolhapurBuses);

    console.log("✅ Data Inserted Successfully");
    process.exit();
  })
  .catch(err => console.log(err));
