import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body

// Simple CORS middleware to allow the dev frontend (Vite) to fetch the API
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
		return res.sendStatus(200);
	}
	next();
});

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
	const clientDistPath = path.join(__dirname, "client", "dist");
	const indexPath = path.resolve(__dirname, "client", "dist", "index.html");
	console.log("NODE_ENV=", process.env.NODE_ENV);
	console.log("Serving static from:", clientDistPath, "index exists:", fs.existsSync(indexPath));

	app.use(express.static(clientDistPath));
	// Use a RegExp matcher to avoid path-to-regexp parsing errors for '*' patterns
	app.get(/.*/, (req, res) => {
		res.sendFile(indexPath);
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
});