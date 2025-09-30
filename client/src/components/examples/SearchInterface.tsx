import SearchInterface from '../SearchInterface';

export default function SearchInterfaceExample() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <SearchInterface 
        onSearch={(query, filters) => console.log('Search executed:', { query, filters })}
        onClearFilters={() => console.log('Filters cleared')}
      />
    </div>
  );
}