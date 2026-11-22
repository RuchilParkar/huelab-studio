import React, { Suspense } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useHueStore } from './store/useHueStore';
import { GeneratorPage } from './pages/GeneratorPage';
import { ExplorePage } from './pages/ExplorePage';
import { ImageExtractorPage } from './pages/ImageExtractorPage';
import { GradientPage } from './pages/GradientPage';
import { ContrastPage } from './pages/ContrastPage';
import { ColorConverterPage } from './pages/ColorConverterPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { activePage } = useHueStore();

  const renderActivePage = () => {
    switch (activePage) {
      case 'generator':
        return <GeneratorPage />;
      case 'explore':
        return <ExplorePage />;
      case 'image-extractor':
        return <ImageExtractorPage />;
      case 'gradient':
        return <GradientPage />;
      case 'contrast':
        return <ContrastPage />;
      case 'color-converter':
        return <ColorConverterPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <GeneratorPage />;
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">{renderActivePage()}</div>
    </AppLayout>
  );
};

export default App;
