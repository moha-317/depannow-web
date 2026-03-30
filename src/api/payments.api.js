import api from './axios';

export const createPaymentIntent = async (requestId, amount) => {
  const { data } = await api.post('/payments/create-intent', { requestId, amount });
  return data; // { clientSecret, paymentIntentId, amount, commission, driverPayout }
};

export const submitReview = async (requestId, rating, comment) => {
  const { data } = await api.post('/reviews', { requestId, rating, comment });
  return data;
};
