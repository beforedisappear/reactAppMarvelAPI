import Service from "../../services/service";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import { useState, useEffect } from "react";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const marvelService = new Service();

  useEffect(() => {
    updateChar();
  }, []);

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  // метода для обновления компонента
  const updateChar = () => {
    const { charId } = props;
    if (!charId) return;

    setLoading(() => true);
    marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);
  };

  const onCharLoaded = (char) => {
    setLoading(false);
    setChar(() => char);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  //начальное состояние (не загружен персонаж / не загрузка)
  const skeleton = char || loading || error ? null : <Skeleton />;
  //состояние если ошибка
  const errorMessage = error ? <ErrorMessage /> : null;
  //состояние загрузки
  const spinner = loading ? <Spinner /> : null;
  //отображение контента
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, preview, homepage, wiki, comics } = char;

  let imgStyle = { objectFit: "cover" };
  if (
    preview ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = { objectFit: "contain" };
  }

  return (
    <>
      <div className="char__basics">
        <img src={preview} alt={name} style={imgStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comics with this character"}
        {comics.map((item, i) => {
          // eslint-disable-next-line
          if (i > 9) return;
          return (
            <li key={i} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CharInfo;

//import { Component } from "react";

//
// class CharInfo extends Component {
//   state = {
//     char: null,
//     loading: false,
//     error: false,
//   };

//   marvelService = new Service();

//   // первичный запрос для построения компонента
//   componentDidMount() {
//     this.updateChar();
//   }

//   componentDidUpdate(prevProps) {
//     if (this.props.charId !== prevProps.charId) {
//       this.updateChar();
//     }
//   }

//   // метода для обновления компонента
//   updateChar = () => {
//     const { charId } = this.props;
//     if (!charId) {
//       return;
//     }

//     this.onCharLoading();

//     this.marvelService
//       .getCharacter(charId)
//       .then(this.onCharLoaded)
//       .catch(this.onError);
//   };

//   onCharLoaded = (char) => {
//     this.setState({
//       char,
//       loading: false,
//     });
//   };

//   onCharLoading = () => {
//     this.setState({
//       loading: true,
//     });
//   };

//   onError = () => {
//     this.setState({
//       loading: false,
//       error: true,
//     });
//   };

//   render() {
//     const { char, loading, error } = this.state;

//     //начальное состояние (не загружен персонаж / не загрузка)
//     const skeleton = char || loading || error ? null : <Skeleton />;
//     //состояние если ошибка
//     const errorMessage = error ? <ErrorMessage /> : null;
//     //состояние загрузки
//     const spinner = loading ? <Spinner /> : null;
//     //отображение контента
//     const content = !(loading || error || !char) ? <View char={char} /> : null;

//     return (
//       <div className="char__info">
//         {skeleton}
//         {errorMessage}
//         {spinner}
//         {content}
//       </div>
//     );
//   }
// }

// const View = ({ char }) => {
//   const { name, description, preview, homepage, wiki, comics } = char;

//   let imgStyle = { objectFit: "cover" };
//   if (
//     preview ===
//     "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
//   ) {
//     imgStyle = { objectFit: "contain" };
//   }

//   return (
//     <>
//       <div className="char__basics">
//         <img src={preview} alt={name} style={imgStyle} />
//         <div>
//           <div className="char__info-name">{name}</div>
//           <div className="char__btns">
//             <a href={homepage} className="button button__main">
//               <div className="inner">homepage</div>
//             </a>
//             <a href={wiki} className="button button__secondary">
//               <div className="inner">Wiki</div>
//             </a>
//           </div>
//         </div>
//       </div>
//       <div className="char__descr">{description}</div>
//       <div className="char__comics">Comics:</div>
//       <ul className="char__comics-list">

//         {comics.length > 0 ? null : "There is no comics with this character"}
//         {comics.map((item, i) => {
//           // eslint-disable-next-line
//           if (i > 9) return;
//           return (
//             <li key={i} className="char__comics-item">
//               {item.name}
//             </li>
//           );
//         })}
//       </ul>
//     </>
//   );
// };

// export default CharInfo;
