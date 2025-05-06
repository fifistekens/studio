import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the primary report page
  redirect('/reports/bureau-usage');
  // Or, you can render a welcome page here if preferred
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen py-2">
  //     <h1 className="text-4xl font-bold">Welcome to Invoicify Pro</h1>
  //     <p className="mt-3 text-lg">Navigate using the sidebar to view reports.</p>
  //   </div>
  // );
}
