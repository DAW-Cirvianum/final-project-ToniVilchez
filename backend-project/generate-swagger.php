<?php

$openapi = [
    "openapi" => "3.0.0",
    "info" => [
        "title" => "Impostor Game API",
        "description" => "API REST para el juego Impostor Game",
        "version" => "1.0.0",
        "contact" => [
            "email" => "info@impostorgame.com"
        ],
        "license" => [
            "name" => "Apache 2.0",
            "url" => "http://www.apache.org/licenses/LICENSE-2.0.html"
        ]
    ],
    "servers" => [
        [
            "url" => "http://localhost:8000/api",
            "description" => "API Server"
        ]
    ],
    "components" => [
        "securitySchemes" => [
            "sanctum" => [
                "type" => "http",
                "scheme" => "bearer",
                "bearerFormat" => "token"
            ]
        ],
        "schemas" => [
            "User" => [
                "type" => "object",
                "properties" => [
                    "id" => ["type" => "integer"],
                    "name" => ["type" => "string"],
                    "email" => ["type" => "string", "format" => "email"],
                    "role" => ["type" => "string", "enum" => ["user", "admin"]],
                    "language" => ["type" => "string", "enum" => ["ca", "es", "en"]],
                    "is_active" => ["type" => "boolean"],
                    "email_verified_at" => ["type" => "string", "format" => "date-time", "nullable" => true],
                    "created_at" => ["type" => "string", "format" => "date-time"],
                    "updated_at" => ["type" => "string", "format" => "date-time"]
                ]
            ],
            "Category" => [
                "type" => "object",
                "properties" => [
                    "id" => ["type" => "integer"],
                    "name" => ["type" => "string"],
                    "description" => ["type" => "string"],
                    "user_id" => ["type" => "integer"],
                    "created_at" => ["type" => "string", "format" => "date-time"],
                    "updated_at" => ["type" => "string", "format" => "date-time"]
                ]
            ],
            "Word" => [
                "type" => "object",
                "properties" => [
                    "id" => ["type" => "integer"],
                    "word" => ["type" => "string"],
                    "category_id" => ["type" => "integer"],
                    "created_at" => ["type" => "string", "format" => "date-time"],
                    "updated_at" => ["type" => "string", "format" => "date-time"]
                ]
            ],
            "Game" => [
                "type" => "object",
                "properties" => [
                    "id" => ["type" => "integer"],
                    "user_id" => ["type" => "integer"],
                    "category_id" => ["type" => "integer"],
                    "status" => ["type" => "string", "enum" => ["pending", "active", "finished"]],
                    "created_at" => ["type" => "string", "format" => "date-time"],
                    "updated_at" => ["type" => "string", "format" => "date-time"]
                ]
            ],
            "Round" => [
                "type" => "object",
                "properties" => [
                    "id" => ["type" => "integer"],
                    "game_id" => ["type" => "integer"],
                    "word_id" => ["type" => "integer"],
                    "impostor_player_id" => ["type" => "integer"],
                    "voted_player_id" => ["type" => "integer", "nullable" => true],
                    "status" => ["type" => "string", "enum" => ["active", "finished"]],
                    "created_at" => ["type" => "string", "format" => "date-time"],
                    "updated_at" => ["type" => "string", "format" => "date-time"]
                ]
            ],
            "Player" => [
                "type" => "object",
                "properties" => [
                    "id" => ["type" => "integer"],
                    "name" => ["type" => "string"],
                    "game_id" => ["type" => "integer"],
                    "is_impostor" => ["type" => "boolean"],
                    "is_eliminated" => ["type" => "boolean"],
                    "created_at" => ["type" => "string", "format" => "date-time"],
                    "updated_at" => ["type" => "string", "format" => "date-time"]
                ]
            ],
            "SuccessResponse" => [
                "type" => "object",
                "properties" => [
                    "success" => ["type" => "boolean"],
                    "data" => ["type" => "object"],
                    "message" => ["type" => "string"]
                ]
            ],
            "ErrorResponse" => [
                "type" => "object",
                "properties" => [
                    "success" => ["type" => "boolean"],
                    "message" => ["type" => "string"],
                    "errors" => ["type" => "object"]
                ]
            ]
        ]
    ],
    "paths" => [
        "/register" => [
            "post" => [
                "tags" => ["Autenticació"],
                "summary" => "Registrar nou usuari",
                "description" => "Crea un nou usuari i retorna un token d'accés",
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["name", "email", "password", "language"],
                                "properties" => [
                                    "name" => ["type" => "string"],
                                    "email" => ["type" => "string", "format" => "email"],
                                    "password" => ["type" => "string", "format" => "password"],
                                    "language" => ["type" => "string"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "201" => [
                        "description" => "Registre exitós",
                        "content" => [
                            "application/json" => [
                                "schema" => [
                                    "type" => "object",
                                    "properties" => [
                                        "user" => ["\$ref" => "#/components/schemas/User"],
                                        "token" => ["type" => "string"]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "422" => [
                        "description" => "Error de validació",
                        "content" => [
                            "application/json" => [
                                "schema" => ["\$ref" => "#/components/schemas/ErrorResponse"]
                            ]
                        ]
                    ]
                ]
            ]
        ],
        "/login" => [
            "post" => [
                "tags" => ["Autenticació"],
                "summary" => "Iniciar sessió",
                "description" => "Autenticar usuari i obtenir token",
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["login", "password"],
                                "properties" => [
                                    "login" => ["type" => "string"],
                                    "password" => ["type" => "string", "format" => "password"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "200" => [
                        "description" => "Login exitós",
                        "content" => [
                            "application/json" => [
                                "schema" => [
                                    "type" => "object",
                                    "properties" => [
                                        "token" => ["type" => "string"],
                                        "user" => ["\$ref" => "#/components/schemas/User"]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    "401" => [
                        "description" => "Credencials incorrectes"
                    ]
                ]
            ]
        ],
        "/logout" => [
            "post" => [
                "tags" => ["Autenticació"],
                "summary" => "Tancar sessió",
                "security" => [["sanctum" => []]],
                "responses" => [
                    "200" => ["description" => "Logout exitós"]
                ]
            ]
        ],
        "/categories" => [
            "get" => [
                "tags" => ["Categories"],
                "summary" => "Llistar categories",
                "security" => [["sanctum" => []]],
                "responses" => [
                    "200" => [
                        "description" => "Llistat de categories",
                        "content" => [
                            "application/json" => [
                                "schema" => ["\$ref" => "#/components/schemas/SuccessResponse"]
                            ]
                        ]
                    ]
                ]
            ],
            "post" => [
                "tags" => ["Categories"],
                "summary" => "Crear categoria",
                "security" => [["sanctum" => []]],
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["name"],
                                "properties" => [
                                    "name" => ["type" => "string"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "201" => [
                        "description" => "Categoria creada"
                    ],
                    "422" => [
                        "description" => "Error de validació"
                    ]
                ]
            ]
        ],
        "/categories/{id}" => [
            "get" => [
                "tags" => ["Categories"],
                "summary" => "Mostrar categoria",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Categoria trobada"],
                    "404" => ["description" => "Categoria no trobada"]
                ]
            ],
            "put" => [
                "tags" => ["Categories"],
                "summary" => "Actualitzar categoria",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["name"],
                                "properties" => [
                                    "name" => ["type" => "string"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Categoria actualitzada"],
                    "422" => ["description" => "Error de validació"]
                ]
            ],
            "delete" => [
                "tags" => ["Categories"],
                "summary" => "Eliminar categoria",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Categoria eliminada"]
                ]
            ]
        ],
        "/categories/{category_id}/words" => [
            "post" => [
                "tags" => ["Words"],
                "summary" => "Afegir paraula a categoria",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "category_id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["text"],
                                "properties" => [
                                    "text" => ["type" => "string"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "201" => ["description" => "Paraula creada"],
                    "422" => ["description" => "Error de validació"]
                ]
            ]
        ],
        "/words/{id}" => [
            "delete" => [
                "tags" => ["Words"],
                "summary" => "Eliminar paraula",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Paraula eliminada"]
                ]
            ]
        ],
        "/games" => [
            "get" => [
                "tags" => ["Games"],
                "summary" => "Llistar partides",
                "security" => [["sanctum" => []]],
                "responses" => [
                    "200" => ["description" => "Llistat de partides"]
                ]
            ],
            "post" => [
                "tags" => ["Games"],
                "summary" => "Crear partida",
                "security" => [["sanctum" => []]],
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["category_id", "players"],
                                "properties" => [
                                    "category_id" => ["type" => "integer"],
                                    "players" => [
                                        "type" => "array",
                                        "items" => ["type" => "string"]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "201" => ["description" => "Partida creada"],
                    "422" => ["description" => "Error de validació"]
                ]
            ]
        ],
        "/games/{id}" => [
            "get" => [
                "tags" => ["Games"],
                "summary" => "Mostrar partida",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Partida trobada"],
                    "404" => ["description" => "Partida no trobada"]
                ]
            ]
        ],
        "/games/{game_id}/rounds" => [
            "get" => [
                "tags" => ["Rounds"],
                "summary" => "Llistar rounds d'una partida",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "game_id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Llistat de rounds"]
                ]
            ],
            "post" => [
                "tags" => ["Rounds"],
                "summary" => "Crear round",
                "security" => [["sanctum" => []]],
                "parameters" => [
                    [
                        "name" => "game_id",
                        "in" => "path",
                        "required" => true,
                        "schema" => ["type" => "integer"]
                    ]
                ],
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["word_id", "impostor_player_id"],
                                "properties" => [
                                    "word_id" => ["type" => "integer"],
                                    "impostor_player_id" => ["type" => "integer"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "201" => ["description" => "Round creat"],
                    "422" => ["description" => "Error de validació"]
                ]
            ]
        ],
        "/forgot-password" => [
            "post" => [
                "tags" => ["Autenticació"],
                "summary" => "Sol·licitar reset de contrasenya",
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["email"],
                                "properties" => [
                                    "email" => ["type" => "string", "format" => "email"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Enllaç enviat per email"]
                ]
            ]
        ],
        "/reset-password" => [
            "post" => [
                "tags" => ["Autenticació"],
                "summary" => "Restablir contrasenya",
                "requestBody" => [
                    "required" => true,
                    "content" => [
                        "application/json" => [
                            "schema" => [
                                "type" => "object",
                                "required" => ["email", "password", "password_confirmation", "token"],
                                "properties" => [
                                    "email" => ["type" => "string", "format" => "email"],
                                    "password" => ["type" => "string", "format" => "password"],
                                    "password_confirmation" => ["type" => "string", "format" => "password"],
                                    "token" => ["type" => "string"]
                                ]
                            ]
                        ]
                    ]
                ],
                "responses" => [
                    "200" => ["description" => "Contrasenya restablerta"]
                ]
            ]
        ]
    ]
];

file_put_contents(__DIR__ . '/storage/api-docs/api-docs.json', json_encode($openapi, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
echo "✓ OpenAPI documentation generated at storage/api-docs/api-docs.json\n";
