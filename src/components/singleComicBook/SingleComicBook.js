import { useParams, Link } from "react-router-dom";
import useService from "../../services/service";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import { useState, useEffect } from "react";

import "./singleComicBook.scss";

const SingleComicBook = () => {
  const { comicBookId } = useParams(0);
  const [comic, setComic] = useState(null);

  const { loading, error, getComicBook, clearError } = useService();

  useEffect(() => {
    updateComic();
  }, [comicBookId]);

  // метода для обновления компонента
  const updateComic = () => {
    clearError();
    getComicBook(comicBookId).then(onComicLoaded);
  };

  const onComicLoaded = (comic) => {
    setComic(comic);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ comic }) => {
  const { title, description, pageCount, preview, language, price } = comic;

  return (
    <div className="single-comic">
      <img src={preview} alt={title} className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description}</p>
        <p className="single-comic__descr">{pageCount}</p>
        <p className="single-comic__descr">Language: {language}</p>
        <div className="single-comic__price">{price}</div>
      </div>
      <Link to="/comics" className="single-comic__back">
        Back to all
      </Link>
    </div>
  );
};
export default SingleComicBook;
