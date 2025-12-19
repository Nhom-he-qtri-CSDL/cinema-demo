import axiosClient from "./axiosClient";

const movieApi = {
  getMovies: () => {
    return axiosClient.get("/movies");
  },

  getShows: (movieId) => {
    if (movieId) {
      return axiosClient.get("/shows", {
        params: {
          movie_id: movieId,
        },
      });
    }
    return axiosClient.get("/shows");
  },

  getSeats: (showId) => {
    if (!showId) {
      return Promise.reject(new Error("showId is required"));
    }
    return axiosClient.get("/seats", {
      params: {
        show_id: showId,
      },
    });
  },
};

export default movieApi;
