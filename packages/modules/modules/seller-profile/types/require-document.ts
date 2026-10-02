import { DocumentType} from "@/modules/seller-profile/types/document-type";

export const REQUIRED_DOCUMENTS = [
    DocumentType.GST,
    DocumentType.PAN,
] as const;