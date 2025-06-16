import { fetchMovieDetailsFromTMDb } from '../controllers/movieController.js';
import { jest, test, expect, describe, beforeEach } from '@jest/globals';
import { fetchMovieDetailsFromOMDb } from '../controllers/movieController.js';

describe('fetchMovieDetailsFromTMDb', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
  });

  test('returns movie details on success', async () => {
    const mockData = { id: 123, title: 'Inception' };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    const result = await fetchMovieDetailsFromTMDb(123, mockFetch);
    expect(result).toEqual(mockData);
  });

  test('throws error on API failure', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found'
    });

    await expect(fetchMovieDetailsFromTMDb(999, mockFetch)).rejects.toThrow('TMDb API error: Not Found');
  });

  test('returns movie details on success', async () => {
    const mockData = {
      Response: "True",
      Title: "Inception",
      Year: "2010",
      imdbID: "tt1375666",
      Plot: "A thief who steals corporate secrets...",
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchMovieDetailsFromOMDb('tt1375666', mockFetch);
    expect(result).toEqual(mockData);
  });

  test('throws error if response.ok is false', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Service Unavailable',
    });

    await expect(fetchMovieDetailsFromOMDb('tt0000000', mockFetch))
      .rejects
      .toThrow('OMDb API error: Service Unavailable');
  });

  test('throws error if API responds with Response: "False"', async () => {
    const errorResponse = {
      Response: "False",
      Error: "Movie not found!",
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => errorResponse,
    });

    await expect(fetchMovieDetailsFromOMDb('invalidID', mockFetch))
      .rejects
      .toThrow('OMDb API error: Movie not found!');
  });

});
