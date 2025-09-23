import ApiService from "@/core/services/ApiService";
import type { KnowledgebaseApplication } from "@/types/knowledgebase";

export interface DashboardApiResponse {
  data: {
    knowledge_base?: KnowledgebaseApplication[];
    monitoring?: any[];
    stats?: any;
  };
  message?: string;
  status?: string;
}

class DashboardApiService {
  /**
   * Get dashboard data including knowledge base
   */
  public static async getDashboardData(): Promise<DashboardApiResponse> {
    try {
      const response = await ApiService.get("dashboard");
      return response.data.data.application;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  /**
   * Get knowledge base applications from dashboard
   * This directly returns the dashboard data as knowledge base applications
   */
  public static async getKnowledgebaseApps(): Promise<
    KnowledgebaseApplication[]
  > {
    try {
      const dashboardResponse = await this.getDashboardData();

      // If the dashboard response has knowledge_base data, use it
      if (dashboardResponse.data?.knowledge_base) {
        return dashboardResponse.data.knowledge_base;
      }

      // If the dashboard response itself is the application data
      // (assuming the response structure might be different)
      if (Array.isArray(dashboardResponse.data)) {
        return dashboardResponse.data as KnowledgebaseApplication[];
      }

      // If dashboard response has a different structure, adapt here
      // You might need to transform the dashboard data to match KnowledgebaseApplication format
      return [];
    } catch (error) {
      console.error("Error fetching knowledge base apps:", error);
      throw error;
    }
  }

  /**
   * Get specific knowledge base application
   */
  public static async getKnowledgebaseApp(
    appId: number,
  ): Promise<KnowledgebaseApplication | null> {
    try {
      const apps = await this.getKnowledgebaseApps();
      return apps.find((app) => app.app_id === appId) || null;
    } catch (error) {
      console.error("Error fetching knowledge base app:", error);
      throw error;
    }
  }

  /**
   * Search knowledge base articles
   */
  public static async searchKnowledgebase(query: string): Promise<any[]> {
    try {
      const response = await ApiService.post("dashboard/search", { query });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      // Fallback to local search if API fails
      return [];
    }
  }

  /**
   * Get knowledge base statistics
   */
  public static async getKnowledgebaseStats(): Promise<any> {
    try {
      const response = await this.getDashboardData();
      return response.data?.stats || {};
    } catch (error) {
      console.error("Error fetching knowledge base stats:", error);
      return {};
    }
  }
}

export default DashboardApiService;
