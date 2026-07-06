import {SellerDocumentDto} from "@/modules/seller-profile/dto/seller-document.dto";
import {SellerVerificationRecordDto} from "@/modules/seller-profile/dto/seller-verification-record.dto";

export interface SellerVerificationDto {
    verification: SellerVerificationRecordDto;

    completionPercentage: number;

    canSubmit: boolean;

    requiredDocumentsUploaded: number;

    requiredDocumentsTotal: number;

    documents: SellerDocumentDto[];
}