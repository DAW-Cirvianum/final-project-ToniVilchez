@extends('admin.layouts.app')

@section('title', 'Usuarios - Admin Panel')

@section('content')
<div class="admin-users">
    <div class="page-header">
        <h1>👥 Gestión de Usuarios</h1>
    </div>

    @if ($message = Session::get('message'))
        <div class="alert alert-success">
            {{ $message }}
        </div>
    @endif

    @if ($message = Session::get('error'))
        <div class="alert alert-error">
            {{ $message }}
        </div>
    @endif

    <!-- Filtros -->
    <div class="filters-section">
        <form method="GET" class="filters-form">
            <input 
                type="text" 
                name="search" 
                placeholder="Buscar por nombre o email..." 
                value="{{ $filters['search'] ?? '' }}"
                class="filter-input"
            >
            
            <select name="role" class="filter-select">
                <option value="">Todos los roles</option>
                <option value="admin" {{ $filters['role'] === 'admin' ? 'selected' : '' }}>Admin</option>
                <option value="user" {{ $filters['role'] === 'user' ? 'selected' : '' }}>Usuario</option>
            </select>

            <select name="active" class="filter-select">
                <option value="">Todos los estados</option>
                <option value="1" {{ $filters['active'] === '1' ? 'selected' : '' }}>Activos</option>
                <option value="0" {{ $filters['active'] === '0' ? 'selected' : '' }}>Inactivos</option>
            </select>

            <button type="submit" class="btn btn-primary">Filtrar</button>
            <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Limpiar</a>
        </form>
    </div>

    <!-- Tabla de usuarios -->
    <div class="users-table-container">
        @if($users->count() > 0)
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Registrado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                        <tr class="user-row {{ !$user->is_active ? 'user-row--inactive' : '' }}">
                            <td>{{ $user->id }}</td>
                            <td>
                                <strong>{{ $user->name }}</strong>
                            </td>
                            <td>{{ $user->email }}</td>
                            <td>
                                <span class="badge badge-{{ $user->role }}">
                                    {{ ucfirst($user->role) }}
                                </span>
                            </td>
                            <td>
                                <span class="status-badge {{ $user->is_active ? 'status-badge--active' : 'status-badge--inactive' }}">
                                    {{ $user->is_active ? '✅ Activo' : '❌ Inactivo' }}
                                </span>
                            </td>
                            <td>{{ $user->created_at->format('d/m/Y') }}</td>
                            <td class="actions-cell">
                                <a href="{{ route('admin.users.show', $user) }}" class="btn-icon" title="Ver detalles">
                                    👁️
                                </a>
                                <form action="{{ route('admin.users.update-role', $user) }}" method="POST" class="role-form">
                                    @csrf
                                    @method('PUT')
                                    <select name="role" class="role-select" onchange="this.form.submit()">
                                        <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>Usuario</option>
                                        <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                                    </select>
                                </form>
                                <form action="{{ route('admin.users.toggle-active', $user) }}" method="POST" class="inline-form">
                                    @csrf
                                    @method('PUT')
                                    <button type="submit" class="btn-icon" title="{{ $user->is_active ? 'Desactivar' : 'Activar' }}">
                                        {{ $user->is_active ? '🔒' : '🔓' }}
                                    </button>
                                </form>
                                <form action="{{ route('admin.users.destroy', $user) }}" method="POST" class="inline-form" onsubmit="return confirm('¿Estás seguro?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn-icon btn-icon--danger" title="Eliminar">
                                        🗑️
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Paginación -->
            <div class="pagination-container">
                {{ $users->links() }}
            </div>
        @else
            <div class="empty-state">
                <p>📭 No se encontraron usuarios</p>
            </div>
        @endif
    </div>
</div>

<style>
    .admin-users {
        padding: 20px;
    }

    .page-header {
        margin-bottom: 30px;
    }

    .page-header h1 {
        margin: 0;
        font-size: 1.8rem;
        color: #1f2937;
    }

    .alert {
        padding: 12px 16px;
        border-radius: 6px;
        margin-bottom: 20px;
    }

    .alert-success {
        background-color: #d1fae5;
        color: #065f46;
        border-left: 4px solid #10b981;
    }

    .alert-error {
        background-color: #fee2e2;
        color: #7f1d1d;
        border-left: 4px solid #ef4444;
    }

    .filters-section {
        background: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .filters-form {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .filter-input,
    .filter-select {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.95rem;
    }

    .filter-input {
        flex: 1;
        min-width: 200px;
    }

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
    }

    .btn-primary {
        background-color: #667eea;
        color: white;
    }

    .btn-primary:hover {
        background-color: #5568d3;
    }

    .btn-secondary {
        background-color: #e5e7eb;
        color: #1f2937;
    }

    .btn-secondary:hover {
        background-color: #d1d5db;
    }

    .users-table-container {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .users-table {
        width: 100%;
        border-collapse: collapse;
    }

    .users-table thead {
        background-color: #f3f4f6;
    }

    .users-table th {
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #1f2937;
        border-bottom: 2px solid #e5e7eb;
    }

    .users-table td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
    }

    .user-row--inactive {
        opacity: 0.6;
        background-color: #f9fafb;
    }

    .badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .badge-admin {
        background-color: #fef3c7;
        color: #92400e;
    }

    .badge-user {
        background-color: #dbeafe;
        color: #1e3a8a;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .status-badge--active {
        background-color: #d1fae5;
        color: #065f46;
    }

    .status-badge--inactive {
        background-color: #fee2e2;
        color: #7f1d1d;
    }

    .actions-cell {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .btn-icon {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 4px;
        transition: transform 0.2s;
    }

    .btn-icon:hover {
        transform: scale(1.2);
    }

    .btn-icon--danger {
        color: #ef4444;
    }

    .role-select {
        padding: 6px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.85rem;
        cursor: pointer;
    }

    .inline-form {
        display: inline;
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #9ca3af;
    }

    .pagination-container {
        padding: 20px;
        border-top: 1px solid #e5e7eb;
    }
</style>
@endsection
