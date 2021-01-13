import React, { forwardRef } from 'react';

import * as Styled from './Card.styled';

export const Card = forwardRef(({ children, margin = '0' }, ref) => (
  <Styled.Card margin={margin} ref={ref}>
    {children}
  </Styled.Card>
));
