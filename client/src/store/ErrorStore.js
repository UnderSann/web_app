// src/store/ErrorStore.js
import { makeAutoObservable } from "mobx";

class ErrorStore {
  _errorCode = null;
  _errorMessage = null;

  constructor() {
    makeAutoObservable(this);
  }

  setErrorCode(code) {
    this._errorCode = code;
  }

  setErrorMessage(message) {
    this._errorMessage = message;
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
}

export default new ErrorStore();
