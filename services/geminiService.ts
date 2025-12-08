
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

interface GenerateImageParams {
  base64Image: string;
  mimeType: string;
  prompt: string;
  aspectRatio: AspectRatio;
  numberOfImages: number;
}

export const generateImage = async ({
  base64Image,
  mimeType,
  prompt,
  aspectRatio,
  numberOfImages,
}: GenerateImageParams): Promise<string[]> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const generationPromises: Promise<string>[] = [];

    for (let i = 0; i < numberOfImages; i++) {
      const promise = ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      }).then(response => {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
          }
        }
        throw new Error(`Không tìm thấy dữ liệu hình ảnh trong phản hồi #${i + 1}.`);
      });
      generationPromises.push(promise);
    }
    
    const imageUrls = await Promise.all(generationPromises);
    return imageUrls;

  } catch (error) {
    console.error('Lỗi khi tạo ảnh bằng Gemini:', error);
    if (error instanceof Error) {
        throw new Error(`Lỗi API: ${error.message}`);
    }
    throw new Error('Đã xảy ra lỗi không xác định trong quá trình tạo ảnh.');
  }
};
