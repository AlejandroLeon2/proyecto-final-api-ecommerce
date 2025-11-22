import type { Request, Response } from "express";
import { CustomResponse } from "../utils/CustomResponse.js";
import {searchService } from "../services/searchService.js";
import type { ProductInterface } from "../interface/ProductInterface.js";

type PartialProduct = Partial<ProductInterface>;

 
export class searchController {

    private service: searchService;

    constructor (
    ){
        this.service = new searchService()
    }

    public searchProducts = async (req: Request, res: Response) => {
        // obtener el texto de búsqueda desde los parámetros de consulta
        const textSearch = req.query.data as string;
        console.log(textSearch);
        
        // pedimos al firebase los datos que coincidan con la búsqueda
        try {
        const resul: {products: PartialProduct[], moreItems: boolean} = await this.service.searchProductsByName(textSearch);
            console.log(resul);
            
        if (resul.products.length === 0) {
            return res
            .status(404)
            .json(CustomResponse.error("404", "No se encontraron productos xxx"));
        }
        return res.status(200).json(
            CustomResponse.success(
            resul,
            "Productos encontrados correctamente"
            )
        );

        } catch (error) {
        console.error("Error al buscar productos:", error);
        return res
            .status(500)
            .json(
            CustomResponse.error(
                "P003", 
                "Error al buscar productos"));
        }
    }
}