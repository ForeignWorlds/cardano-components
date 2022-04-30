/// <reference path="../node_modules/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.d.ts"/>
class Loader {
  _wasm = null;

  async load() {
    if (this._wasm) return;
    /**
     * @private
     */
    this._wasm = await import(
      "@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib"
    );
  }

  get Cardano() {
    return this._wasm;
  }
}

export default new Loader();
