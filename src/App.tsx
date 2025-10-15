import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VoicePractice from "./pages/VoicePractice";
import Assessment from "./pages/Assessment";
import Lessons from "./pages/Lessons";
import Progress from "./pages/Progress";
import Vocabulary from "./pages/Vocabulary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/voice-practice" element={<VoicePractice />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
