import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";
import { Outlet, useOutlet } from "react-router-dom";

const ComicsPage = () => {
  const outLet = useOutlet();
  const content = outLet ? <Outlet /> : <ComicsList />;
  return (
    <>
      <AppBanner />
      {content}
    </>
  );
};

export default ComicsPage;