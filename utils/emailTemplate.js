 const orderEmailTemplate = (order, title, message) => {
  const orderItemsHTML = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:10px;border:1px solid #ddd;">${item.title}</td>
        <td style="padding:10px;border:1px solid #ddd;">${item.quantity}</td>
        <td style="padding:10px;border:1px solid #ddd;">₹${item.discountedPrice}</td>
      </tr>
    `
    )
    .join("");

  const orderTotal = `
    <tr>
      <td colspan="2" style="padding:10px;text-align:right;font-weight:bold;">Total:</td>
      <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">₹${order.totalDiscountPrice}</td>
    </tr>
  `;

  return `
    <div style="font-family: Arial, sans-serif; background:#f8f9fa; padding:20px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        <div style="background:#68f79f;padding:20px;text-align:center;color:white;">
          <h2>${title}</h2>
        </div>

        <div style="padding:20px;">
          <p>Hi <b>${order.user?.firstName || 'Customer'}</b>,</p>
          <p>${message}</p>
          <p>Here are your order details:</p>

          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <thead>
              <tr style="background:#f0f0f0;">
                <th style="padding:10px;border:1px solid #ddd;">Product</th>
                <th style="padding:10px;border:1px solid #ddd;">Qty</th>
                <th style="padding:10px;border:1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
              ${orderTotal}
            </tbody>
          </table>

          <p style="margin-top:20px;">You can check your order status anytime:</p>
          <a href="${process.env.CLIENT_URL}/account/order/${order._id}" 
             style="display:inline-block;padding:12px 20px;background:#68f79f;color:#fff;text-decoration:none;border-radius:5px;">
            View Order Details
          </a>

          <p style="margin-top:20px;">Thank you for shopping with <b>Shoply</b> 💚</p>
        </div>

        <div style="background:#f0f0f0;padding:10px;text-align:center;color:#777;font-size:12px;">
          © ${new Date().getFullYear()} Shoply — All Rights Reserved
        </div>
      </div>
    </div>
  `;
};

module.exports = orderEmailTemplate