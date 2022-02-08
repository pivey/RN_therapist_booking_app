import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface BtnProps {
  bgc?: string;
  btnText: string;
  customStyling?: any;
  pressHandler: () => void;
  textColour?: string;
}

const Button = ({ pressHandler, bgc, btnText, customStyling, textColour }: BtnProps) => {
  return (
    <TouchableOpacity
      onPress={pressHandler}
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: bgc || '#5096E8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
        ...customStyling,
      }}>
      <Text style={{ color: textColour || 'white', fontSize: 18 }}>{btnText}</Text>
    </TouchableOpacity>
  );
};

export default Button;
