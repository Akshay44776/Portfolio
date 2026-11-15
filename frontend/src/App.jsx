import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Registry from "./pages/Registry";
import Pipeline from "./pages/Pipeline";
import Status from "./pages/Status";
import Architecture from "./pages/Architecture";
import Chaos from "./pages/Chaos";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="registry" element={<Registry />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="status" element={<Status />} />
              <Route path="architecture" element={<Architecture />} />
              <Route path="chaos" element={<Chaos />} />
              <Route path="resume" element={<Resume />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
