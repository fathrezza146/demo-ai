export const getOpenApiSpec = (serverUrl: string = "http://localhost:5000") => ({
  openapi: "3.0.3",
  info: {
    title: "Leave Approval API",
    version: "1.0.0",
    description: "API documentation for leave approval service"
  },
  servers: [
    {
      url: serverUrl
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Profile" }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Check if API server is running",
        responses: {
          "200": {
            description: "Server is up",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email",
        description: "Login endpoint with email-only payload and JWT response",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" }
              }
            }
          },
          "400": {
            description: "Invalid payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Email not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/me": {
      get: {
        tags: ["Profile"],
        summary: "Get current user profile",
        description: "Returns authenticated user profile with role",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Profile success",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MeResponse" }
              }
            }
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          message: { type: "string", example: "Server is up" },
          timestamp: { type: "string", format: "date-time" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "employee@company.com"
          }
        }
      },
      Role: {
        type: "object",
        properties: {
          id: { type: "integer", example: 2 },
          name: { type: "string", example: "MANAGER" },
          description: { type: "string", nullable: true, example: "Can approve leave requests" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 10 },
          email: { type: "string", format: "email", example: "employee@company.com" },
          fullName: { type: "string", example: "John Doe" },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          role: { $ref: "#/components/schemas/Role" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      MeResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string", example: "email not found" }
            }
          }
        }
      }
    }
  }
});
