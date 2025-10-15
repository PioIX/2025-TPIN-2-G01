import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import type {QrCodeProps} from 'types';

/**
 * 
 * @returns  
 */
const MyQRCodeGenerator = ({value,size,color,backgroundColor }:QrCodeProps) => {
  let logoFromFile = require('./path/to/your/logo.png'); // Optional: for adding a logo
    backgroundColor = 1
  return (
    <View>
        
        <QRCode
        value="https://example.com" // The data to be encoded in the QR code
        size={props.size} // Size of the QR code in pixels
        color="black" // Foreground color of the QR code
        backgroundColor="white" // Background color of the QR code
        logo={{uri: "./assets/icon.png"}} // Optional: URL for a logo
        logoSize={30} // Size of the logo
        logoBackgroundColor='transparent' // Background color of the logo area
        />
    </View>
  );
};

export default MyQRCodeGenerator;
