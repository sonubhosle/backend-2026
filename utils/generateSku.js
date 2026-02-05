 const generateProductSku = (title, brand) => {
  const t = title.substring(0, 4).toUpperCase();
  const b = brand.substring(0, 4).toUpperCase();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `PRE-${b}-${t}-${rand}`;
};

const generateSkuCode = (productSku, weight) => {
  return `${productSku}-${weight.toUpperCase()}`;
};

module.exports =  {generateProductSku,generateSkuCode};