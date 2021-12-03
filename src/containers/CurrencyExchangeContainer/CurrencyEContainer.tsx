import React from "react";
import CurrencyExchange from "../../components/CurrencyExchange/CurrencyExchange";
import { CurrencyState, CurrencyType } from "../../redux/currencyReducer";
import { Dispatch } from "redux";
import {
  ChangeActionAC,
  ChangeCurrencyFieldAC,
  ChangeCurrentCurrencyAC,
  CurrencyReducersTypes,
} from "../../redux/actions";
import { connect, ConnectedProps } from "react-redux";

const CurrencyEContainer: React.FC<TProps> = (props) => {
  const {
    currencies,
    currentCurrency,
    isBuying,
    amountOfBYN,
    amountOfCurrency,
    setCurrencyAmount,
    setAction,
    changeCurrency,
  } = props;

  let currencyRate: number = 0;
  const currenciesName = currencies.map((currency: CurrencyType) => {
    if (currency.currencyName === currentCurrency) {
      currencyRate = isBuying ? currency.buyRate : currency.sellRate;
    }
    return currency.currencyName;
  });

  const changeCurrencyField = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    // +value преобразовывает значение к числу и если это у него не получится т.к. пользователь
    // ввёл буквы, он вернёт NaN и мы проверяем это !isFinite-ом.
    // эта строчка делает проверку и возвращает только цифры
    if (!isFinite(+value)) return;
    //dataset - объект дата-атрибутов на элементе, currency - ключ этого объекта
    if (e.currentTarget.dataset.currency) {
      const trigger: string = e.currentTarget.dataset.currency;
      if (trigger === "byn") {
        if (value === "") {
          setCurrencyAmount(value, value);
        } else {
          setCurrencyAmount(
            value,
            //Number(value) - явным образом приводим value к числовому виду
            //Number(value) - здесь у нас может быть дробное число
            //и нам нужно только 2 знака после запятой --> toFixed(2) но toFixed(2) возвращает строку
            //а дальше нам эту строку надо делить на число (currencyRate) поэтому используем ещё и +
            //в самом начале т.к. у него самый низкий приоритет и он применится только в конце.
            // т.к. в результате деления у нас может образоваться большая дробная часть,
            // применяем снова toFixed(2)
            (+Number(value).toFixed(2) / currencyRate).toFixed(2)
          );
        }
      } else {
        if (value === "") {
          setCurrencyAmount(value, value);
        } else {
          setCurrencyAmount(
            (+Number(value).toFixed(2) * currencyRate).toFixed(2),
            value
          );
        }
      }
    }
  };
  const changeAction = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.dataset.action === "buy"
      ? setAction(true)
      : setAction(false);
  };

  const changeCurrentCurrency = (e: React.MouseEvent<HTMLLIElement>) => {
    e.currentTarget.dataset.currency &&
      changeCurrency(e.currentTarget.dataset.currency);
  };

  return (
    <React.Fragment>
      <CurrencyExchange
        currenciesName={currenciesName}
        currentCurrency={currentCurrency}
        currencyRate={currencyRate}
        isBuying={isBuying}
        amountOfBYN={amountOfBYN}
        amountOfCurrency={amountOfCurrency}
        changeCurrencyField={changeCurrencyField}
        changeAction={changeAction}
        changeCurrentCurrency={changeCurrentCurrency}
      />
    </React.Fragment>
  );
};

//типизация деструктуризации пропсовЖ
// из общего глобального стейта забираем значение которое нам нужно (currency) и типизируем его сразу
const mapStateToProps = ({
  currency,
}: {
  currency: CurrencyState;
}): CurrencyState => {
  return {
    currencies: currency.currencies,
    currentCurrency: currency.currentCurrency,
    isBuying: currency.isBuying,
    amountOfBYN: currency.amountOfBYN,
    amountOfCurrency: currency.amountOfCurrency,
  };
};

// @ts-ignore
const mapDispatchToProps = (dispatch: Dispatch<CurrencyReducersTypes>): any => {
  return {
    setCurrencyAmount(amountOfBYN: string, amountOfCurrency: string) {
      dispatch(ChangeCurrencyFieldAC(amountOfBYN, amountOfCurrency));
    },
    setAction(isBuying: boolean) {
      dispatch(ChangeActionAC(isBuying));
    },
    changeCurrency(currency: string) {
      dispatch(ChangeCurrentCurrencyAC(currency));
    },
  };
};

// @ts-ignore
const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(CurrencyEContainer);
