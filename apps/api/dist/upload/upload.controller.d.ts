import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        pageEntry: {
            id: string;
            createdAt: Date;
            pageNumber: string;
            imageUrl: string;
            bookId: string;
        };
        vocabulary: any[];
    }>;
}
