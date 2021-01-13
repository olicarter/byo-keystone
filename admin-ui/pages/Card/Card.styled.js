import styled from 'styled-components';
import { transparentize } from 'polished';

export const Card = styled.div(({ margin }) => ({
  alignSelf: 'flex-start',
  // backgroundColor: 'white',
  // borderColor: 'transparent',
  // borderTopColor: transparentize(0.5, 'black'),
  // borderRadius: '0.5rem',
  // borderStyle: 'solid',
  // borderWidth: '3px',
  display: 'flex',
  flexDirection: 'column',
  margin,
  overflow: 'hidden',
  transitionDuration: '100ms',
  width: '100%',
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      borderTopColor: transparentize(0.1, 'black'),
      // boxShadow: `0 0 0.5rem 0 ${transparentize(0.8, 'black')}`,
      // boxShadow: '0 0 1rem 0.1rem rgba(0, 0, 0, 0.1)',
    },
  },
}));
