import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
  height: 100vh;
  h1 {
    color: #fff;
    margin-bottom: 2rem;
  }
  a {
    cursor: pointer;
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    color: #fff;
    background-color: #141414;
    &:hover {
      background-color: #fff;
      color: #141414;
    }
  }
`;
