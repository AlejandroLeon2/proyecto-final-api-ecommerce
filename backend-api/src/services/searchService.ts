import type { ProductInterface } from "../interface/ProductInterface.js";
import { db } from "../config/firebase.js";
type PartialProduct = Partial<ProductInterface>;

export class searchService {

    private collectionName: string = "products";

    constructor() {
    }

    public async searchProductsByName(productName: string): Promise<
        {products: PartialProduct[], moreItems: boolean}> {

        const itemsToFetch = 10;

        // Traemos todos los productos ya que no encontre forma de extraer con where y partial match en Firestore
        const snapshot = await db.collection(this.collectionName).get();

        // Filtramos en memoria por coincidencia parcial
        const matched: PartialProduct[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name.toLowerCase().includes(productName.toLowerCase())) {
                matched.push({
                    id: doc.id,
                    name: data.name,
                    image: data.image
                });
            }
        });

        // Limitamos el resultado para el frontend
        const products = matched.slice(0, itemsToFetch);

        return { products, moreItems: matched.length > itemsToFetch };
    }
}
