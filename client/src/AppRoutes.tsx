import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { BucketContentComponent } from "./main/component/BucketContentComponent";
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="bucket/:bucketName" element={<BucketContentComponent />} />
      </Routes>
    </BrowserRouter>
  );
};
