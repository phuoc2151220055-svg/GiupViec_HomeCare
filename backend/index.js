const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routers/userRoutes");
const branchRoutes = require("./routers/branchRoutes");
const serviceRoutes = require("./routers/serviceRoutes");
const customerRoute = require("./routers/customerRoute");
const workAssignmentRoutes = require("./routers/workAssignmentRoutes");
const employeeRoutes = require("./routers/employeeRoute");
const orderRoutes = require("./routers/orderRoutes");
dbConnect()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/customers", customerRoute);
app.use("/api/work-assignments", workAssignmentRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.listen(PORT, () => {
  console.log(
    `Server is running at PORT ${PORT}`
  );
});
