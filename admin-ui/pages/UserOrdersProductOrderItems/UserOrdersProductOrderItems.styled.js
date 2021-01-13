import styled from 'styled-components';
import { transparentize } from 'polished';

export const Section = styled.section(() => ({
  ':not(:first-of-type)': {
    marginTop: '0.5rem',
  },
}));

export const Row = styled.div(({ bold }) => ({
  display: 'flex',
  flexDirection: 'row',
  fontSize: '0.9rem',
  fontWeight: bold ? 700 : 'normal',
  justifyContent: 'space-between',
  padding: '0.125rem 0',
  width: '100%',
}));

export const OrderItemHeader = styled(Row)(() => ({
  fontWeight: 700,
}));

export const Name = styled.span(() => ({
  fontSize: '1rem',
}));

export const OrderItemProduct = styled.span({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  ':after': {
    color: transparentize(0.5, 'black'),
    content:
      '".............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................."',
  },
});

export const Price = styled.span({
  flexShrink: 0,
});

export const ContainerInfo = styled.span({
  color: transparentize(0.5, 'black'),
});
