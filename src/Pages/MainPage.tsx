import { Link } from "@/Components";
import { Wrapper } from "./Styled";

const MainPage = () => {
  return (
    <Wrapper>
      <h1>MainPage</h1>
      <Link to="/about">About</Link>
    </Wrapper>
  );
};

export default MainPage;
