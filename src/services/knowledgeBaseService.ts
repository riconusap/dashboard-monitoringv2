export interface KnowledgeBaseTopic {
  id: string;
  title: string;
  content: string;
  slug: string;
  parentId?: string;
  order: number;
  isFavorite: boolean;
  lastModified: Date;
  tags: string[];
  applicationId: number;
}

export interface KnowledgeBaseApplication {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  isFavorite: boolean;
  topicsCount: number;
}

export interface SearchResult {
  type: "application" | "topic";
  id: string | number;
  title: string;
  excerpt: string;
  applicationName?: string;
  applicationId?: number;
  relevanceScore: number;
}

class KnowledgeBaseService {
  private applications: KnowledgeBaseApplication[] = [
    {
      id: 1,
      name: "Web Portal",
      description: "Main customer portal documentation",
      icon: "ki-globe",
      color: "primary",
      isFavorite: false,
      topicsCount: 15,
    },
    {
      id: 2,
      name: "Admin Dashboard",
      description: "Internal admin interface guides",
      icon: "ki-chart-line-up",
      color: "success",
      isFavorite: true,
      topicsCount: 22,
    },
    {
      id: 3,
      name: "API Gateway",
      description: "REST API documentation and examples",
      icon: "ki-code",
      color: "info",
      isFavorite: false,
      topicsCount: 18,
    },
    {
      id: 4,
      name: "Mobile App Backend",
      description: "Mobile application services documentation",
      icon: "ki-tablet",
      color: "warning",
      isFavorite: false,
      topicsCount: 12,
    },
    {
      id: 5,
      name: "Payment Gateway",
      description: "Payment processing documentation",
      icon: "ki-credit-cart",
      color: "danger",
      isFavorite: true,
      topicsCount: 8,
    },
  ];

