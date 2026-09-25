import { catalogProducts } from "./catalog.data.js";

export function listProducts(req, res) {
  const { sector } = req.query;
  const products = sector ? catalogProducts.filter((product) => product.sector === sector) : catalogProducts;
  res.json(products);
}

export function getProduct(req, res) {
  const product = catalogProducts.find((item) => item.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  return res.json(product);
}
