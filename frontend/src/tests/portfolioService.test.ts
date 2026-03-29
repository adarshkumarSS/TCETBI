import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchPortfolioData, PortfolioData, Startup, deleteStartup } from '../api/portfolioService';

// Mock axios and global fetch
vi.mock('axios');
global.fetch = vi.fn();

describe('portfolioService API tests', () => {
  it('correctly maps backend GET data to PortfolioData interfaces', async () => {
      const mockStartup: Startup = {
          id: 1,
          name: "Test Frontend Startup",
          logo: "http://res.cloudinary.com/test",
          description: "Testing API bindings",
          sector: "Testing",
          founded: "2026",
          website: "http://test.com",
          category: "current",
          ceos: [{ name: "Tester", image: "http://image", bio: "Testing bio" }]
      };
      
      const mockResponse: PortfolioData = {
          current_startups: [mockStartup],
          graduated_startups: []
      };
      
      // Setup the mock response
      (axios.get as any).mockResolvedValue({ data: mockResponse });
      
      const result = await fetchPortfolioData();
      
      // Verify the correct endpoint is hit
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/portfolio-data/');
      
      // Verify data is returned perfectly mapped to our Typescript schema without silent dropping
      expect(result).toEqual(mockResponse);
      expect(result.current_startups[0].name).toBe("Test Frontend Startup");
      expect(result.current_startups[0].ceos[0].name).toBe("Tester");
  });

  it('correctly parses DELETE success responses', async () => {
      // Mock fetch response for delete
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const response = await deleteStartup(99);
      
      expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/delete-startup/99/', {
        method: "DELETE"
      });
      expect(response.success).toBe(true);
  });
});
