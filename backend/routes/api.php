<?php

use App\Http\Controllers\ContatoController;
use Illuminate\Support\Facades\Route;

Route::prefix('contatos')->group(function () {
    Route::get('/',        [ContatoController::class, 'index']);
    Route::post('/',       [ContatoController::class, 'store']);
    Route::put('/{id}',    [ContatoController::class, 'update']);
    Route::delete('/{id}', [ContatoController::class, 'destroy']);
});
