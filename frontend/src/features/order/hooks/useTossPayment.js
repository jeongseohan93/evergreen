import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

export const useTossPayment = (clientKey) => {
  const [widgets, setWidgets] = useState(null);

  const initTossWidgets = async (customerKey) => {
    const tossPayments = await loadTossPayments(clientKey);
    const paymentWidgets = tossPayments.widgets({ customerKey });
    setWidgets(paymentWidgets);
    return paymentWidgets;
  };

  return { widgets, initTossWidgets };
}; 