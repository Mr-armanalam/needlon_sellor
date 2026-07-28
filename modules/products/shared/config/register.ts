import { productConfig } from "./product.config";

let registered = false;

export function registerProductModule() {
    if (registered) {
        return;
    }

    registered = true;

    return productConfig;
}