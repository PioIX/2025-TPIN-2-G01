import { useState } from 'react';

export function useImage64() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const convertToBase64 = async (uri: string): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setImage(base64);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { image, loading, convertToBase64 };
}
