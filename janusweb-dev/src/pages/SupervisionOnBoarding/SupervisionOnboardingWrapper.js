import { OnboardingProvider } from "context/OnboardingContext";
import SuperVisionOnboardingPage from "./SuperVisionOnboardingPage";

export const SupervisionOnboardingWrapper = () => {
  return (
    <OnboardingProvider>
      <SuperVisionOnboardingPage />
    </OnboardingProvider>
  );
};
