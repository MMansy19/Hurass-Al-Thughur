// Define custom Next.js page props to fix build error

declare module 'next' {
  export interface PageProps {
    params: {
      locale: string
    };
    searchParams?: {
      [key: string]: string | string[] | undefined
    };
  }
}
