import axiosClient from "./axiosClient";

const showApi = {
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
};

export default showApi;
