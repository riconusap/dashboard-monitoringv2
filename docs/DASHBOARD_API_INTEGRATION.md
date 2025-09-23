# Dashboard API Integration for Knowledge Base

## Overview
Implementasi integrasi API `/dashboard` untuk tab Knowledge Base telah berhasil ditambahkan, memungkinkan aplikasi untuk mengambil data knowledge base dari backend API.

## Files Added/Modified

### 1. **DashboardApiService.ts** (New)
Service untuk menangani komunikasi dengan endpoint `/dashboard`

```typescript
// Location: src/services/DashboardApiService.ts
// Purpose: API service for dashboard data including knowledge base
```

#### Features:
- **getDashboardData()**: Mengambil semua data dashboard
- **getKnowledgebaseApps()**: Mengambil aplikasi knowledge base
- **getKnowledgebaseApp(id)**: Mengambil aplikasi specific by ID
- **searchKnowledgebase(query)**: Pencarian dalam knowledge base
- **getKnowledgebaseStats()**: Statistik knowledge base

### 2. **Enhanced Knowledgebase Store** (Modified)
```typescript
// Location: src/stores/knowledgebase.ts
// Added API integration with fallback to mock data
```

#### New State:
- **isLoading**: Status loading API data
- **error**: Error state untuk API calls
- **useApiData**: Toggle between API dan mock data

#### New Functions:
- **loadKnowledgebaseFromApi()**: Load data dari API
- **searchKnowledgebaseApi()**: Search menggunakan API
- **refreshKnowledgebaseData()**: Refresh data dari API
- **toggleDataSource()**: Switch between API/mock data

### 3. **Enhanced KnowledgebaseMain Component** (Modified)
```vue
<!-- Location: src/components/knowledgebase/KnowledgebaseMain.vue -->
<!-- Added API integration with loading states -->
```

#### New Features:
- **Loading States**: Spinner saat load data dari API
- **Error Handling**: Error states dengan retry functionality
- **API Toggle**: Button untuk switch antara API dan mock data
- **Automatic Loading**: Auto-load data dari API saat component mount

### 4. **Enhanced KnowledgebaseSidebar Component** (Modified)
```vue
<!-- Location: src/components/knowledgebase/KnowledgebaseSidebar.vue -->
<!-- Added API search integration -->
```

#### New Features:
- **API Search**: Search menggunakan API endpoint
- **Fallback Search**: Fallback ke local search jika API gagal

## API Integration Details

### **Expected API Response Format**

#### Dashboard Endpoint Response:
```json
{
  "data": {
    "knowledge_base": [
      {
        "app_id": 1,
        "name": "Application Name",
        "description": "App description",
        "icon": "icon-name",
        "category_list": [...],
        "article_list": [...],
        "stats": {...}
      }
    ],
    "monitoring": [...],
    "stats": {...}
  },
  "message": "Success",
  "status": "ok"
}
```

#### Search Endpoint Response:
```json
{
  "data": [
    {
      "type": "article|category|application",
      "item": {...},
      "app": {...},
      "highlight": "matched text"
    }
  ]
}
```

### **API Endpoints Used**

1. **GET /dashboard**
   - Mengambil semua data dashboard termasuk knowledge base
   - Response: DashboardApiResponse

2. **POST /dashboard/search**
   - Pencarian dalam knowledge base
   - Body: `{ "query": "search term" }`
   - Response: Array of search results

## User Interface Enhancements

### **API Status Indicator**
- **Green "API" Button**: Menggunakan data dari API
- **Yellow "Mock" Button**: Menggunakan mock data
- **Loading Spinner**: Saat mengambil data dari API
- **Error State**: Dengan tombol retry jika API gagal

