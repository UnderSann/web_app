// src/store/ErrorStore.js
import { makeAutoObservable } from "mobx";

class ErrorStore {
  _errorCode = null;
  _errorMessage = null;

  _errorLight = null;

  constructor() {
    makeAutoObservable(this);
  }

  setErrorCode(code) {
    this._errorCode = code;
  }

  setErrorMessage(message) {
    this._errorMessage = message;
  }
  
  setErrorLight(code) {
    this._errorLight = code;
  }

  clearError() {
    this._errorCode = null;
    this._errorMessage = null;
  }
  get errorCode() {
    return this._errorCode;
  }
  get errorMessage() {
    return this._errorMessage;
  }

  get errorLight() {
    return this._errorLight;
  }
  
  clearErrorLight() {
    this._errorLight = null;
    this._errorCode = null;
  }
  
}

export default new ErrorStore();
