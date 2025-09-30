import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header 
      onMenuClick={() => console.log('Menu clicked')}
      onProfileClick={() => console.log('Profile clicked')}
      onSearch={(query) => console.log('Search for:', query)}
    />
  );
}