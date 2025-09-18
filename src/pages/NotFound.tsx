import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button onClick={() => navigate("/")}>Go to search</Button>
    </div>
  );
}
