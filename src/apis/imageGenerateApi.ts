import { axiosInstance } from "./axiosInstance";

export interface GenerateImageParams {
  image: File;
  prompt: string;
}

export interface GenerateImageResponse {
  image: string;
}

export const generateImageApi = async ({
  image,
  prompt,
}: GenerateImageParams): Promise<GenerateImageResponse> => {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("prompt", prompt);

  const response =
    await axiosInstance.post<GenerateImageResponse>(
      "/api/generate-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        // 이미지 생성은 오래 걸릴 수 있음
        timeout: 120000,
      }
    );

  return response.data;
};