  private topics: KnowledgeBaseTopic[] = [
    // Web Portal Topics
    {
      id: "wp-001",
      title: "Getting Started",
      content: `# Getting Started with Web Portal

Welcome to the Web Portal documentation. This guide will help you understand the basics of our customer portal system.

## Overview

The Web Portal is the main interface for customers to access their accounts, manage services, and view billing information.

## Key Features

- User authentication and authorization
- Dashboard with account overview
- Service management
- Billing and payment history
- Support ticket system

## Quick Start

1. **Login Process**: Users can log in using email/password or social authentication
2. **Dashboard Navigation**: The main dashboard provides quick access to all features
3. **Account Management**: Users can update their profile and preferences
4. **Service Access**: Direct links to all subscribed services`,
      slug: "getting-started",
      order: 1,
      isFavorite: false,
      lastModified: new Date("2024-09-15"),
      tags: ["getting-started", "overview", "portal"],
      applicationId: 1,
    },
    {
      id: "wp-002",
      title: "Authentication System",
      content: `# Authentication System

The Web Portal uses a robust authentication system with multiple security layers.

## Supported Methods

- **Email/Password**: Traditional authentication with strong password requirements
- **Social Login**: Google, Facebook, LinkedIn integration
- **Two-Factor Authentication**: SMS and authenticator app support
- **Single Sign-On (SSO)**: Enterprise SSO integration

## Security Features

- Password complexity requirements
- Account lockout protection
- Session management
- Device tracking
- Suspicious activity alerts

## Implementation Details

The authentication system is built on OAuth 2.0 and supports JWT tokens for session management.`,
      slug: "authentication-system",
      order: 2,
      isFavorite: true,
      lastModified: new Date("2024-09-10"),
      tags: ["authentication", "security", "oauth", "jwt"],
      applicationId: 1,
    },
    {
      id: "wp-003",
      title: "User Dashboard",
      content: `# User Dashboard

The user dashboard is the central hub for all customer activities.

## Dashboard Components

### Summary Cards
- Account status
- Service overview
- Recent activity
- Quick actions

### Navigation Menu
- Account settings
- Service management
- Billing information
- Support center

### Activity Feed
- Recent transactions
- System notifications
- Service updates
- Support ticket status

## Customization

Users can customize their dashboard by:
- Rearranging widgets
- Hiding/showing components
- Setting preferences
- Creating shortcuts`,
      slug: "user-dashboard",
      order: 3,
      isFavorite: false,
      lastModified: new Date("2024-09-08"),
      tags: ["dashboard", "ui", "widgets", "customization"],
      applicationId: 1,
    },

    // Admin Dashboard Topics
    {
      id: "ad-001",
      title: "Admin Overview",
      content: `# Admin Dashboard Overview

The Admin Dashboard provides comprehensive tools for system administration and user management.

## Core Functions

### User Management
- Create, edit, and deactivate user accounts
- Role and permission management
- Bulk user operations
- User activity monitoring

### System Monitoring
- Application health checks
- Performance metrics
- Error logs and alerts
- Resource usage statistics

### Content Management
- Page content editing
- Media library management
- Template customization
- Static content updates

## Access Control

Admin access is restricted to authorized personnel with appropriate roles and permissions.`,
      slug: "admin-overview",
      order: 1,
      isFavorite: false,
      lastModified: new Date("2024-09-12"),
      tags: ["admin", "overview", "management", "monitoring"],
      applicationId: 2,
    },
    {
      id: "ad-002",
      title: "User Management",
      content: `# User Management System

Comprehensive user administration tools for managing customer accounts and access.

## User Account Operations

### Creating Users
- Manual user creation
- Bulk import from CSV
- Automated provisioning
- Template-based creation

### User Profiles
- Personal information management
- Contact details
- Preferences and settings
- Account history

### Access Control
- Role assignment
- Permission management
- Feature access control
- Service entitlements

## Bulk Operations

Efficiently manage multiple users with:
- Bulk role updates
- Mass communication
- Group operations
- Batch imports/exports`,
      slug: "user-management",
      order: 2,
      isFavorite: true,
      lastModified: new Date("2024-09-11"),
      tags: ["users", "management", "roles", "permissions"],
      applicationId: 2,
    },

    // API Gateway Topics
    {
      id: "api-001",
      title: "API Documentation",
      content: `# API Gateway Documentation

Complete reference for our REST API services and integration guidelines.

## API Overview

Our API Gateway provides a unified interface to all backend services with:
- RESTful endpoints
- JSON request/response format
- OAuth 2.0 authentication
- Rate limiting and throttling
- Comprehensive error handling

## Authentication

All API requests require authentication using Bearer tokens:

\`\`\`
Authorization: Bearer your-access-token
\`\`\`

## Base URL

\`\`\`
https://api.example.com/v1/
\`\`\`

## Common Headers

\`\`\`
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
\`\`\``,
      slug: "api-documentation",
      order: 1,
      isFavorite: false,
      lastModified: new Date("2024-09-14"),
      tags: ["api", "documentation", "rest", "authentication"],
      applicationId: 3,
    },
    {
      id: "api-002",
      title: "Rate Limiting",
      content: `# API Rate Limiting

Understanding and managing API request limits to ensure fair usage.

## Rate Limit Policies

### Standard Limits
- **Free Tier**: 1,000 requests per hour
- **Basic Plan**: 10,000 requests per hour
- **Premium Plan**: 100,000 requests per hour
- **Enterprise**: Custom limits

### Rate Limit Headers

Every API response includes rate limit information:

\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
\`\`\`

## Handling Rate Limits

When you exceed rate limits, the API returns a 429 status code:

\`\`\`json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 3600
}
\`\`\`

## Best Practices

- Implement exponential backoff
- Cache responses when possible
- Use webhooks for real-time updates
- Monitor usage patterns`,
      slug: "rate-limiting",
      order: 2,
      isFavorite: true,
      lastModified: new Date("2024-09-13"),
      tags: ["api", "rate-limiting", "throttling", "best-practices"],
      applicationId: 3,
    },
  ];

