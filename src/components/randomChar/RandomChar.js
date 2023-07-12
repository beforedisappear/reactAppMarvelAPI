import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";
import Service from "../../services/service";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { Component } from "react";

class RandomChar extends Component {
  constructor(props) {
    super(props);
  }

  // пустой объект char эквивалентен записи в null
  state = {
    char: {},
    loading: true,
    error: false,
  };

  // state = {
  //   name: null,
  //   description: null,
  //   preview: null,
  //   homepage: null,
  //   wiki: null,
  // };

  marvelService = new Service();

  // первичный запрос для построения компонента
  componentDidMount() {
    this.updateChar();
    //this.timedId = setInterval(this.updateChar, 10000);
  }

  // остановка интервал при ~ вызове деструктора объекта
  componentWillUnmount() {
    //clearInterval(this.timedId);
  }

  // dry метод для оптимизации записи персонажа в стейт
  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  //метод для try it
  onCharLoading = () => {
    this.setState({
      loading: true,
    });
  };

  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.onCharLoading();
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError); // вызов метода для обработки ошибки
  };

  // обработка ошибки
  onError = async () => {
    this.setState({ loading: false, error: true });
  };

  render() {
    const { char, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    // нет загрузки или нет ошибки -> View, иначе -> null
    const content = !(loading || error) ? <View char={char} /> : null;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button className="button button__main" onClick={this.updateChar}>
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

// простой рендерящий компонент
const View = ({ char }) => {
  const { name, description, preview, homepage, wiki } = char;

  return (
    <div className="randomchar__block">
      <img src={preview} alt="Marvel character" className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
