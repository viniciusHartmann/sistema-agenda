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
     * GET /api/contatos
     * Lista todos os contatos da sessão.
     */
    public function index(): JsonResponse
    {
        $contatos = Contato::where('session_id', $this->sessionId())->get();

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
