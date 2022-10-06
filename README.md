# Router 만들어보기

react-router-dom을 설치해서 그냥 사용해봤을 뿐 window.history에 대해서 그다지 깊게 생각해본적이 없다. 프로그래머스 챌린지 할때 SPA를 구현해야하기 때문에 새로고침 없이 페이지를 전환하는데 histroy.pushState를 사용해서 구현했었다. 그때는 이벤트 리스너를 통해서 페이지 전환을 했었다. 비슷하게 하면 될 것 같아서 '생각보다 간단하겠는데?'라고 생각하면서 과제를 시작했다.

## 처음 아이디어

**과제 요구조건**

```ts
ReactDOM.createRoot(container).render(
  <Router>
    <Route path="/" component={<Root />} />
    <Route path="/about" component={<About />} />
  </Router>
);
```

처음 아이디어는 path를 받아서 component를 랜더링하는 Route컴포넌트를 작성하려고 했다. 그래서 코드를 다음과 같이 만들었다.

- **Route.tsx**

```ts
import React, { useEffect } from "react";

interface IRouteProps {
  path: string;
  component: React.ReactElement;
  state?: {};
}

const Route = ({ path, component, state }: IRouteProps) => {
  useEffect(() => window.history.pushState(state, "", path), [path]);
  return component;
};

export default Route;
```

- **Router.tsx**

```ts
import React from "react";

interface IRoutesProps {
  children: React.ReactElement;
}

const Router = ({ children }: IRoutesProps) => {
  return children;
};

export default Router;
```

그리고 어플리케이션의 Router를 만들었다.

```ts
interface IAppRoutersProps {}

const AppRouters = () => {
  return (
    <Router>
      <>
        <Route path="/" component={<Main />} />
        <Route path="/about" component={<About />} />
      </>
    </Router>
  );
};

export default AppRouters;
```

![이미지]()
당연히 안된다.(ㅋㅋㅋㅋㅋㅋㅋㅋㅋ)

### 왜 안될까?

1. AppRouter는 함수니까 위에서 아래로 코드를 읽으면서 Main 컴포넌트를 실행하고 /about으로 pushState를 넣은 다음에 About 컴포넌트를 실행하기 때문에 한 화면에 두 컴포넌트가 동시에 출력된다.
2. useEffect가 실행될 때, Route에 전달된 path를 보고 그냥 history에 밀어 넣기 때문이다.

### 해결하려면?

일단 기본 url은 기본 동작으로 가지고 있어야한다. 최초로 실행시킬 컴포넌트는 '/' 경로에서 그냥 동작하도록 하게 하고 나머지 url에 대해서는 브라우저 주소창에 어떤 url을 입력할 때마다 입력한 경로를 보고 경로에 해당되는 컴포넌트를 실행해야한다.

그래도 아얘 동작이 안되는 것은 아니기 때문에 일단 여기서부터 수정을 해야겠다. 하지만 여전히 감이 오지 않는다. 일단 다른 사람들이 작성한 코드와 문서를 레퍼런스로 삼아야겠다.

## 바닐라 자바스크립트에서 SPA는 어떻게 구현할까?

