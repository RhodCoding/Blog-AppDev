export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    isPublic: boolean;
}
