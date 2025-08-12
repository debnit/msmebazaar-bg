import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {actions && <div>{actions}</div>}
      </div>
      {subtitle && <p className='text-gray-600'>{subtitle}</p>}
    </div>
  );
}
