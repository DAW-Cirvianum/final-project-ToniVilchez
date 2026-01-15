@extends('admin.layouts.app')

@section('title', 'Usuario: ' . $user->name . ' - Admin Panel')

@section('content')
<div class="user-detail">
    <div class="page-header">
        <a href="{{ route('admin.users.index') }}" class="back-link">← Volver a usuarios</a>
        <h1>👤 {{ $user->name }}</h1>
    </div>

    @if ($message = Session::get('message'))
        <div class="alert alert-success">
            {{ $message }}
        </div>
    @endif

    <div class="detail-grid">
        <!-- Información del usuario -->
        <div class="detail-card">
            <h2>Información Personal</h2>
            
            <form action="{{ route('admin.users.update', $user) }}" method="POST" class="detail-form">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input type="text" id="name" name="name" value="{{ $user->name }}" required>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="{{ $user->email }}" required>
                </div>

                <div class="form-group">
                    <label for="language">Idioma</label>
                    <select id="language" name="language">
                        <option value="ca" {{ $user->language === 'ca' ? 'selected' : '' }}>Català</option>
                        <option value="es" {{ $user->language === 'es' ? 'selected' : '' }}>Español</option>
                        <option value="en" {{ $user->language === 'en' ? 'selected' : '' }}>English</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="password">Nueva Contraseña (opcional)</label>
                    <input type="password" id="password" name="password" placeholder="Dejar en blanco para mantener">
                </div>

                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </form>
        </div>

        <!-- Estado y rol -->
        <div class="detail-card">
            <h2>Configuración</h2>

            <div class="setting-item">
                <label>Rol</label>
                <form action="{{ route('admin.users.update-role', $user) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="form-group">
                        <select name="role" required onchange="this.form.submit()">
                            <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>Usuario Normal</option>
                            <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Administrador</option>
                        </select>
                    </div>
                </form>
            </div>

            <div class="setting-item">
                <label>Estado</label>
                <p>
                    <span class="status-badge {{ $user->is_active ? 'status-badge--active' : 'status-badge--inactive' }}">
                        {{ $user->is_active ? '✅ Activo' : '❌ Inactivo' }}
                    </span>
                </p>
                <form action="{{ route('admin.users.toggle-active', $user) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <button type="submit" class="btn btn-{{ $user->is_active ? 'danger' : 'success' }}">
                        {{ $user->is_active ? '🔒 Desactivar' : '🔓 Activar' }}
                    </button>
                </form>
            </div>

            <div class="setting-item danger-zone">
                <label>Peligro</label>
                <p>Eliminar este usuario permanentemente</p>
                <form action="{{ route('admin.users.destroy', $user) }}" method="POST" onsubmit="return confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">🗑️ Eliminar Usuario</button>
                </form>
            </div>
        </div>

        <!-- Detalles del sistema -->
        <div class="detail-card">
            <h2>Información del Sistema</h2>
            
            <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">{{ $user->id }}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Email verificado</span>
                <span class="detail-value">
                    {{ $user->email_verified_at ? '✅ Sí (' . $user->email_verified_at->format('d/m/Y') . ')' : '❌ No' }}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Creado</span>
                <span class="detail-value">{{ $user->created_at->format('d/m/Y H:i') }}</span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Última actualización</span>
                <span class="detail-value">{{ $user->updated_at->format('d/m/Y H:i') }}</span>
            </div>
        </div>
    </div>
</div>

<style>
    .user-detail {
        padding: 20px;
    }

    .page-header {
        margin-bottom: 30px;
    }

    .back-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        margin-bottom: 10px;
        display: inline-block;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    .page-header h1 {
        margin: 10px 0 0;
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

    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
    }

    .detail-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .detail-card h2 {
        margin: 0 0 20px;
        color: #1f2937;
        font-size: 1.2rem;
    }

    .detail-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .form-group label {
        font-weight: 600;
        color: #1f2937;
        font-size: 0.95rem;
    }

    .form-group input,
    .form-group select {
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.95rem;
        font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.95rem;
    }

    .btn-primary {
        background-color: #667eea;
        color: white;
    }

    .btn-primary:hover {
        background-color: #5568d3;
    }

    .btn-danger {
        background-color: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background-color: #dc2626;
    }

    .btn-success {
        background-color: #10b981;
        color: white;
    }

    .btn-success:hover {
        background-color: #059669;
    }

    .setting-item {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e5e7eb;
    }

    .setting-item label {
        display: block;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 10px;
    }

    .setting-item p {
        margin: 10px 0;
        color: #6b7280;
    }

    .danger-zone {
        background-color: #fef2f2;
        padding: 15px;
        border-left: 4px solid #ef4444;
        border-radius: 4px;
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

    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .detail-label {
        font-weight: 600;
        color: #6b7280;
    }

    .detail-value {
        color: #1f2937;
        font-family: monospace;
    }
</style>
@endsection
