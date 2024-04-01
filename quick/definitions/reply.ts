
export interface IReply {
    userId: string;
    replies: { id: string, name: string, body: string }[];
}
