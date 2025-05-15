import Cookies from 'js-cookie';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { SearchProvider } from '@/context/search-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import SkipToMain from '@/components/skip-to-main';
import { Authenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
});

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false';
  return (
    <>
      <Authenticator
        className='min-h-svh grid place-items-center relative'
        hideSignUp
        components={{
          Header() {
            return (
              <div className='text-center py-6 flex items-center justify-center gap-2'>
                <img
                  alt='Logo de Amplify'
                  src='/img/vendis-logo.webp'
                  className='w-32'
                />

                {/*   <span className="text-4xl font-semibold">+</span>

                <div className="text-2xl text-white font-semibold bg-primary/90 p-2 rounded-xl">
                  POS
                </div> */}
              </div>
            );
          },

          Footer() {
            return (
              <div>
                <div className='text-center py-6 text-gray-500'>
                  <p>&copy; Todos los derechos reservados</p>
                </div>

                <Button
                  variant={'link'}
                  className='absolute top-4 right-4'
                  asChild
                >
                  <Link to={'/'}>
                    <Home />
                    Ir al inicio
                  </Link>
                </Button>
              </div>
            );
          },

          SignIn: {
            Header() {
              return (
                <p className='text-2xl text-center font-semibold pt-8'>
                  Inicia sesión en tu cuenta
                </p>
              );
            },
          },
        }}
      >
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar />
            <div
              id='content'
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'sm:transition-[width] sm:duration-200 sm:ease-linear',
                'flex h-svh flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
              )}
            >
              <Outlet />
            </div>
          </SidebarProvider>
        </SearchProvider>
      </Authenticator>
    </>
  );
}
