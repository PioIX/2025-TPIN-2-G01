import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import type {QrCodeProps} from 'types';

/**
 * @param {string} value   lo que dice el QR
 * @param size tamaño
 * @param color color de la mitad de loa cuadrados
 * @param backgroundColor color de la otra mitad
 * @param backgroundColor color de la otra mitad
 * @param logo lo que dice el QR
 * @param logoSize lo que dice el QR
 * @param logoBackgroundColor lo que dice el QR
 * @returns qrCode
 */
const MyQRCodeGenerator = ({value,size,color,backgroundColor,logo,logoSize,logoBackgroundColor}:QrCodeProps) => {
  return (
    <View>
      <QRCode
        value={value} // The data to be encoded in the QR code
        size={size} // Size of the QR code in pixels
        color={color} // Foreground color of the QR code
        backgroundColor={backgroundColor} // Background color of the QR code
        logo={logo || {uri: "./assets/placeholder"}} // Optional: URL for a logo
        logoSize={logoSize || 2} // Size of the logo
        logoBackgroundColor={logoBackgroundColor}// Background color of the logo area
      />
    </View>
  );
};

export default MyQRCodeGenerator;
