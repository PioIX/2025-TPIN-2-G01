import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import type { QrCodeProps } from 'types';

const MyQRCodeGenerator = ({
  value,
  size,
  color,
  backgroundColor,
  logo,
  logoSize,
  logoBackgroundColor
}: QrCodeProps) => {
  return (
    <View>
      <QRCode
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        logo={logo}
        logoSize={logoSize}
        logoBackgroundColor={logoBackgroundColor}
      />
    </View>
  );
};

export default MyQRCodeGenerator;
