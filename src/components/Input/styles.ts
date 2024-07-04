import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';

type Props = {
  isFocused: boolean;
}

export const Container = styled(TextInput)<Props>`
  flex: 1;
  min-height: 56px;
  max-height: 56px;

  ${({ theme, isFocused }) => css`
    background-color: ${theme.COLORS.GRAY_700};
    color: ${theme.COLORS.WHITE};
    font-family: ${theme.FONT_FAMILY.REGULAR};
    font-size: ${theme.FONT_SIZE.MD}px;
    border-width: ${isFocused ? 2 : 0}px;
    border-color: ${isFocused ? theme.COLORS.GREEN_500 : theme.COLORS.GRAY_300};
  `}
  border-radius: 6px;
  padding: 0 16px;
  padding-right: 56px;
`;