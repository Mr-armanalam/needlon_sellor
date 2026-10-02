import { DocumentType } from "../types/document-type";
interface DocumentConfig {
    documentType: DocumentType;

    label: string;

    required: boolean;

    requireNumber: boolean;
}


export const DOCUMENT_CONFIG: DocumentConfig[] = [
    {
        documentType: DocumentType.GST,
        label: "GST Certificate",
        required: true,
        requireNumber: true,
    },
    {
        documentType: DocumentType.PAN,
        label: "PAN Card",
        required: true,
        requireNumber: true,
    },
    {
        documentType: DocumentType.MSME,
        label: "MSME Certificate",
        required: false,
        requireNumber: false,
    },
    {
        documentType: DocumentType.FSSAI,
        label: "FSSAI License",
        required: false,
        requireNumber: false,
    },
];