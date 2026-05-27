<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contato extends Model
{
    protected $fillable = [
        'session_id',
        'nome',
        'email',
        'telefone',
        'endereco',
    ];

    // Oculta o session_id nas respostas JSON enviadas ao frontend
    protected $hidden = ['session_id'];
}
