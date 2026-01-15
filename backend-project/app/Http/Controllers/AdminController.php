<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * AdminController
 * Gestiona la zona de administración con vistas Blade
 * 
 * Requisito: Admin panel con Blade views que permite:
 * - Ver lista de usuarios
 * - Editar datos de usuarios
 * - Cambiar roles
 * - Activar/desactivar cuentas
 * - Eliminar usuarios
 */
class AdminController extends Controller
{
    /**
     * Dashboard administrativo
     */
    public function dashboard()
    {
        $totalUsers = User::count();
        $adminUsers = User::where('role', 'admin')->count();
        $userUsers = User::where('role', 'user')->count();
        $activeUsers = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();

        return view('admin.dashboard', [
            'totalUsers' => $totalUsers,
            'adminUsers' => $adminUsers,
            'userUsers' => $userUsers,
            'activeUsers' => $activeUsers,
            'inactiveUsers' => $inactiveUsers,
        ]);
    }

    /**
     * Listar todos los usuarios
     */
    public function listUsers(Request $request)
    {
        $query = User::query();

        // Filtrar por rol
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Filtrar por estado activo
        if ($request->has('active') && $request->active !== '') {
            $query->where('is_active', (bool)$request->active);
        }

        // Buscar por nombre o email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Ordenar
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(15);

        return view('admin.users.index', [
            'users' => $users,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Ver detalles de un usuario
     */
    public function showUser(User $user)
    {
        return view('admin.users.show', [
            'user' => $user,
        ]);
    }

    /**
     * Actualizar usuario
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|min:6',
            'language' => 'sometimes|string|max:10',
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('message', 'Usuario actualizado correctamente');
    }

    /**
     * Cambiar rol de usuario
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        // Proteger el último admin
        if ($user->role === 'admin' && $validated['role'] === 'user') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return back()->with('error', 'No puedes degradar al último admin');
            }
        }

        $user->update($validated);

        return back()->with('message', 'Rol actualizado correctamente');
    }

    /**
     * Activar/Desactivar usuario
     */
    public function toggleActive(Request $request, User $user)
    {
        // Proteger al último admin activo
        if ($user->role === 'admin' && $user->is_active) {
            $activeAdmins = User::where('role', 'admin')
                                ->where('is_active', true)
                                ->count();
            if ($activeAdmins <= 1) {
                return back()->with('error', 'No puedes desactivar al último admin activo');
            }
        }

        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $status = $user->is_active ? 'activado' : 'desactivado';
        return back()->with('message', "Usuario {$status} correctamente");
    }

    /**
     * Eliminar usuario
     */
    public function deleteUser(User $user)
    {
        // Proteger al último admin
        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return back()->with('error', 'No puedes eliminar al último admin');
            }
        }

        $user->delete();

        return back()->with('message', 'Usuario eliminado correctamente');
    }
}
