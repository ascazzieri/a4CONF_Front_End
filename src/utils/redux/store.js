import { configureStore } from "@reduxjs/toolkit";
import { config } from "./reducers";

const store = configureStore({
  reducer: config,
});

export default store;
