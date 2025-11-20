import cors from "cors";
import express from "express";
import cart from "./routes/cartRoutes.js";
import category from "./routes/categoryRoutes.js";
import order from "./routes/orderRoutes.js";
import product from "./routes/productRoutes.js";
import user from "./routes/usuarioRoutes.js";
/*
import path from 'path';
import { fileURLToPath } from 'url';
*/

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/v1", user);
app.use("/v1", product);
app.use("/v1", cart);
app.use("/v1", category);
app.use("/v1", order);

// 🔧 Para obtener __dirname en ESModules
/*const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const astroPath = path.join(__dirname, '../../documentacion-api/dist');
app.use(express.static(astroPath));

app.use((req, res) => {
  res.sendFile(path.join(astroPath, 'index.html'));
});*/

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
