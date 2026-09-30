# Flujo de colaboración

## Antes de programar

1. Actualizar la rama base `SP4`.
2. Crear una rama por conjunto de User Stories.
3. Leer las US antes de crear clases o endpoints.
4. Identificar lectura vs escritura.
5. Reutilizar patrones existentes sin refactorizaciones masivas.

## Convención sugerida de ramas

```text
SP4-USXX-YY-NOMBRE
```

## Antes de commit

```bash
git status
git diff
```

Ejemplos de commit:

```text
feat: add product catalog query
feat: add cart view model
fix: handle repository error
 test: add architecture rule
refactor: isolate mapper
```

## Antes de Pull Request

```bash
cd frontend/sahur-web
npm run build

cd ../../../backend
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
```

No hacer merge directo a `SP4` cuando el equipo esté trabajando mediante Pull Requests.