  // Get all applications
  async getApplications(): Promise<KnowledgeBaseApplication[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.applications]);
      }, 100);
    });
  }

  // Get single application
  async getApplication(id: number): Promise<KnowledgeBaseApplication | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const app = this.applications.find((a) => a.id === id);
        resolve(app || null);
      }, 50);
    });
  }

  // Get topics for an application
  async getTopics(applicationId: number): Promise<KnowledgeBaseTopic[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topics = this.topics
          .filter((t) => t.applicationId === applicationId)
          .sort((a, b) => a.order - b.order);
        resolve(topics);
      }, 100);
    });
  }

  // Get single topic
  async getTopic(id: string): Promise<KnowledgeBaseTopic | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topic = this.topics.find((t) => t.id === id);
        resolve(topic || null);
      }, 50);
    });
  }

  // Search across all content
  async search(query: string): Promise<SearchResult[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results: SearchResult[] = [];
        const searchTerms = query.toLowerCase().split(" ");

        // Search applications
        this.applications.forEach((app) => {
          const searchText = `${app.name} ${app.description}`.toLowerCase();
          const matches = searchTerms.filter((term) =>
            searchText.includes(term),
          ).length;

          if (matches > 0) {
            results.push({
              type: "application",
              id: app.id,
              title: app.name,
              excerpt: app.description,
              relevanceScore: matches / searchTerms.length,
            });
          }
        });

        // Search topics
        this.topics.forEach((topic) => {
          const searchText =
            `${topic.title} ${topic.content} ${topic.tags.join(" ")}`.toLowerCase();
          const matches = searchTerms.filter((term) =>
            searchText.includes(term),
          ).length;

          if (matches > 0) {
            const app = this.applications.find(
              (a) => a.id === topic.applicationId,
            );
            results.push({
              type: "topic",
              id: topic.id,
              title: topic.title,
              excerpt: this.extractExcerpt(topic.content, query),
              applicationName: app?.name,
              applicationId: topic.applicationId,
              relevanceScore: matches / searchTerms.length,
            });
          }
        });

        // Sort by relevance score
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        resolve(results);
      }, 200);
    });
  }

  // Extract relevant excerpt from content
  private extractExcerpt(content: string, query: string): string {
    const sentences = content.split(/[.!?]+/);
    const queryLower = query.toLowerCase();

    // Find sentence containing the query
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(queryLower)) {
        return sentence.trim().substring(0, 150) + "...";
      }
    }

    // Return first 150 characters if no match found
    return content.substring(0, 150) + "...";
  }

  // Toggle application favorite
  async toggleApplicationFavorite(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const app = this.applications.find((a) => a.id === id);
        if (app) {
          app.isFavorite = !app.isFavorite;
          resolve(app.isFavorite);
        } else {
          resolve(false);
        }
      }, 50);
    });
  }

  // Toggle topic favorite
  async toggleTopicFavorite(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topic = this.topics.find((t) => t.id === id);
        if (topic) {
          topic.isFavorite = !topic.isFavorite;
          resolve(topic.isFavorite);
        } else {
          resolve(false);
        }
      }, 50);
    });
  }

  // Get favorite applications
  async getFavoriteApplications(): Promise<KnowledgeBaseApplication[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.applications.filter((app) => app.isFavorite));
      }, 100);
    });
  }

  // Get favorite topics
  async getFavoriteTopics(): Promise<KnowledgeBaseTopic[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.topics.filter((topic) => topic.isFavorite));
      }, 100);
    });
  }

  // Get recent topics
  async getRecentTopics(limit = 5): Promise<KnowledgeBaseTopic[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...this.topics].sort(
          (a, b) => b.lastModified.getTime() - a.lastModified.getTime(),
        );
        resolve(sorted.slice(0, limit));
      }, 100);
    });
  }

  // Get topics by tag
  async getTopicsByTag(tag: string): Promise<KnowledgeBaseTopic[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.topics.filter((topic) => topic.tags.includes(tag)));
      }, 100);
    });
  }

  // Get all tags
  async getAllTags(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tags = new Set<string>();
        this.topics.forEach((topic) => {
          topic.tags.forEach((tag) => tags.add(tag));
        });
        resolve(Array.from(tags).sort());
      }, 100);
    });
  }
}

// Export singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService;
