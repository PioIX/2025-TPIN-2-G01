import { useState } from "react";

export default function useBase64() {
  const [base64, setBase64] = useState<string>("");

  const encodeFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const result = reader.result as string; 
        setBase64(result);
        resolve(result);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  return { base64, encodeFileToBase64 };
}
