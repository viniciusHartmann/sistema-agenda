<?php

namespace App\Http\Controllers;

use App\Models\Contato;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContatoController extends Controller
{
    /**
     * Retorna contatos da sessão atual.
     */
    private function sessionId(): string
    {
        return session()->getId();
    }

    /**
     * GET /api/contatos?pagina=1&por_pagina=5
     * Lista os contatos da sessão com paginação.
     */
    public function index(Request $request): JsonResponse
    {
        //Exibe 3 tipos de paginação para que o usuário escolha.
        $porPagina = in_array((int) $request->query('por_pagina'), [5, 10, 15])
            ? (int) $request->query('por_pagina')
            : 5;

        $pagina = max(1, (int) $request->query('pagina', 1));

        $contatos = Contato::where('session_id', $this->sessionId())
            ->paginate($porPagina, ['*'], 'page', $pagina);

        return response()->json($contatos);
    }

    /**
     * POST /api/contatos
     * Cria um novo contato para a sessão.
     */
    public function store(Request $request): JsonResponse
    {
        $dados = $request->validate([
            'nome'     => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'telefone' => 'required|string|max:20',
            'endereco' => 'required|string|max:255',
        ]);

        $contato = Contato::create([
            ...$dados,
            'session_id' => $this->sessionId(),
        ]);

        return response()->json($contato, 201);
    }

    /**
     * PUT /api/contatos/{id}
     * Atualiza um contato da sessão.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $contato = Contato::where('session_id', $this->sessionId())
            ->findOrFail($id);

        $dados = $request->validate([
            'nome'     => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'telefone' => 'required|string|max:20',
            'endereco' => 'required|string|max:255',
        ]);

        $contato->update($dados);

        return response()->json($contato);
    }

    /**
     * DELETE /api/contatos/{id}
     * Remove um contato da sessão.
     */
    public function destroy(int $id): JsonResponse
    {
        $contato = Contato::where('session_id', $this->sessionId())
            ->findOrFail($id);

        $contato->delete();

        return response()->json(null, 204);
    }
}