### **Loading States**
```vue
<!-- Loading State -->
<div v-if="isLoading" class="loading-spinner">
  <div class="spinner-border text-primary">
    <span class="visually-hidden">Loading...</span>
  </div>
  <p>Loading knowledge base...</p>
</div>

<!-- Error State -->
<div v-else-if="hasError" class="error-state">
  <i class="ki-duotone ki-information fs-3x text-danger"></i>
  <h5>Error Loading Content</h5>
  <p>{{ errorMessage }}</p>
  <button @click="retryLoad">Retry</button>
</div>
```

## Configuration

### **Environment Variables**
API base URL sudah dikonfigurasi di `.env`:
```
VITE_APP_API_URL="http://62.72.44.203:4079"
```

### **Authentication**
- API calls menggunakan Bearer token dari login
- Token otomatis ditambahkan ke headers via ApiService

## Error Handling

### **Fallback Strategy**
1. **Primary**: Coba ambil data dari API
2. **Fallback**: Jika API gagal, gunakan mock data
3. **User Feedback**: Tampilkan error message dengan option retry

### **Error Types Handled**
- **Network Errors**: Koneksi internet bermasalah
- **Server Errors**: API server error (500, 404, etc.)
- **Authentication Errors**: Token expired/invalid
- **Timeout Errors**: Request timeout

## Usage Examples

### **Loading Knowledge Base Data**
```typescript
// Automatic on component mount
onMounted(async () => {
  await store.loadKnowledgebaseFromApi();
});

// Manual refresh
const refreshData = async () => {
  await store.refreshKnowledgebaseData();
};
```

### **Searching Knowledge Base**
```typescript
// API Search
const searchApi = async (query: string) => {
  await store.searchKnowledgebaseApi(query);
};

// Toggle data source
const toggleSource = () => {
  store.toggleDataSource();
};
```

### **Handling Loading States**
```vue
<template>
  <!-- Show loading spinner -->
  <div v-if="store.isLoading">Loading...</div>
  
  <!-- Show error state -->
  <div v-else-if="store.error">
    Error: {{ store.error }}
    <button @click="retryLoad">Retry</button>
  </div>
  
  <!-- Show content -->
  <div v-else>
    <KnowledgebaseContent />
  </div>
</template>
```

## Benefits

### **Performance**
- **Real-time Data**: Data selalu up-to-date dari server
- **Smart Caching**: Local fallback untuk better performance
- **Lazy Loading**: Load data hanya saat diperlukan

### **User Experience**
- **Loading Indicators**: Clear feedback saat loading
- **Error Recovery**: Easy retry mechanism
- **Seamless Fallback**: Transparent fallback ke mock data
- **Source Transparency**: User tahu data source (API/Mock)

### **Maintenance**
- **Centralized API Logic**: Semua API calls dalam satu service
- **Error Handling**: Consistent error handling pattern
- **Configuration**: Easy API endpoint configuration

## Testing

### **Manual Testing**
1. **API Mode**: Toggle ke API, pastikan data load dari server
2. **Mock Mode**: Toggle ke Mock, pastikan menggunakan local data
3. **Network Issues**: Test dengan network disabled
4. **Error Recovery**: Test retry functionality

### **Test Scenarios**
- ✅ Load data from API on component mount
- ✅ Fallback to mock data when API fails
- ✅ Search using API with fallback to local search
- ✅ Toggle between API and mock data sources
- ✅ Error states with retry functionality
- ✅ Loading states during API calls

## Future Enhancements

### **Potential Improvements**
1. **Caching Strategy**: Implement proper caching mechanism
2. **Offline Support**: Better offline functionality
3. **Real-time Updates**: WebSocket for real-time data updates
4. **Analytics**: Track API usage and performance
5. **Pagination**: Handle large datasets with pagination
6. **Advanced Search**: More sophisticated search features

### **API Optimizations**
1. **Batch Requests**: Combine multiple API calls
2. **Incremental Updates**: Only fetch changed data
3. **Background Sync**: Sync data in background
4. **Response Compression**: Compress API responses
5. **CDN Integration**: Cache static content

The dashboard API integration is now fully functional and provides a seamless experience for users while maintaining backward compatibility with mock data.