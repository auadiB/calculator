import { Reducer, useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './index.css'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
      if(state.overwrite) {
        return{
          ...state,
          currentOutput: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.currentOutput === '0') {
        return state
      }
      if( payload.digit === '.' && state.currentOutput.includes('.')) {
        return state
      }
      return {
        ...state,
        currentOutput: `${state.currentOutput || ''}${payload.digit}`
      }

      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentOutput == null && state.previousOutput == null) {
          return state
        }
        if(state.currentOutput == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        if(state.previousOutput == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOutput: state.currentOutput,
            currentOutput: null
          }
        }
        return {
          ...state,
          previousOutput: evaluate(state),
          operation: payload.operation,
          currentOutput: null
        }
    
      case ACTIONS.CLEAR: 
        return {}

      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOutput: null
          }
        }
        if(state.currentOutput == null) {
          return state
        }
        if(state.currentOutput.length === 1) {
          return {
            ...state,
            currentOutput: null
          }
        }
        return {
          ...state,
          currentOutput: state.currentOutput.slice(0, -1)
        }

      case ACTIONS.EVALUATE:
        if(
          state.operation == null || 
          state.currentOutput == null || 
          state.previousOutput == null
          ) {
            return state
          }

      return {
        ...state,
        overwrite: true,
        previousOutput: null,
        operation: null,
        currentOutput: evaluate(state)
      }
  }
}

function evaluate({currentOutput, previousOutput, operation}) {
  const prev = parseFloat(previousOutput)
  const current = parseFloat(currentOutput)
  if(isNaN(prev) || isNaN(current)) {
    return ''
  }
  let computation = ''
  switch(operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break 
    case '/':
      computation = prev / current
      break
  }
  return computation.toString()
}

function App() {
  const [{currentOutput, previousOutput, operation}, dispatch] = useReducer(reducer, {})


  return (
    <div className="calculator">
      <div className="output">
        <div className="previous-output">{previousOutput} {operation}</div>
        <div className="current-output">{currentOutput}</div>
      </div>
      <button className="all-clear" 
        onClick={() => dispatch({type: ACTIONS.CLEAR})}
        >
          AC
        </button>
      <button className='delete' onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}><span>X</span></button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button 
        className="equal operation"
        onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;
