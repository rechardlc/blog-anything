import { SearchIcon } from 'lucide-react';
export default function Search() {
  return (
    <div className="flex items-center min-w-12">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
