# Knowledge Base Component

## Overview

Komponen Knowledge Base yang dapat digunakan kembali (reusable) dengan desain mirip GitBook. Komponen ini dirancang untuk menampilkan dokumentasi dan panduan untuk berbagai aplikasi dengan antarmuka yang intuitif dan modern.

## Architecture

### Components Structure

```
src/components/knowledgebase/
├── KnowledgebaseTab.vue         # Main wrapper component
├── KnowledgebaseMain.vue        # Main layout with header and content area
├── KnowledgebaseSidebar.vue     # Sidebar navigation with search
├── CategoryTree.vue             # Recursive tree component for categories
└── KnowledgebaseContent.vue     # Content display area
```

### Store Structure

```
src/stores/knowledgebase.ts      # Pinia store for state management
src/types/knowledgebase.ts       # TypeScript type definitions
src/core/data/knowledgebaseData.ts # Mock data source
```

## Features

### ✅ GitBook-Style Interface
- **Sidebar Navigation**: Hierarchical category tree with expand/collapse
- **Search Functionality**: Real-time search across applications, categories, and articles
- **Breadcrumb Navigation**: Clear navigation path
- **Responsive Design**: Mobile-friendly with collapsible sidebar

### ✅ Content Management
- **Article Display**: Rich content rendering with syntax highlighting
- **Favorites System**: Mark applications and articles as favorites
- **Recent Articles**: Track recently viewed content
- **Popular Articles**: Display most viewed content

### ✅ Dashboard Overview
- **Statistics Cards**: Overview of applications, articles, and views
- **Quick Actions**: Refresh, favorites filter, theme toggle
- **Search Results**: Comprehensive search with type indicators

### ✅ User Experience
- **Dark/Light Mode**: Theme switching with localStorage persistence
- **Loading States**: Proper loading and error handling
- **Mobile Responsive**: Optimized for all screen sizes
- **Export Functionality**: Export data as JSON

## Data Structure

### Application Structure
```typescript
interface KnowledgebaseApplication {
  app_id: number;
  name: string;
  category_list: KnowledgebaseCategory[];
  article_list: KnowledgebaseArticle[];
}
```

### Category Structure (Recursive)
```typescript
interface KnowledgebaseCategory {
  id: number;
  name: string;
  children: KnowledgebaseCategory[];
}
```

### Article Structure
```typescript
interface KnowledgebaseArticle {
  id: number;
  category_id: number;
  title: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  views: number;
  read_time: number;
  tags: string[];
}
```

## Usage

### Basic Integration

```vue
<template>
  <div class="dashboard">
    <KnowledgebaseTab />
  </div>
</template>

<script lang="ts">
import KnowledgebaseTab from "@/components/knowledgebase/KnowledgebaseTab.vue";

export default {
  components: {
    KnowledgebaseTab,
  },
};
</script>
```

### Store Usage

```typescript
import { useKnowledgebaseStore } from "@/stores/knowledgebase";

export default {
  setup() {
    const store = useKnowledgebaseStore();
    
    // Select application
    store.selectApplication(app);
    
    // Search functionality
    store.search("search term");
    
    // Navigate programmatically
    store.navigateToApp(appId);
    store.navigateToCategory(categoryId);
    
    // Favorites management
    store.toggleArticleFavorite(articleId);
    
    return {
      applications: store.applications,
      selectedArticle: store.selectedArticle,
      searchResults: store.searchResults,
    };
  }
};
```

## Customization

### Theme Customization

The component supports dark/light mode and can be customized through CSS variables:

```css
:global(.dark-mode) .knowledgebase-main {
  background-color: #1e1e2d;
}

:global(.dark-mode) .kb-content-area {
  background-color: #151521;
}
```

### Content Styling

Article content supports rich HTML rendering with predefined styles for:
- Headers (h1-h6)
- Code blocks and inline code
- Lists and tables
- Alert boxes (info, warning, success, danger)

### Mobile Responsiveness

- Sidebar collapses on mobile devices
- Touch-friendly navigation
- Responsive grid layouts
- Mobile overlay for sidebar

## Data Source

Data diambil dari `src/core/data/knowledgebaseData.ts` yang berisi mock data untuk:
- 3 aplikasi sample (HR Management, Project Management, Customer Support)
- Hierarki kategori untuk setiap aplikasi
- Artikel dengan konten HTML yang rich

## State Management

Menggunakan Pinia store dengan fitur:
- **Reactive State**: All data reactive and auto-updates UI
- **Persistent Favorites**: Favorites disimpan di localStorage
- **Search State**: Real-time search dengan debouncing
- **Navigation State**: Breadcrumb dan current selection tracking

## Performance Considerations

- **Lazy Loading**: Components dimuat on-demand
- **Virtual Scrolling**: Untuk daftar artikel yang panjang
- **Debounced Search**: Mencegah terlalu banyak search requests
- **Memory Management**: Proper cleanup pada component unmount

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Vue 3.3+
- Pinia 2.0+
- TypeScript 4.9+
- Bootstrap 5.3+ (for styling)

## Future Enhancements

### Planned Features
- [ ] Real-time collaboration
- [ ] Comment system
- [ ] Version history
- [ ] Advanced search filters
- [ ] Export to PDF
- [ ] Offline support
- [ ] Multi-language support

### API Integration
- [ ] RESTful API endpoints
- [ ] Real-time updates via WebSocket
- [ ] Authentication integration
- [ ] Permission-based access control

## Troubleshooting

### Common Issues

1. **Component not rendering**
   - Check if all dependencies are installed
   - Verify import paths are correct

2. **Search not working**
   - Ensure data is loaded in store
   - Check search query formatting

3. **Favorites not persisting**
   - Check localStorage permissions
   - Verify store initialization

### Debug Mode

Enable debug mode by setting `localStorage.setItem('kb-debug', 'true')` untuk logs tambahan.

## Contributing

1. Follow Vue 3 Composition API patterns
2. Use TypeScript untuk type safety
3. Follow component naming conventions
4. Add proper error handling
5. Include unit tests untuk new features

## License

MIT License - See LICENSE file for details