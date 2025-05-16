import { IconBrandWhatsapp, IconLayoutDashboard } from '@tabler/icons-react';
import { type SidebarData } from '../types';
import Logo from '../logo';

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: 'https://freesvg.org/users-profile-icon',
  },
  teams: [
    {
      name: 'Vendis',
      logo: Logo,
      plan: 'VendisQR',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Generar Whatsapp QR',
          url: '/generate-whatsapp-qr',
          icon: IconBrandWhatsapp,
        },
      ],
    },
  ],
};
