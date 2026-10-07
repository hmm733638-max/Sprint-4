# Cómo probar y subir la Épica 3

La rama de trabajo debe ser:

```text
SP4-EPICA3-US06-08
```

## 1. Comprobar rama y cambios

```powershell
git branch --show-current
git status
git diff
```

## 2. Verificar frontend

```powershell
cd frontend\sahur-web
npm ci
npm run build
cd ..\..
```

## 3. Verificar backend y pruebas

```powershell
cd backend
dotnet restore Sahur.sln
dotnet build Sahur.sln --configuration Release
dotnet test Sahur.sln --configuration Release
cd ..
```

## 4. Ejecutar la aplicación

Desde la raíz:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\run-dev.ps1
```

Frontend: `http://localhost:4200`

Backend: `http://localhost:5000`

## 5. Casos que deben probarse

1. Administrador puede abrir **Agregar producto**, crear un artículo válido y recibe el nuevo ID.
2. Campos vacíos, precio inválido o URL inválida no realizan petición y quedan marcados.
3. Cliente/Auditor no pueden entrar a `/productos/nuevo` y el backend rechaza `POST` con `403`.
4. Administrador puede editar un producto; los datos aparecen precargados y el botón se bloquea durante el guardado.
5. Cliente/Auditor no ven Editar/Eliminar y un `PUT` o `DELETE` forzado recibe `403`.
6. Eliminar exige confirmación. Cancelar no realiza petición.
7. Confirmar eliminación muestra mensaje de éxito y vuelve al catálogo.

## 6. Commit y push

Después de revisar `git diff`:

```powershell
git add .
git diff --cached
git commit -m "feat: implement Epic 3 product management"
git push origin SP4-EPICA3-US06-08
```

Después crea el Pull Request desde `SP4-EPICA3-US06-08` hacia `SP4`.
