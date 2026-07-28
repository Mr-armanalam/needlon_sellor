import { container } from "tsyringe";
import {DraftProductService} from "@/modules/products/services/draft-product.service";
import {DrizzleProductRepository} from "@/modules/products/repositories/repository";


container.registerSingleton(
    DrizzleProductRepository,
    DrizzleProductRepository,
);

container.registerSingleton(
    DraftProductService,
    DraftProductService,
);