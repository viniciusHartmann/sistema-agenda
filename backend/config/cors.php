<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    | Permite que o frontend Vue.js (localhost:5173) acesse a API do backend.
    | 'supports_credentials' deve ser true para que os cookies de sessão
    | (que identificam cada usuário) sejam enviados e aceitos.
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost',       // Frontend via Docker (nginx porta 80)
        'http://localhost:80',    // Frontend via Docker (nginx)
    ],

    // Aceita qualquer porta do localhost (Vite pode usar 5173, 5174, 5175...)
    'allowed_origins_patterns' => [
        '#^http://localhost:\d+$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Obrigatório para que os cookies de sessão funcionem entre origens diferentes
    'supports_credentials' => true,

];
