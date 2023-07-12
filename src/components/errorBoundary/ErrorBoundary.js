import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
   state = {
      error: false,
   }

   // отлавливание ошибки
   componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
      this.setState({
         error: true,
      })
   }

   render() {
      // если есть ошибка
      if (this.state.error) {
         return <ErrorMessage/>
      }
      // если ошибки нет, то передаем компонент, 
      // переданный во внутрь данного компонента
      return this.props.children
   }
}

export default ErrorBoundary;