import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const _statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let _textStyle = '';
  switch (status) {
    case 'pending':
      _textStyle = '#E52B1A';
      break;
    case 'done':
      _textStyle = '#00CCCC';
      break;
    default:
      _textStyle = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={_textStyle} text={_statusText[status]} />;
};
