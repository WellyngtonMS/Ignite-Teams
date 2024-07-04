import { useState } from 'react';
import { TextInput, TextInputProps } from "react-native";
import { Container } from "./styles";
import { useTheme } from 'styled-components/native';

type Props = TextInputProps & {
  inputRef?: React.RefObject<TextInput>;
}

export function Input({inputRef, ...rest}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const { COLORS } = useTheme();
  return (
    <Container
      ref={inputRef}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isFocused={isFocused}
      placeholderTextColor={COLORS.GRAY_300}
      {...rest}
    />
  )
}