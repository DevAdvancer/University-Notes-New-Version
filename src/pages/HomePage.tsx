import { useNavigate } from "react-router-dom";
import WelcomePage from "@/components/welcome/WelcomePage";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginRequired = () => {
    navigate('/auth');
  };

  const handleExploreFeatures = () => {
    navigate('/explore');
  };

  const handleAboutPage = () => {
    navigate('/about');
  };

  return (
    <WelcomePage
      onLoginRequired={handleLoginRequired}
      onExploreFeatures={handleExploreFeatures}
      onAboutPage={handleAboutPage}
    />
  );
};

export default HomePage;
