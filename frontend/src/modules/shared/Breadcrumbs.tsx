import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname?.split('/').filter(Boolean) || [];
  let accumulated = '';

  return (
    <nav aria-label='Breadcrumb' className='text-sm mb-4'>
      <ol className='list-none p-0 inline-flex'>
        <li>
          <Link href='/' className='text-blue-600 hover:underline'>Home</Link>
          <span className='mx-2'>/</span>
        </li>
        {parts.map((part, idx) => {
          accumulated += `/${part}`;
          const isLast = idx === parts.length - 1;
          return (
            <li key={accumulated} className={isLast ? 'font-semibold' : ''}>
              {isLast ? (
                <span>{part.replace(/-/g, ' ')}</span>
              ) : (
                <>
                  <Link href={accumulated} className='text-blue-600 hover:underline'>
                    {part.replace(/-/g, ' ')}
                  </Link>
                  <span className='mx-2'>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
