import type { ProductInterface } from "../interface/ProductInterface.js";
import { db } from "../config/firebase.js";
import { da } from "zod/locales";
type PartialProduct = Partial<ProductInterface>;

// Tipo de resultado para paginación
type PaginatedProductsResult = {
    products: PartialProduct[],
    pagination: {
        page: number,
        limit: number,
        totalItems: number,
        totalPages: number
    }
};

export class searchService {

    private collectionName: string = "products";

    constructor() {
    }

    public async searchProductsByName(productName: string): Promise<
        {products: PartialProduct[], moreItems: boolean}> {

        const itemsToFetch = 2;

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

        return { 
            products, 
            moreItems: matched.length > itemsToFetch 
        };
    };

    // --- NUEVO MÉTODO PARA PAGINACIÓN CON FILTRO DE CATEGORÍAS ---

    public async getPaginatedProducts(textSearch:string, page:number, limit:number, categories:string[]): Promise<
    PaginatedProductsResult> {

        const itemsToFetch = limit;
         // implementamos paginacion en la query
        
        const snapshot = await db.collection(this.collectionName).get();
        // Filtramos en memoria por coincidencia parcial y categorías
        const matched: PartialProduct[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const matchesName = data.name.toLowerCase().includes(textSearch.toLowerCase());
            const matchesCategory = categories.length === 0 || categories.includes(data.category);

            if (matchesName && matchesCategory) {
                matched.push({
                    id: doc.id,
                    name: data.name,
                    image: data.image,
                    category: data.category,
                    price: data.price,
                    stock: data.stock
                });
            }
        });

        // Implementamos paginación en memoria
        const totalItems = matched.length;
        const totalPages = Math.ceil(totalItems / itemsToFetch);
        const startIndex = (page - 1) * itemsToFetch;
        const paginatedProducts = matched.slice(startIndex, startIndex + itemsToFetch);

        return {
            products: paginatedProducts,
            pagination: {
                page,
                limit: itemsToFetch,
                totalItems,
                totalPages
            }
        };
    }
}
