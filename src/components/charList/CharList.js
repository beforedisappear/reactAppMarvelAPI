import { useState, useEffect, useRef } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useService from "../../services/service";
import "./charList.scss";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(true);
  const [offset, setOffset] = useState(210);
  const [isEnd, setIsEnd] = useState(false);
  // custom hook, states : loading and error
  const { loading, error, getAllCharacters } = useService();

  const handlerSignal = useRef(false);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    handlerSignal.current = error;
  }, [error]);

  useEffect(() => {
    if (newItemsLoading && !isEnd) {
      onRequest();
    }
  }, [newItemsLoading]);

  const onScroll = (event) => {
    let curHeight = window.scrollY + document.documentElement.clientHeight;
    let pageHeight = document.documentElement.offsetHeight - 200;
    if (curHeight > pageHeight && !handlerSignal.current) {
      setNewItemsLoading(true);
    }
  };

  const onRequest = () => {
    getAllCharacters(offset)
      .then(onCharactersLoaded)
      .finally(() => setNewItemsLoading(false));
  };

  const onCharactersLoaded = (newCharList) => {
    setCharList((charList) => [...charList, ...newCharList]);
    setOffset((offset) => offset + 9);
    setIsEnd(newCharList.length < 9 ? true : false);
  };

  // Этот метод создан для оптимизации,
  // чтобы не помещать такую конструкцию в метод render
  function renderItems(arr) {
    const items = arr.map((item) => {
      const active = props.selectedId === item.id;
      const clazz = active ? "char__item char__item_selected" : "char__item";
      let imgStyle = { objectFit: "cover" };
      if (
        item.preview ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }
      return (
        <li
          tabIndex={0}
          onFocus={() => props.onCharSelected(item.id)}
          className={clazz}
          key={item.id}
        >
          <img src={item.preview} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return <ul className="char__grid">{items}</ul>;
  }

  const items = renderItems(charList);
  const errorMessage = error ? <ErrorMessage /> : null;
  // первичная для первичной загрузки
  const spinner = loading && offset === 210 ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
    </div>
  );
};

export default CharList;

// const CharList = (props) => {
//   const [charList, setCharList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newItemsLoading, setNewItemsLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [offset, setOffset] = useState(210);
//   const [isEnd, setIsEnd] = useState(false);

//   const marvelService = new Service();

//   useEffect(() => {
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     if (newItemsLoading && !isEnd) {
//       onRequest();
//     }
//   }, [newItemsLoading]);

//   const onScroll = (event) => {
//     let curHeight = window.scrollY + document.documentElement.clientHeight;
//     let pageHeight = document.documentElement.offsetHeight - 200;
//     if (curHeight > pageHeight) {
//       setNewItemsLoading(true);
//     }
//   };

//   const onRequest = () => {
//     marvelService
//       .getAllCharacters(offset)
//       .then(onCharactersLoaded)
//       .catch(onError)
//       .finally(() => setNewItemsLoading(false));
//   };

//   const onCharactersLoaded = (newCharList) => {
//     setCharList((charList) => [...charList, ...newCharList]);
//     setLoading(false);
//     setError(false);
//     setOffset((offset) => offset + 9);
//     setIsEnd(newCharList.length < 9 ? true : false);
//   };

//   const onError = () => {
//     setError(false);
//     setLoading(false);
//   };

//   // Этот метод создан для оптимизации,
//   // чтобы не помещать такую конструкцию в метод render
//   function renderItems(arr) {
//     const items = arr.map((item) => {
//       const active = props.selectedId === item.id;
//       const clazz = active ? "char__item char__item_selected" : "char__item";
//       let imgStyle = { objectFit: "cover" };
//       if (
//         item.preview ===
//         "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
//       ) {
//         imgStyle = { objectFit: "unset" };
//       }
//       return (
//         <li
//           tabIndex={0}
//           onFocus={() => props.onCharSelected(item.id)}
//           className={clazz}
//           key={item.id}
//         >
//           <img src={item.preview} alt={item.name} style={imgStyle} />
//           <div className="char__name">{item.name}</div>
//         </li>
//       );
//     });
//     // А эта конструкция вынесена для центровки спиннера/ошибки
//     return <ul className="char__grid">{items}</ul>;
//   }

//   const items = renderItems(charList);
//   const errorMessage = error ? <ErrorMessage /> : null;
//   const spinner = loading ? <Spinner /> : null;
//   const content = !(loading || error) ? items : null;

//   return (
//     <div className="char__list">
//       {errorMessage}
//       {spinner}
//       {content}
//     </div>
//   );
// };

// export default CharList;

// class CharList extends Component {
//   state = {
//     charList: [],
//     loading: true,
//     error: false,
//     newCharlistLoading: false,
//     charsEnded: false,
//     pageEnd: false,
//     offset: 210,
//   };

//   marvelService = new Service();

//   // назначение событий
//   componentDidMount() {
//     this.loadingCharList();
//     window.addEventListener("scroll", this.checkPageEnd);
//     window.addEventListener("scrollend", this.updatingCharListByScroll);
//   }

//   componentWillUnmount() {
//     window.removeEventListener("scroll", this.checkPageEnd);
//     window.removeEventListener("scrollend", this.updatingCharListByScroll);
//   }

//   // отслеживание скрола до конца страницы / изменение state
//   checkPageEnd = () => {
//     let curHeight = window.scrollY + document.documentElement.clientHeight;
//     let pageHeight = document.documentElement.offsetHeight - 3;
//     if (curHeight > pageHeight) {
//       this.setState((state) => ({
//         pageEnd: true,
//       }));
//     }
//   };

//   // вызов обновления CharList
//   updatingCharListByScroll = () => {
//     const { pageEnd, charsEnded, newCharlistLoading } = this.state;
//     if (pageEnd && !newCharlistLoading && !charsEnded) {
//       this.loadingCharList(this.state.offset);
//     }
//   };

//   // загрузка CharList (отправлене запроса на сервер)
//   loadingCharList = (offset) => {
//     this.setState({ newCharlistLoading: true });

//     this.marvelService
//       .getAllCharacters(offset)
//       .then(this.onCharListLoaded)
//       .catch(this.onError);
//   };

//   // CharList загружен, обновление state -> отображение
//   onCharListLoaded = (newCharList) => {
//     this.setState(({ offset, charList }) => ({
//       charList: [...charList, ...newCharList],
//       loading: false,
//       newCharlistLoading: false,
//       charsEnded: newCharList.length < 9,
//       pageEnd: false,
//       offset: offset + 9,
//     }));
//   };

//   onError = () => {
//     this.setState({
//       error: true,
//       loading: false,
//     });
//   };

//   // Этот метод создан для оптимизации,
//   // чтобы не помещать такую конструкцию в метод render
//   renderItems(arr) {
//     const items = arr.map((item) => {
//       const active = this.props.selectedId === item.id;
//       const clazz = active ? "char__item char__item_selected" : "char__item";
//       let imgStyle = { objectFit: "cover" };
//       if (
//         item.preview ===
//         "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
//       ) {
//         imgStyle = { objectFit: "unset" };
//       }
//       return (
//         <li
//           tabIndex={0}
//           onFocus={() => this.props.onCharSelected(item.id)}
//           className={clazz}
//           key={item.id}
//         >
//           <img src={item.preview} alt={item.name} style={imgStyle} />
//           <div className="char__name">{item.name}</div>
//         </li>
//       );
//     });
//     // А эта конструкция вынесена для центровки спиннера/ошибки
//     return <ul className="char__grid">{items}</ul>;
//   }

//   render() {
//     const { charList, loading, error, offset, pageEnd } = this.state;
//     const items = this.renderItems(charList);

//     const errorMessage = error ? <ErrorMessage /> : null;
//     const spinner = loading ? <Spinner /> : null;
//     const content = !(loading || error) ? items : null;

//     return (
//       <div className="char__list">
//         {errorMessage}
//         {spinner}
//         {content}
//         <button className="button button__main button__long">
//           <div className="inner">load more</div>
//         </button>
//       </div>
//     );
//   }
// }

// export default CharList;

// const CharList = (props) => {
//   const [charList, setCharList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [newCharlistLoading, setNewCharlistLoading] = useState(true);
//   const [charsEnded, setCharsEnded] = useState(false);
//   const [pageEnd, setPageEnd] = useState(false);
//   const [offset, setOffset] = useState(210);

//   const marvelService = new Service();

//   useEffect(() => {
//     window.addEventListener("scroll", checkPageEnd);
//     return () => window.removeEventListener("scroll", checkPageEnd);
//   }, []);

//   useEffect(() => {
//     loadingCharList();
//   }, []);

//   useEffect(() => {
//     updatingCharListByScroll();
//   }, [pageEnd]);

//   // загрузка CharList (отправлене запроса на сервер)
//   const loadingCharList = (offset) => {
//     setNewCharlistLoading(true);
//     marvelService
//       .getAllCharacters(offset)
//       .then(onCharListLoaded)
//       .catch(onError);
//   };

//   // CharList загружен, обновление state -> отображение
//   const onCharListLoaded = (newCharList) => {
//     setCharList((charList) => [...charList, ...newCharList]);
//     setLoading(false);
//     setNewCharlistLoading(false);
//     setOffset((offset) => offset + 9);
//     setPageEnd(false);
//     setCharsEnded(newCharList.length < 9 ? true : false);
//   };

//   const onError = () => {
//     setError(false);
//     setLoading(false);
//   };

//   // обработчик | отслеживание скрола до конца страницы / изменение state
//   const checkPageEnd = (event) => {
//     let curHeight = window.scrollY + document.documentElement.clientHeight;
//     let pageHeight = document.documentElement.offsetHeight - 3;
//     if (curHeight > pageHeight) {
//       setPageEnd((pageEnd) => !pageEnd);
//     }
//   };

//   // вызов обновления CharList
//   const updatingCharListByScroll = () => {
//     if (pageEnd && !newCharlistLoading && !charsEnded) {
//       loadingCharList(offset);
//     }
//   };

//   // Этот метод создан для оптимизации,
//   // чтобы не помещать такую конструкцию в метод render
//   function renderItems(arr) {
//     const items = arr.map((item) => {
//       const active = props.selectedId === item.id;
//       const clazz = active ? "char__item char__item_selected" : "char__item";
//       let imgStyle = { objectFit: "cover" };
//       if (
//         item.preview ===
//         "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
//       ) {
//         imgStyle = { objectFit: "unset" };
//       }
//       return (
//         <li
//           tabIndex={0}
//           onFocus={() => props.onCharSelected(item.id)}
//           className={clazz}
//           key={item.id}
//         >
//           <img src={item.preview} alt={item.name} style={imgStyle} />
//           <div className="char__name">{item.name}</div>
//         </li>
//       );
//     });
//     // А эта конструкция вынесена для центровки спиннера/ошибки
//     return <ul className="char__grid">{items}</ul>;
//   }

//   const items = renderItems(charList);
//   const errorMessage = error ? <ErrorMessage /> : null;
//   const spinner = loading ? <Spinner /> : null;
//   const content = !(loading || error) ? items : null;

//   return (
//     <div className="char__list">
//       {errorMessage}
//       {spinner}
//       {content}
//       <button className="button button__main button__long">
//         <div className="inner">load more</div>
//       </button>
//     </div>
//   );
// };

// export default CharList;
