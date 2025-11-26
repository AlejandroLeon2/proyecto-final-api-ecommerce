import type { Request, Response } from "express";
import { CustomResponse } from "../utils/CustomResponse.js";
import {searchService } from "../services/searchService.js";
import type { ProductInterface } from "../interface/ProductInterface.js";
import e from "cors";

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
        };
    };

    public getPaginatedProducts = async (req: Request, res: Response) => {
        try {
            const textSearch = req.query.data as string;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const categories = (req.query.categories as string || "")
                .split(",")
                .filter(c => c.trim() !== "");

            const result = await this.service.getPaginatedProducts(textSearch, page, limit, categories);

            if (result.products.length === 0) {
                return res
                .status(404)
                .json(CustomResponse.error("404", "No se encontraron productos paginados"));
            }else{
                return res
                .status(200)
                .json(CustomResponse.success(
                    result,
                    "Productos paginados encontrados correctamente"
                ));
            }

        } catch (error) {
            console.error("Error al obtener productos paginados:", error);
            return res.status(500).json(
                CustomResponse.error("P004", "Error al obtener productos paginados")
            );
        }
    };

}