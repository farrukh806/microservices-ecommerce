import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true, 
  }),
);

app.listen(PORT, () => console.log(`Product service running at ${PORT}`));
