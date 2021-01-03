import { OnLoanContainers } from './pages';

export default {
  pages: () => [
    {
      label: 'On-loan containers',
      path: 'on-loan-containers',
      component: OnLoanContainers,
    },
    {
      label: 'Order',
      children: [
        { listKey: 'Order' },
        { listKey: 'OrderItem' },
        { listKey: 'DeliverySlot' },
      ],
    },
    {
      label: 'People',
      children: [{ listKey: 'User' }],
    },
    {
      label: 'Product',
      children: [
        { listKey: 'Category' },
        { listKey: 'Brand' },
        { listKey: 'Container' },
        { listKey: 'Product' },
        { listKey: 'ProductVariant' },
        { listKey: 'Tag' },
        { listKey: 'Unit' },
      ],
    },
    {
      label: 'Website',
      children: [
        { listKey: 'Setting' },
        { listKey: 'Email', label: 'Email Templates' },
        { listKey: 'BlogPost' },
        { listKey: 'Postcode', label: 'Allowed Postcode Outcodes' },
      ],
    },
  ],
};
