// React Imports
import type { ImgHTMLAttributes } from 'react';

const Logo = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      className='size-8'
      src='https://static.wixstatic.com/media/fa8dd7_a49df8881bc04f3da9b4ba1d89c007f6%7Emv2.png/v1/fill/w_192%2Ch_192%2Clg_1%2Cusm_0.66_1.00_0.01/fa8dd7_a49df8881bc04f3da9b4ba1d89c007f6%7Emv2.png'
      alt='Logo Vendis'
      {...props}
    />
  );
};

export default Logo;
