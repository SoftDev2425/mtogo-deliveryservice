async function updateOrderStatus(
  orderId: string,
  status: 'PICKED_UP' | 'DELIVERED',
) {
  console.log(`Updating order status for order ${orderId} to ${status}`);
}

export { updateOrderStatus };
