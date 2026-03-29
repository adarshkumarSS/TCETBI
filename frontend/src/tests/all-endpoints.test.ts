import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchHomeData } from '../api/homeService';
import { fetchPeopleData } from '../api/peopleService';
import { fetchFacilitiesData } from '../api/facilityService';
import { fetchEvents } from '../api/eventService';
import { fetchMedia } from '../api/mediaService';
import { fetchBlogs } from '../api/blogService';
import { fetchPartnerships } from '../api/partnershipService';

vi.mock('axios');
const mockedAxios = axios as any;

describe('Exhaustive Frontend API Interfaces Data Binders', () => {
    
    it('homeService parses home-data correctly', async () => {
        const mockData = { vision_mission: { vision: "To lead", mission: "To build" } };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchHomeData();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/home-data/'));
        expect(result.vision_mission.vision).toBe("To lead");
    });

    it('peopleService parses board members correctly', async () => {
        const mockData = { board_members: [{name: "John", position: "Director"}] };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchPeopleData();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/people-data/'));
        expect(result.board_members[0].name).toBe("John");
    });

    it('facilityService parses facilities and videos correctly', async () => {
        const mockData = { facilities: [{description: "Lab"}], videos: [{video: "url"}] };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchFacilitiesData();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/facilities-data/'));
        expect(result.facilities.length).toBe(1);
    });

    it('eventService parses events correctly', async () => {
        const mockData = { events: [{title: "Annual Summit"}] };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchEvents();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/events-data/'));
        expect(result[0].title).toBe("Annual Summit");
    });

    it('mediaService parses media items correctly', async () => {
        const mockData = { media: [{title: "Graduation", category: "events", image: "url"}] };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchMedia();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/media-data/'));
        expect(result[0].title).toBe("Graduation");
    });

    it('blogService parses blogs correctly', async () => {
        const mockData = { blogs: [{title: "Tech Update", author: "Admin"}] };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchBlogs();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/blogs-data/'));
        expect(result[0].title).toBe("Tech Update");
    });

    it('partnershipService parses partners correctly', async () => {
        const mockData = { partnerships: [{name: "GovPartner", logo: "logo", description: "desc"}] };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        
        const result = await fetchPartnerships();
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/partnerships-data/'));
        expect(result[0].name).toBe("GovPartner");
    });
});
