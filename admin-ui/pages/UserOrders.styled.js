import styled from 'styled-components';
import { transparentize } from 'polished';

export const CardContent = styled.div({
  color: 'black',
  cursor: 'default',
  padding: '0.5rem',
});

export const Section = styled.section(() => ({
  ':not(:first-of-type)': {
    marginTop: '0.5rem',
  },
}));

export const Row = styled.div(({ bold }) => ({
  display: 'flex',
  flexDirection: 'row',
  fontSize: '1rem',
  fontWeight: bold ? 700 : 'normal',
  justifyContent: 'space-between',
  width: '100%',
}));

export const Header = styled(Row)(() => ({
  fontSize: '1.4rem',
  fontWeight: 600,
}));

export const OrderId = styled.span(() => ({
  textTransform: 'uppercase',
}));

export const OrderItemHeader = styled(Row)(() => ({
  fontWeight: 700,
}));

export const Status = styled.span({
  color: 'dodgerblue',
  fontWeight: 600,
});

export const Name = styled.span(() => ({
  height: '16px',
  lineHeight: '18px',
  width: '1000px',
}));

export const Quantity = styled.span(() => ({
  width: '162px',
  height: '13px',
  lineHeight: '13px',
}));

export const TotalContainerPrice = styled.span({
  color: transparentize(0.5, 'black'),
});
