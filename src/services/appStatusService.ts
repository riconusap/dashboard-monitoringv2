export interface AppStatus {
  id: number;
  name: string;
  description: string;
  url: string;
  pingStatus: "online" | "offline" | "slow";
  pingTime: number;
  sslStatus: "valid" | "expiring" | "expired";
  sslExpiry: string;
  concurrentUsers: number;
  isFavorite: boolean;
  lastChecked: Date;
}

export interface PingResult {
  status: "online" | "offline" | "slow";
  responseTime: number;
  timestamp: Date;
}

export interface SSLInfo {
  status: "valid" | "expiring" | "expired";
  expiryDate: string;
  issuer: string;
  daysUntilExpiry: number;
}

class AppStatusService {
  private apps: AppStatus[] = [
    {
      id: 1,
      name: "Web Portal",
      description: "Main customer portal",
      url: "https://portal.example.com",
      pingStatus: "online",
      pingTime: 45,
      sslStatus: "valid",
      sslExpiry: "2025-12-15",
      concurrentUsers: 156,
      isFavorite: false,
      lastChecked: new Date(),
    },
    {
      id: 2,
      name: "Admin Dashboard",
      description: "Internal admin interface",
      url: "https://admin.example.com",
      pingStatus: "slow",
      pingTime: 890,
      sslStatus: "expiring",
      sslExpiry: "2024-11-30",
      concurrentUsers: 23,
      isFavorite: true,
      lastChecked: new Date(),
    },
    {
      id: 3,
      name: "API Gateway",
      description: "REST API services",
      url: "https://api.example.com",
      pingStatus: "online",
      pingTime: 12,
      sslStatus: "valid",
      sslExpiry: "2026-03-20",
      concurrentUsers: 89,
      isFavorite: false,
      lastChecked: new Date(),
    },
    {
      id: 4,
      name: "Mobile App Backend",
      description: "Mobile application services",
      url: "https://mobile-api.example.com",
      pingStatus: "offline",
      pingTime: 0,
      sslStatus: "expired",
      sslExpiry: "2024-08-15",
      concurrentUsers: 0,
      isFavorite: false,
      lastChecked: new Date(),
    },
    {
      id: 5,
      name: "Payment Gateway",
      description: "Payment processing service",
      url: "https://payments.example.com",
      pingStatus: "online",
      pingTime: 120,
      sslStatus: "valid",
      sslExpiry: "2025-08-30",
      concurrentUsers: 45,
      isFavorite: false,
      lastChecked: new Date(),
    },
    {
      id: 6,
      name: "Analytics Dashboard",
      description: "Business analytics and reporting",
      url: "https://analytics.example.com",
      pingStatus: "slow",
      pingTime: 650,
      sslStatus: "expiring",
      sslExpiry: "2024-10-15",
      concurrentUsers: 12,
      isFavorite: true,
      lastChecked: new Date(),
    },
  ];

