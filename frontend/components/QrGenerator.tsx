import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import type {QrCodeProps} from 'types';

/**
 * 
 * @returns  
 */
const MyQRCodeGenerator = ({value,size,color,backgroundColor,logo,logoSize,logoBackgroundColor}:QrCodeProps) => {
  let logoFromFile = require('./path/to/your/logo.png'); // Optional: for adding a logo
  return (
    <View>
      <QRCode
        value={value} // The data to be encoded in the QR code
        size={size} // Size of the QR code in pixels
        color={color} // Foreground color of the QR code
        backgroundColor={backgroundColor} // Background color of the QR code
        logo={logo || {uri: "./assets/icon.png"}} // Optional: URL for a logo
        logoSize={logoSize} // Size of the logo
        logoBackgroundColor={logoBackgroundColor}// Background color of the logo area
      />
    </View>
  );
};

export default MyQRCodeGenerator;
