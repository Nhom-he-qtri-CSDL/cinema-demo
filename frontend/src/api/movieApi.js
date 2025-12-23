import axiosClient from "./axiosClient";

const movieApi = {
  getMovies: () => {
    return axiosClient.get("/movies");
  },
};

export default movieApi;
