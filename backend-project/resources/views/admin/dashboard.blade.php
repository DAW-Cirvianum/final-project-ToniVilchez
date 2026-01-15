@extends('admin.layouts.app')

@section('title', 'Dashboard - Admin Panel')

@section('content')
<div class="admin-dashboard">
    <div class="dashboard-header">
        <h1>📊 Dashboard Administrativo</h1>
        <p>Bienvenido al panel de administración</p>
    </div>

    <!-- Estadísticas -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
                <div class="stat-value">{{ $totalUsers }}</div>
                <div class="stat-label">Usuarios Totales</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">🔐</div>
            <div class="stat-content">
                <div class="stat-value">{{ $adminUsers }}</div>
                <div class="stat-label">Administradores</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">👤</div>
            <div class="stat-content">
                <div class="stat-value">{{ $userUsers }}</div>
                <div class="stat-label">Usuarios Normales</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
                <div class="stat-value">{{ $activeUsers }}</div>
                <div class="stat-label">Usuarios Activos</div>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon">❌</div>
            <div class="stat-content">
                <div class="stat-value">{{ $inactiveUsers }}</div>
                <div class="stat-label">Usuarios Inactivos</div>
            </div>
        </div>
    </div>

    <!-- Accesos rápidos -->
    <div class="quick-actions">
        <h2>Accesos Rápidos</h2>
        <div class="actions-grid">
            <a href="{{ route('admin.users.index') }}" class="action-card">
                <span class="action-icon">📋</span>
                <span class="action-text">Ver Usuarios</span>
            </a>
            <a href="{{ route('admin.users.index', ['active' => 1]) }}" class="action-card">
                <span class="action-icon">✨</span>
                <span class="action-text">Usuarios Activos</span>
            </a>
            <a href="{{ route('admin.users.index', ['role' => 'admin']) }}" class="action-card">
                <span class="action-icon">🔑</span>
                <span class="action-text">Administradores</span>
            </a>
        </div>
    </div>

    <!-- Información de sistema -->
    <div class="system-info">
        <h2>Información del Sistema</h2>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Versión Laravel:</span>
                <span class="info-value">{{ App::version() }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Entorno:</span>
                <span class="info-value">{{ config('app.env') }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Usuario Actual:</span>
                <span class="info-value">{{ Auth::user()->name }}</span>
            </div>
        </div>
    </div>
</div>

<style>
    .admin-dashboard {
        padding: 20px;
    }

    .dashboard-header {
        margin-bottom: 40px;
    }

    .dashboard-header h1 {
        margin: 0 0 5px;
        font-size: 2rem;
        color: #1f2937;
    }

    .dashboard-header p {
        margin: 0;
        color: #6b7280;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .stat-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 15px;
        align-items: flex-start;
    }

    .stat-icon {
        font-size: 2rem;
    }

    .stat-content {
        flex: 1;
    }

    .stat-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1f2937;
    }

    .stat-label {
        color: #6b7280;
        font-size: 0.9rem;
    }

    .quick-actions {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .quick-actions h2 {
        margin: 0 0 15px;
        color: #1f2937;
    }

    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .action-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: all 0.3s;
        text-align: center;
    }

    .action-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .action-icon {
        font-size: 2rem;
    }

    .action-text {
        font-weight: 600;
        font-size: 0.95rem;
    }

    .system-info {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .system-info h2 {
        margin: 0 0 15px;
        color: #1f2937;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .info-label {
        font-weight: 600;
        color: #6b7280;
    }

    .info-value {
        color: #1f2937;
    }
</style>
@endsection