[프로그래머스 프론트앤드 챌린지](https://prgms.tistory.com/113)에서 SPA를 어떻게 구현했는지 다시 찾아보기로했다.

<iframe href="https://stackblitz.com/edit/js-rjuyzc?embed=1&file=App.js"></iframe>

프로그래머스의 블로그에 적혀있는데로 코드를 구현해보았다. 구현을 하면서 핵심이라고 생각한 부분은 다음과 같다.

1. url이 바뀌었는지 그대로인지 알아야한다.
2. url이 바뀌었다는 것을 감지했다면 해당 컴포넌트를 랜더링 해야한다. 이때 새로고침이 일어나지 않아야한다.

### url이 바뀌었는지는 어떻게 알 수 있을까?

위의 예제 코드를 살펴보면 url의 변경 여부는 window.location.pathname의 변화 여부로 알 수 있다. 참고로 window.location.pathname으로도 url을 변경할 수 있다. 하지만 이렇게 변경을 하면 새로고침이 일어난다.

<iframe href="https://stackblitz.com/edit/js-7wy1gr?embed=1&file=index.js"></iframe>

새로고침이 일어나지 않고 컴포넌트를 변경하기 위해서는 history.pushState를 사용해야한다. pushState는 url을 변경하지만 새로고침은 일어나지 않는다. 그래서 위의 코드는 조건문을 사용하여 pathname을 살펴보고 일치하는 url에 대해서 컴포넌트를 랜더링하는 방식으로 SPA를 구현하고 있다. 지금까지 살펴본 내용을 바탕으로 React 프로젝트에 적용해보기로 했다.

- **lib.ts**

```ts
export function changeRouter(pathname: string) {
  return window.history.pushState(null, "", pathname);
}
```

- **Route.tsx**

```ts
import { changeRouter } from "@/lib/lib";
import React, { useEffect, useState } from "react";

interface IRouteProps {
  path: string;
  component: React.ReactElement;
  state?: {};
}

const Route = ({ path, component, state }: IRouteProps) => {
  const [isPath, setIsPath] = useState(false);

  useEffect(() => {
    const { pathname } = window.location;
    if (path === pathname) {
      setIsPath(true);
      changeRouter(path);
    }
  }, [path]);

  return isPath ? component : null;
};

export default Route;
```

로직은 정말 간단하게 Route만 수정했다. pathname이 path와 일치할 때만 component를 랜더링하도록 로직을 수정하였다. 그러자 라우터에 맞는 컴포넌트만 랜더링한다. Yeah!?

## react-router-dom 깃허브 레포지토리 살펴보기

하지만 아직 갈길이 멀다. 위의 코드는 동작은 하더라도 요구사항과 많이 동떨어져있다.

1. histroy에서 pushState의 맥락을 공유하는 무언가가 없기 때문에 컴포넌트 내부에서 버튼을 눌렀을 때, pushState를 실행시키면 주소창에 url만 변경되고 컴포넌트는 랜더링 되지 않는다.
2. 뒤로 가기, 앞으로 가기가 동작하지 않는다.
3. Router.tsx 컴포넌트가 불필요하다. 그냥 Route만 있어도 라우팅을 동작시킬 수 있다. Router안에 Route를 반드시 쓰도록 강제할 방법도 없다. 하지만 요구 조건은 Router안에 children으로 Route가 들어있어야한다. react-router-dom(v6) 라이브러리를 실제로 사용할 때, 그 사용 조건은 조금 까다롭다.

```tsx
function Router() {
  return (
    <Routes>
      <Route pathname="/" element={<Main />} />
    </Routes>
  );
}

function App() {
  return <Router />;
}

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));
```

위의 규칙을 지키지 않고 Route를 단독으로 사용하려고 시도하거나 BrowserRouter가 App을 감싸고 있지 않는 등의 코드를 작성하면 경고 메시지를 출력하면서 어플리케이션이 동작하지 않는다. 내가 생각했을 때는 **그냥 Route만 있으면 될 것 같은데, 왜 이렇게 동작을 하도록 강제했는지** 잘 모르겠다. 과제의 요구 조건을 만족 시키기 위해서는 몇가지 목적을 가지고 코드를 살펴봐야겠다.

1. BrowserRouter는 어떤 역할인가?
2. 왜 Routes로 Route를 감싸야 하는가?
3. 반드시 Routes안에 Route를 쓰게 하도록 강제하는 방법은 무엇일까?

### BrowserRouter는 어떤 역할을 하는가?

react-router의 깃허브 레포지토리를 살펴보면 [BrowserRouter 함수](https://github.com/remix-run/react-router/blob/main/packages/react-router-dom/index.tsx#L236)를 찾을 수 있다. 결론적으로 말하면 BrowserRouter는 Router 컴포넌트를 반환하고 Router 컴포넌트는 NavigationContext.Provider에 감쌓여있는 LocationContext.Provider를 반환한다.

LocationContext와 NavigationContext는 React Context API다. BrowserRouter로 App 컴포넌트를 감싸으면 어플리케이션 전체 Router 상태를 공유하는 Context API가 생성된다.

Context API는 전역으로 상태를 공유할 수 있게 해준다. 그래서 부모에서 자녀로 Props를 전달하지 않더라도 어느 곳에서든지 바로 Context API에 저장된 상태 값을 사용할 수 있다.

하지만 이렇게 좋다고 생각되는 Context API는 단점을 가지고 있다. Context API의 값이 변경되면 Context Provider 하위에 있는 모든 컴포넌트는 랜더링을 다시 하게 된다. 그래서 Context API는 전역 상태 도구로 잘 사용하지 않는다. 만약 [Context 값을 사용하지 않는 하위 컴포넌트의 랜더링을 막기 위해서는 useMemo를 사용해서 해결한다.](https://yceffort.kr/2022/04/deep-dive-in-react-rendering#%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8context%EC%99%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EB%8F%99%EC%9E%91)

위의 코드를 힌트로 삼아서 Router를 수정하면 다음과 같다. 아직 useMemo를 사용하면 이번 프로젝트에서 어떤 효과를 거둘 수 있는지 명확하게 이해한 상태가 아니기 때문에 이해한 부분까지만 코드를 작성했다.

```ts
import React, { createContext, useState } from "react";

interface LocationContextProps {
  location: {
    pathName: string;
  };
}

const LocationContext = createContext<LocationContextProps>(null!);

interface IRoutesProps {
  children: React.ReactNode;
}

const Router = ({ children }: IRoutesProps) => {
  const [location, setLocation] = useState({ pathName: "/" });
  return <LocationContext.Provider children={children} value={{ location }} />;
};

export default Router;
```

react-router-dom v6와 사용 방법이 다르지만 어쨌든 Router를 사용하면 LocationContext가 생성되면서 location을 전역으로 관리할 수 있게 되었다. 아직은 임시로 Provider의 value를 넣었다. 여기까지 코드를 작성하고 Pages/Main을 작성하려고 하는데 과제 요구 조건 중에 useRouter가 떠올랐다.

### Link 컴포넌트 만들기

react-router-dom에서 Link 컴포넌트는 a 태그의 역할을 하면서도 새로고침이 되지 않는다. 왠지 이 컴포넌트와 useRouter 훅을 함께 사용하면 Link 컴포넌트를 비슷하게 흉내낼 수 있겠다 생각하게 되었다.

- **useRouter**

```ts
export const useRouter = () => {
  function push(to: string) {
    return history.pushState(null, "", to);
  }

  return { push };
};
```

- Link.tsx

```ts
import { useRouter } from "@/lib/hook";
import React from "react";

interface ILinkProps {
  children: React.ReactNode;
  to: string;
}

const Link = ({ children, to }: ILinkProps) => {
  const { push } = useRouter();
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        push(to);
      }}
    >
      {children}
    </a>
  );
};

export default Link;
```

**동작하는 동영상 넣기**

위의 이미지처럼 링크를 클릭하면 주소는 변경되지만 새로고침은 되지 않는다. 그럼 바닐라 자바스크립트에서 했던 것처럼 링크가 변경될 때, 해당되는 컴포넌트를 랜더링 하기만 하면 된다. useRouter 훅과 LocationContext를 연결하면 문제가 해결 될 것 같다. 최종적으로 작성한 코드는 아래와 같다.

- **useRouter**

```ts
import { LocationContext } from "@/Routes/Router";
import { useContext } from "react";

export const useRouter = () => {
  const { setLocation } = useContext(LocationContext);
  function push(to: string) {
    setLocation({ pathName: to });
    return history.pushState(null, "", to);
  }

  return { push };
};
```

- **Route.tsx**

```ts
import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "./Router";

interface IRouteProps {
  path: string;
  component: React.ReactNode;
  state?: {};
}

const Route = ({ path, component, state }: IRouteProps) => {
  const { pathname } = window.location;
  const [isPath, setIsPath] = useState(false);
  const { setLocation } = useContext(LocationContext);

  const route = (pathname: string) => {
    if (path === pathname) {
      setIsPath(true);
    } else {
      setIsPath(false);
    }

    window.onpopstate = () => {
      setLocation({ pathName: pathname });
    };
  };

  useEffect(() => {
    route(pathname);
  }, [pathname]);

  return isPath ? component : null;
};

export default Route;
```

### 왜 Routes로 Route를 감싸야하는가?

### 반드시 Routes안에 Route를 쓰게 하도록 강제하는 방법은 무엇일까?

## 마무리

바닐라 자바스크립트로 SPA를 구현하는 것은 상반기 기업 과제에서도 진행한적이 있었고, 프로그래머스 프론트앤드 챌린지 과제로도 구현한 적이 있었다. 그런데 왜 계속 할 때마다 잘 모를까? 좀 현타가 온다.