  // Simulate ping check with random variations
  async pingApp(_url: string): Promise<PingResult> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(
        () => {
          const baseTime = Math.random() * 500 + 10; // 10-510ms base
          const isDown = Math.random() < 0.1; // 10% chance of being down
          const isSlow = Math.random() < 0.2; // 20% chance of being slow

          if (isDown) {
            resolve({
              status: "offline",
              responseTime: 0,
              timestamp: new Date(),
            });
          } else if (isSlow) {
            resolve({
              status: "slow",
              responseTime: baseTime + 500,
              timestamp: new Date(),
            });
          } else {
            resolve({
              status: "online",
              responseTime: baseTime,
              timestamp: new Date(),
            });
          }
        },
        100 + Math.random() * 500,
      ); // Simulate network delay
    });
  }

  // Simulate SSL certificate check
  async checkSSL(_url: string): Promise<SSLInfo> {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          const now = new Date();
          const futureDate = new Date(now);

          // Random expiry between 30 days ago and 1 year from now
          const daysOffset = Math.floor(Math.random() * 395) - 30;
          futureDate.setDate(now.getDate() + daysOffset);

          const daysUntilExpiry = Math.floor(
            (futureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );

          let status: "valid" | "expiring" | "expired";
          if (daysUntilExpiry < 0) {
            status = "expired";
          } else if (daysUntilExpiry < 30) {
            status = "expiring";
          } else {
            status = "valid";
          }

          resolve({
            status,
            expiryDate: futureDate.toISOString().split("T")[0],
            issuer: "Let's Encrypt Authority X3",
            daysUntilExpiry,
          });
        },
        200 + Math.random() * 300,
      );
    });
  }

  // Simulate concurrent users count
  async getConcurrentUsers(appId: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate user count fluctuation
        const app = this.apps.find((a) => a.id === appId);
        if (app) {
          const baseUsers = app.concurrentUsers;
          const variation = Math.floor(Math.random() * 20) - 10; // ±10 users
          const newCount = Math.max(0, baseUsers + variation);
          resolve(newCount);
        } else {
          resolve(0);
        }
      }, 150);
    });
  }

  // Get all apps
  async getAllApps(): Promise<AppStatus[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.apps]);
      }, 100);
    });
  }

  // Get single app
  async getApp(id: number): Promise<AppStatus | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const app = this.apps.find((a) => a.id === id);
        resolve(app || null);
      }, 50);
    });
  }

  // Update app status (for real-time monitoring)
  async updateAppStatus(id: number): Promise<AppStatus | null> {
    const app = this.apps.find((a) => a.id === id);
    if (!app) return null;

    // Simulate concurrent checks
    const [pingResult, sslInfo, userCount] = await Promise.all([
      this.pingApp(app.url),
      this.checkSSL(app.url),
      this.getConcurrentUsers(id),
    ]);

    // Update app with new data
    app.pingStatus = pingResult.status;
    app.pingTime = pingResult.responseTime;
    app.sslStatus = sslInfo.status;
    app.sslExpiry = sslInfo.expiryDate;
    app.concurrentUsers = userCount;
    app.lastChecked = new Date();

    return { ...app };
  }

  // Toggle favorite status
  async toggleFavorite(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const app = this.apps.find((a) => a.id === id);
        if (app) {
          app.isFavorite = !app.isFavorite;
          resolve(app.isFavorite);
        } else {
          resolve(false);
        }
      }, 50);
    });
  }

  // Get favorite apps
  async getFavoriteApps(): Promise<AppStatus[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.apps.filter((app) => app.isFavorite));
      }, 100);
    });
  }

  // Bulk update all apps (for dashboard refresh)
  async refreshAllApps(): Promise<AppStatus[]> {
    const updatePromises = this.apps.map((app) => this.updateAppStatus(app.id));
    const updatedApps = await Promise.all(updatePromises);
    return updatedApps.filter((app) => app !== null) as AppStatus[];
  }

  // Simulate adding a new app
  async addApp(
    appData: Omit<AppStatus, "id" | "lastChecked">,
  ): Promise<AppStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newApp: AppStatus = {
          ...appData,
          id: Math.max(...this.apps.map((a) => a.id)) + 1,
          lastChecked: new Date(),
        };
        this.apps.push(newApp);
        resolve(newApp);
      }, 200);
    });
  }

  // Remove app
  async removeApp(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.apps.findIndex((a) => a.id === id);
        if (index > -1) {
          this.apps.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 100);
    });
  }

  // Get apps by status
  async getAppsByStatus(
    status: "online" | "offline" | "slow",
  ): Promise<AppStatus[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.apps.filter((app) => app.pingStatus === status));
      }, 100);
    });
  }

  // Get apps with SSL issues
  async getAppsWithSSLIssues(): Promise<AppStatus[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.apps.filter((app) => app.sslStatus !== "valid"));
      }, 100);
    });
  }
}

// Export singleton instance
export const appStatusService = new AppStatusService();
export default appStatusService;
