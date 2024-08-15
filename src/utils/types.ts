export type GenerateText = {
    text: string;
}
export type FileMetaData =
  {
    name?: string;
    displayName?: string;
    mimeType?: string;
    sizeBytes?: string;
    createTime?: string;
    updateTime?: string;
    expirationTime?: string;
    sha256Hash?: string;
    uri?: string;
    state?: string;
}[]